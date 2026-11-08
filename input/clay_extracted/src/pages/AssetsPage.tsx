import React, { useEffect, useMemo, useState } from 'react';
import { Icon } from '../components/ui/Icon';
import {
  Card,
  Drawer,
  EmptyState,
  PageHeader,
  SegmentedControl,
  StatItem,
} from '../components/ui/Primitives';
import {
  ASSET_FOLDERS,
  ASSET_LIBRARY,
  getProductBySlug,
} from '../data/catalog';
import {
  navigate,
  pushToast,
  useAdminStore,
  useRoute,
} from '../store/adminStore';
import { AssetFolderId, AssetItem } from '../types';
import { formatBytes, pluralize } from '../utils/format';
import {
  OfflineCacheStatus,
  cacheAssetsForOffline,
  clearOfflineAssetCache,
  downloadOrganizedAssetsZip,
  downloadSingleAsset,
  inspectOfflineCache,
} from '../utils/offlineAssets';

export const AssetsPage: React.FC = () => {
  useAdminStore();
  const route = useRoute();
  const [search, setSearch] = useState('');
  const [folder, setFolder] = useState<'all' | AssetFolderId>('all');
  const [viewLayout, setViewLayout] = useState<'grid' | 'tree'>('grid');
  const [cacheStatus, setCacheStatus] = useState<OfflineCacheStatus>({
    cachedIds: new Set(),
    totalBytes: 0,
    sizesById: {},
  });
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [progressText, setProgressText] = useState<string>('');

  useEffect(() => {
    inspectOfflineCache().then(setCacheStatus);
  }, []);

  const filteredAssets = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ASSET_LIBRARY.filter(
      (a) =>
        (folder === 'all' || a.folder === folder) &&
        (!q ||
          `${a.title} ${a.filename} ${a.folder} ${a.tags.join(' ')}`
            .toLowerCase()
            .includes(q))
    );
  }, [folder, search]);

  const activeAsset = ASSET_LIBRARY.find((a) => a.id === route.params[0]);

  const handleCacheAllOffline = async () => {
    if (busyAction) return;
    setBusyAction('cache');
    setProgressText(`0 / ${ASSET_LIBRARY.length}`);
    try {
      const updated = await cacheAssetsForOffline(ASSET_LIBRARY, (done, total) => {
        setProgressText(`${done} / ${total}`);
      });
      setCacheStatus(updated);
      pushToast(`${updated.cachedIds.size} assets cached for offline viewing`);
    } finally {
      setBusyAction(null);
      setProgressText('');
    }
  };

  const handleDownloadZip = async (scope: 'all' | AssetFolderId) => {
    if (busyAction) return;
    const targetAssets =
      scope === 'all' ? ASSET_LIBRARY : ASSET_LIBRARY.filter((a) => a.folder === scope);
    setBusyAction('zip');
    setProgressText(`0 / ${targetAssets.length}`);
    try {
      await downloadOrganizedAssetsZip(targetAssets, scope, (done, total) => {
        setProgressText(`${done} / ${total}`);
      });
      pushToast(`Downloaded ${pluralize(targetAssets.length, 'image')} as organized ZIP`);
    } finally {
      setBusyAction(null);
      setProgressText('');
    }
  };

  const handleClearCache = async () => {
    const updated = await clearOfflineAssetCache();
    setCacheStatus(updated);
    pushToast('Offline image cache cleared');
  };

  const cachedPct = Math.round(
    (cacheStatus.cachedIds.size / Math.max(1, ASSET_LIBRARY.length)) * 100
  );

  return (
    <div className="view view--assets">
      <PageHeader
        title={['Asset', 'library']}
        stats={
          <>
            <StatItem
              icon="image"
              value={ASSET_LIBRARY.length}
              fmt={(v) => String(Math.round(v))}
              label="High-res photos in 5 organized folders"
            />
            <StatItem
              icon="offline"
              value={cachedPct}
              fmt={(v) => `${Math.round(v)}%`}
              label={`Cached for offline viewing (${cacheStatus.cachedIds.size}/${ASSET_LIBRARY.length})`}
            />
            <StatItem
              icon="folder"
              value={ASSET_FOLDERS.length - 1}
              fmt={(v) => String(Math.round(v))}
              label="Structured repository directories"
            />
          </>
        }
        actions={
          <>
            <button
              type="button"
              className="btn btn--ghost"
              disabled={!!busyAction}
              onClick={handleCacheAllOffline}
            >
              <Icon name="offline" size={16} />
              {busyAction === 'cache'
                ? `Caching ${progressText}…`
                : cacheStatus.cachedIds.size === ASSET_LIBRARY.length
                  ? 'Offline ready'
                  : 'Save all for offline'}
            </button>
            <button
              type="button"
              className="btn btn--ink"
              disabled={!!busyAction}
              onClick={() => handleDownloadZip(folder)}
            >
              <Icon name="download" size={16} />
              {busyAction === 'zip'
                ? `Archiving ${progressText}…`
                : folder === 'all'
                  ? 'Download all (.zip)'
                  : `Download folder (.zip)`}
            </button>
          </>
        }
      />

      <div className="toolbar" data-in>
        <label className="search">
          <Icon name="search" size={16} />
          <span className="sr">Search assets</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search filename, shirt, folder or tag"
          />
        </label>

        <div className="chips" role="group" aria-label="Asset folders">
          {ASSET_FOLDERS.map((f) => {
            const count =
              f.id === 'all'
                ? ASSET_LIBRARY.length
                : ASSET_LIBRARY.filter((a) => a.folder === f.id).length;
            return (
              <button
                key={f.id}
                type="button"
                className="chip"
                aria-pressed={folder === f.id}
                onClick={() => setFolder(f.id)}
              >
                <Icon name="folder" size={14} />
                {f.label} ({count})
              </button>
            );
          })}
        </div>

        <span className="toolbar__spacer" />

        <SegmentedControl
          label="Layout"
          value={viewLayout}
          onChange={setViewLayout}
          options={[
            { id: 'grid', label: 'Gallery' },
            { id: 'tree', label: 'Folders' },
          ]}
        />
      </div>

      {viewLayout === 'tree' ? (
        <div className="asset-folders">
          {ASSET_FOLDERS.filter((f) => f.id !== 'all').map((f) => {
            const items = ASSET_LIBRARY.filter((a) => a.folder === f.id);
            const cachedInFolder = items.filter((a) =>
              cacheStatus.cachedIds.has(a.id)
            ).length;
            return (
              <Card
                key={f.id}
                title={f.label}
                sub={`${f.path} · ${pluralize(items.length, 'file')} · ${cachedInFolder}/${items.length} offline`}
                tools={
                  <button
                    type="button"
                    className="btn btn--ghost btn--sm"
                    disabled={!!busyAction}
                    onClick={() => handleDownloadZip(f.id as AssetFolderId)}
                  >
                    <Icon name="download" size={15} />
                    Download ZIP
                  </button>
                }
              >
                <p className="card__sub" style={{ marginBottom: 12 }}>
                  {f.description}
                </p>
                <div className="table-wrap">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Preview</th>
                        <th>Title & Structured Path</th>
                        <th>Dimensions</th>
                        <th>Offline Status</th>
                        <th className="r">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => {
                        const isCached = cacheStatus.cachedIds.has(item.id);
                        return (
                          <tr
                            key={item.id}
                            onClick={() => navigate(`assets/${item.id}`)}
                          >
                            <td style={{ width: 56 }}>
                              <img
                                className="thumb"
                                src={item.src}
                                width={42}
                                height={52}
                                alt={item.title}
                                loading="lazy"
                              />
                            </td>
                            <td>
                              <b>{item.title}</b>
                              <small className="muted" style={{ display: 'block' }}>
                                shifatdevs-assets/{item.folder}/{item.filename}
                              </small>
                            </td>
                            <td className="num">
                              {item.w} × {item.h}
                            </td>
                            <td>
                              <span
                                className={`spill spill--${isCached ? 'teal' : 'sky'}`}
                              >
                                <i />
                                {isCached
                                  ? `Cached (${formatBytes(cacheStatus.sizesById[item.id] ?? 0)})`
                                  : 'Local bundle'}
                              </span>
                            </td>
                            <td className="r">
                              <button
                                type="button"
                                className="btn btn--ghost btn--sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  downloadSingleAsset(item).then(() =>
                                    pushToast(`Downloaded ${item.filename}`)
                                  );
                                }}
                              >
                                <Icon name="download" size={15} />
                                Save JPG
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="asset-grid">
          {filteredAssets.map((item) => {
            const isCached = cacheStatus.cachedIds.has(item.id);
            return (
              <article key={item.id} className="acard card" data-in>
                <a
                  href={`#/assets/${item.id}`}
                  className="acard__media"
                  aria-label={`Inspect ${item.title}`}
                >
                  <img
                    src={item.src}
                    width={item.w}
                    height={item.h}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="badge badge--plain acard__folder">
                    {item.folder}
                  </span>
                  {isCached && (
                    <span className="badge badge--teal acard__offline">
                      Offline ready
                    </span>
                  )}
                </a>

                <div className="acard__body">
                  <div className="pcard__row">
                    <a href={`#/assets/${item.id}`} className="pcard__name">
                      {item.title}
                    </a>
                    <span className="muted num">
                      {item.w}×{item.h}
                    </span>
                  </div>
                  <div className="pcard__row muted">
                    <span>{item.filename}</span>
                    {cacheStatus.sizesById[item.id] ? (
                      <span className="num">
                        {formatBytes(cacheStatus.sizesById[item.id])}
                      </span>
                    ) : (
                      <span>#{item.assetNumber}</span>
                    )}
                  </div>
                  <div className="acard__actions">
                    <button
                      type="button"
                      className="btn btn--ghost btn--sm grow"
                      onClick={() => {
                        downloadSingleAsset(item).then(() =>
                          pushToast(`Downloaded ${item.filename}`)
                        );
                      }}
                    >
                      <Icon name="download" size={15} />
                      Download JPG
                    </button>
                    <a
                      href={`#/assets/${item.id}`}
                      className="ibtn ibtn--sm"
                      aria-label={`Details for ${item.title}`}
                      title="Asset details"
                    >
                      <Icon name="out" size={15} />
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {!filteredAssets.length && (
        <Card>
          <EmptyState
            icon="image"
            title="No assets match"
            text="Try another folder or clear the search filter."
          />
        </Card>
      )}

      {cacheStatus.cachedIds.size > 0 && (
        <Card
          className="asset-cache-bar"
          title="Offline viewing storage"
          sub={`${cacheStatus.cachedIds.size} of ${ASSET_LIBRARY.length} high-resolution images stored in browser CacheStorage (${formatBytes(cacheStatus.totalBytes)})`}
          tools={
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={handleClearCache}
            >
              <Icon name="undo" size={15} />
              Clear offline cache
            </button>
          }
        >
          <span className="meter">
            <span
              className="meter__fill tone--teal"
              style={{
                transform: `scaleX(${cacheStatus.cachedIds.size / ASSET_LIBRARY.length})`,
              }}
            />
          </span>
        </Card>
      )}

      <AssetDetailDrawer
        asset={activeAsset}
        isCached={activeAsset ? cacheStatus.cachedIds.has(activeAsset.id) : false}
        cachedSize={activeAsset ? cacheStatus.sizesById[activeAsset.id] : undefined}
        onCacheSingle={async (item) => {
          const updated = await cacheAssetsForOffline([item]);
          setCacheStatus(updated);
          pushToast(`${item.filename} saved for offline viewing`);
        }}
        onClose={() => navigate('assets')}
      />
    </div>
  );
};

const AssetDetailDrawer: React.FC<{
  asset?: AssetItem;
  isCached: boolean;
  cachedSize?: number;
  onCacheSingle: (item: AssetItem) => Promise<void>;
  onClose: () => void;
}> = ({ asset, isCached, cachedSize, onCacheSingle, onClose }) => {
  const linkedProduct = asset?.productSlug
    ? getProductBySlug(asset.productSlug)
    : undefined;

  return (
    <Drawer
      open={!!asset}
      onClose={onClose}
      title={asset?.title ?? ''}
      sub={asset && `shifatdevs-assets/${asset.folder}/${asset.filename}`}
      foot={
        asset && (
          <>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => onCacheSingle(asset)}
            >
              <Icon name="offline" size={16} />
              {isCached ? 'Re-verify offline' : 'Cache offline'}
            </button>
            <button
              type="button"
              className="btn btn--ink grow"
              onClick={() => {
                downloadSingleAsset(asset).then(() =>
                  pushToast(`Downloaded ${asset.filename}`)
                );
              }}
            >
              <Icon name="download" size={16} />
              Download original ({asset.w}×{asset.h})
            </button>
          </>
        )
      }
    >
      {asset && (
        <div className="pd">
          <div className="acard__preview">
            <img
              src={asset.src}
              width={asset.w}
              height={asset.h}
              alt={asset.title}
            />
          </div>

          <dl className="od__sum">
            <div>
              <dt>Filename</dt>
              <dd className="num">{asset.filename}</dd>
            </div>
            <div>
              <dt>Organized folder</dt>
              <dd>{asset.folder}/</dd>
            </div>
            <div>
              <dt>Category</dt>
              <dd>{asset.categoryLabel}</dd>
            </div>
            <div>
              <dt>Dimensions</dt>
              <dd className="num">
                {asset.w} × {asset.h} px
              </dd>
            </div>
            <div>
              <dt>Catalog #</dt>
              <dd className="num">#{asset.assetNumber}</dd>
            </div>
            <div>
              <dt>Offline cache status</dt>
              <dd>
                {isCached
                  ? `Cached (${formatBytes(cachedSize ?? 0)})`
                  : 'Served from local /public bundle'}
              </dd>
            </div>
          </dl>

          {linkedProduct && (
            <section>
              <h3 className="card__title" style={{ marginBottom: 8 }}>
                Linked product
              </h3>
              <a className="cp__fav" href={`#/products/${linkedProduct.slug}`}>
                <img
                  src={linkedProduct.img.src}
                  width={linkedProduct.img.w}
                  height={linkedProduct.img.h}
                  alt={linkedProduct.name}
                />
                <span>
                  <small>{linkedProduct.family} family</small>
                  <b>{linkedProduct.name}</b>
                  <small>Open stock & price drawer →</small>
                </span>
              </a>
            </section>
          )}

          <section>
            <h3 className="card__title" style={{ marginBottom: 8 }}>
              Asset tags
            </h3>
            <div className="sizes-mini">
              {asset.tags.map((tag) => (
                <i key={tag}>{tag}</i>
              ))}
            </div>
          </section>
        </div>
      )}
    </Drawer>
  );
};
