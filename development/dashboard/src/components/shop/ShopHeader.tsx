import {
  navigate,
  setTheme,
  useAdminStore,
} from '../../store/adminStore';
import {
  toggleCart,
  openOrderTracking,
  useShopStore,
} from '../../store/shopStore';
import { runViewTransition } from '../../utils/animations';
import { formatBDT } from '../../utils/format';
import { Icon } from '../ui/Icon';

export const ShopHeader: React.FC = () => {
  const adminStore = useAdminStore();
  const shopStore = useShopStore();

  const totalItems = shopStore.cart.reduce((sum, item) => sum + item.qty, 0);
  const cartSubtotal = shopStore.cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <header className="shop-header">
      {/* Top promotional announcement bar */}
      <div className="shop-ticker">
        <div className="shop-ticker__inner">
          <span>🌿 Handcrafted Linen & Combed Cotton</span>
          <span className="shop-ticker__dot">•</span>
          <span>🚚 Free Nationwide Delivery Over ৳3,000</span>
          <span className="shop-ticker__dot">•</span>
          <span>⚡ Drop 03 · Rust Bengal Limited Batch Live Now</span>
          <span className="shop-ticker__dot">•</span>
          <span>🏷️ Use Code <strong>RAYE10</strong> for 10% Off</span>
        </div>
      </div>

      {/* Main navigation toolbar */}
      <div className="shop-nav">
        <div className="shop-nav__left">
          <a
            href="#/shop"
            className="brand brand--shop"
            aria-label="Raye Striped-Shirt Atelier"
          >
            <span className="brand__mark" aria-hidden="true">
              R
            </span>
            <div className="brand__title-wrap">
              <span className="brand__name">Raye</span>
              <span className="brand__sub">striped-shirt studio · dhaka</span>
            </div>
          </a>

          <nav className="shop-nav__links" aria-label="Store navigation">
            <a href="#collection" className="shop-link">
              Collection
            </a>
            <a href="#size-finder" className="shop-link">
              Size Finder
            </a>
            <a href="#drop03" className="shop-link shop-link--highlight">
              Drop 03
            </a>
            <button
              type="button"
              className="shop-link shop-link--btn"
              onClick={() => openOrderTracking('')}
            >
              Track Order
            </button>
          </nav>
        </div>

        <div className="shop-nav__right">
          {/* Quick Switcher to Admin Dashboard */}
          <button
            type="button"
            className="btn btn--secondary btn--sm mode-switch-pill"
            onClick={() => navigate('overview')}
            title="Switch to Store Admin Back Office"
          >
            <Icon name="grid" size={15} />
            <span>Admin Dashboard</span>
          </button>

          {/* Theme Switcher */}
          <button
            type="button"
            className="ibtn ibtn--glass"
            onClick={(e) =>
              runViewTransition(e.currentTarget, () => {
                setTheme(adminStore.theme === 'dark' ? 'light' : 'dark');
              })
            }
            aria-label="Toggle dark/light theme"
            title="Toggle theme"
          >
            <Icon name={adminStore.theme === 'dark' ? 'sun' : 'moon'} size={18} />
          </button>

          {/* Cart Bag Button */}
          <button
            type="button"
            className="shop-bag-btn"
            onClick={() => toggleCart(true)}
            aria-label={`Shopping bag, ${totalItems} items`}
          >
            <Icon name="tag" size={18} />
            <span className="shop-bag-btn__label">Bag</span>
            {totalItems > 0 && (
              <span className="shop-bag-btn__badge">{totalItems}</span>
            )}
            {totalItems > 0 && (
              <span className="shop-bag-btn__total">{formatBDT(cartSubtotal)}</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
