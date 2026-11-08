import JSZip from 'jszip';
import { ASSET_LIBRARY } from '../data/catalog';
import { AssetFolderId, AssetItem } from '../types';

export const OFFLINE_CACHE_NAME = 'shifatdevs-offline-assets-v1';

export interface OfflineCacheStatus {
  cachedIds: Set<string>;
  totalBytes: number;
  sizesById: Record<string, number>;
}

export async function inspectOfflineCache(): Promise<OfflineCacheStatus> {
  const cachedIds = new Set<string>();
  const sizesById: Record<string, number> = {};
  let totalBytes = 0;

  if (typeof window === 'undefined' || !('caches' in window)) {
    return { cachedIds, totalBytes, sizesById };
  }

  try {
    const cache = await caches.open(OFFLINE_CACHE_NAME);
    await Promise.all(
      ASSET_LIBRARY.map(async (asset) => {
        const match = await cache.match(asset.src);
        if (match) {
          cachedIds.add(asset.id);
          const blob = await match.clone().blob();
          sizesById[asset.id] = blob.size;
          totalBytes += blob.size;
        }
      })
    );
  } catch {
    // Ignore CacheStorage errors in restricted contexts
  }

  return { cachedIds, totalBytes, sizesById };
}

export async function cacheAssetsForOffline(
  assets: AssetItem[],
  onProgress?: (done: number, total: number) => void
): Promise<OfflineCacheStatus> {
  if (typeof window === 'undefined' || !('caches' in window)) {
    return inspectOfflineCache();
  }
  const cache = await caches.open(OFFLINE_CACHE_NAME);
  let done = 0;
  for (const asset of assets) {
    try {
      const response = await fetch(asset.src, { cache: 'force-cache' });
      if (response.ok) {
        await cache.put(asset.src, response.clone());
      }
    } catch {
      // Continue caching remaining assets
    }
    done++;
    onProgress?.(done, assets.length);
  }
  return inspectOfflineCache();
}

export async function clearOfflineAssetCache(): Promise<OfflineCacheStatus> {
  if (typeof window !== 'undefined' && 'caches' in window) {
    try {
      await caches.delete(OFFLINE_CACHE_NAME);
    } catch {
      // Ignore
    }
  }
  return inspectOfflineCache();
}

export async function fetchAssetBlob(src: string): Promise<Blob> {
  if (typeof window !== 'undefined' && 'caches' in window) {
    try {
      const cache = await caches.open(OFFLINE_CACHE_NAME);
      const cached = await cache.match(src);
      if (cached) {
        return await cached.blob();
      }
    } catch {
      // Fallback to network/public fetch
    }
  }
  const res = await fetch(src);
  if (!res.ok) throw new Error(`Failed to fetch ${src}`);
  return await res.blob();
}

export async function downloadSingleAsset(
  asset: { src: string; filename?: string; folder?: string },
  customFilename?: string
): Promise<void> {
  const blob = await fetchAssetBlob(asset.src);
  const rawName = customFilename || asset.filename || asset.src.split('/').pop() || 'image.jpg';
  const prefix = asset.folder ? asset.folder.replace(/\//g, '-') + '-' : '';
  const downloadName = customFilename ? customFilename : `shifatdevs-${prefix}${rawName}`;

  const url = URL.createObjectURL(blob);
  const link = Object.assign(document.createElement('a'), {
    href: url,
    download: downloadName,
  });
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function downloadOrganizedAssetsZip(
  assets: AssetItem[],
  folderFilter: 'all' | AssetFolderId = 'all',
  onProgress?: (done: number, total: number) => void
): Promise<void> {
  const zip = new JSZip();
  const rootFolder = zip.folder('shifatdevs-assets')!;

  let done = 0;
  // Deduplicate by folder + filename so each file is written cleanly into its structured subfolder
  for (const asset of assets) {
    try {
      const blob = await fetchAssetBlob(asset.src);
      const targetPath = `${asset.folder}/${asset.filename}`;
      rootFolder.file(targetPath, blob);
    } catch {
      // Skip if unreachable
    }
    done++;
    onProgress?.(done, assets.length);
  }

  // Include an organized JSON & Markdown manifest for offline viewing & cataloging
  const manifest = {
    generatedAt: new Date().toISOString(),
    store: 'Shifatdevs Striped Shirts',
    folderScope: folderFilter,
    totalAssets: assets.length,
    folderStructure: [
      'products/flatlays/',
      'products/lookbook/',
      'editorial/mood/',
      'editorial/journal/',
      'team/avatars/',
    ],
    assets: assets.map((a) => ({
      id: a.id,
      title: a.title,
      relativePath: `${a.folder}/${a.filename}`,
      dimensions: `${a.w}x${a.h}`,
      productSlug: a.productSlug ?? null,
      tags: a.tags,
    })),
  };

  rootFolder.file('asset-manifest.json', JSON.stringify(manifest, null, 2));

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  const zipFilename =
    folderFilter === 'all'
      ? 'shifatdevs-complete-assets-offline.zip'
      : `shifatdevs-${folderFilter.replace(/\//g, '-')}.zip`;

  const url = URL.createObjectURL(zipBlob);
  const link = Object.assign(document.createElement('a'), {
    href: url,
    download: zipFilename,
  });
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}
