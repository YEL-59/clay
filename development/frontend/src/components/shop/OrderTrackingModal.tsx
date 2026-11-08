import React, { useState } from 'react';
import { getOrders, navigate } from '../../store/adminStore';
import { openOrderTracking, useShopStore } from '../../store/shopStore';
import { formatBDT, formatDate } from '../../utils/format';
import { Icon } from '../ui/Icon';

export const OrderTrackingModal: React.FC = () => {
  const shopStore = useShopStore();
  const allOrders = getOrders();

  const [searchId, setSearchId] = useState(shopStore.activeOrderModal || '');

  if (shopStore.activeOrderModal === null) return null;

  const currentId = searchId.trim() || shopStore.activeOrderModal;
  const foundOrder = allOrders.find(
    (o) => o.id.toLowerCase() === currentId.toLowerCase()
  );

  const steps = [
    { key: 'new', label: 'Order Confirmed', sub: 'Received at Dhaka Atelier' },
    { key: 'packing', label: 'Packing', sub: 'Folded & packaged in eco box' },
    { key: 'shipped', label: 'With Courier', sub: 'In transit to your district' },
    { key: 'delivered', label: 'Delivered', sub: 'Package handed over' },
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'new':
        return 0;
      case 'packing':
        return 1;
      case 'shipped':
        return 2;
      case 'delivered':
        return 3;
      case 'returned':
        return -1;
      default:
        return 0;
    }
  };

  const activeIndex = foundOrder ? getStepIndex(foundOrder.status) : 0;

  return (
    <div
      className="modal-backdrop"
      onClick={() => openOrderTracking(null)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="tracking-title"
    >
      <div
        className="modal modal--tracking"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal__header">
          <div className="modal__title-wrap">
            <span className="badge badge--pill badge--teal">
              Real-Time Tracking
            </span>
            <h2 id="tracking-title" className="modal__title">
              Track Your Garment Delivery
            </h2>
          </div>
          <button
            type="button"
            className="ibtn ibtn--ghost"
            onClick={() => openOrderTracking(null)}
            aria-label="Close tracking"
          >
            <Icon name="x" size={20} />
          </button>
        </div>

        <div className="modal__body">
          {/* Search by Order ID */}
          <div className="tracking-search-bar">
            <input
              type="text"
              placeholder="Search Order ID (e.g. RY-84910)"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="input tracking-input"
            />
          </div>

          {!foundOrder ? (
            <div className="tracking-empty">
              <Icon name="search" size={32} />
              <h4>No matching order found</h4>
              <p>Please double check your Order ID (format: RY-XXXXX).</p>
            </div>
          ) : (
            <div className="tracking-result">
              {/* Top Order Status Banner */}
              <div className="tracking-header-card">
                <div>
                  <span className="tracking-order-id">{foundOrder.id}</span>
                  <span className="tracking-order-date">
                    Placed {formatDate(foundOrder.t)}
                  </span>
                </div>
                <div className="tracking-status-pill">
                  <span className={`status-dot status-dot--${foundOrder.status}`} />
                  <strong>
                    {foundOrder.status.toUpperCase()}
                  </strong>
                </div>
              </div>

              {/* 4-Step Visual Progress Bar */}
              {foundOrder.status === 'returned' ? (
                <div className="returned-notice">
                  <Icon name="undo" size={20} />
                  <div>
                    <strong>This order was marked as Returned & Restocked</strong>
                    <p>All garment units have been returned to warehouse inventory.</p>
                  </div>
                </div>
              ) : (
                <div className="stepper-track">
                  {steps.map((st, idx) => {
                    const isDone = idx < activeIndex;
                    const isCurrent = idx === activeIndex;

                    return (
                      <div
                        key={st.key}
                        className={`step-item ${
                          isDone ? 'is-done' : isCurrent ? 'is-current' : ''
                        }`}
                      >
                        <div className="step-circle">
                          {isDone ? (
                            <Icon name="check" size={14} />
                          ) : (
                            <span>{idx + 1}</span>
                          )}
                        </div>
                        <div className="step-text">
                          <span className="step-title">{st.label}</span>
                          <span className="step-sub">{st.sub}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Order Line Items */}
              <div className="tracking-lines-box">
                <h4>Items in this consignment</h4>
                <div className="tracking-lines-list">
                  {foundOrder.lines.map((l, i) => (
                    <div key={i} className="tracking-line-row">
                      <span>
                        Shirt: <strong>{l.slug.replace('shirt-', '')}</strong> · Size <strong>{l.size}</strong> × {l.qty}
                      </span>
                      <span>{formatBDT(l.price * l.qty)}</span>
                    </div>
                  ))}
                </div>

                <div className="tracking-financials">
                  <div>
                    <span>Total: <strong>{formatBDT(foundOrder.total)}</strong></span>
                    <span> · Payment: <strong>{foundOrder.payment.toUpperCase()}</strong></span>
                  </div>
                </div>
              </div>

              {/* Deep link to Admin Kanban */}
              <div className="tracking-admin-callout">
                <Icon name="grid" size={18} />
                <div className="callout-text">
                  <strong>Manage this order in Back Office</strong>
                  <p>
                    Store administrators can update this order status on the drag-and-drop Kanban board.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn--secondary btn--sm"
                  onClick={() => {
                    openOrderTracking(null);
                    navigate('orders');
                  }}
                >
                  View on Kanban →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
