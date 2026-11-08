import React, { useState } from 'react';
import {
  formatPrice,
  mutateEmart,
  setActiveUserTab,
  setActiveView,
  emartToast,
  useEmart,
} from '../../store/emartStore';
import {
  Package,
  User,
  MapPin,
  Heart,
  Truck,
  CheckCircle,
  Clock,
  Shield,
  ExternalLink,
  Plus,
  Receipt,
} from 'lucide-react';

export const EmartUserDashboard: React.FC = () => {
  const store = useEmart();
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(
    store.orders[0]?.id || null
  );

  const selectedOrder =
    store.orders.find((o) => o.id === selectedOrderId) || store.orders[0];

  const totalSpent = store.orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="py-10 bg-slate-50 min-h-[85vh]">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Top Profile Summary Card */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src={store.user.avatarUrl}
                alt={store.user.fullName}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-[#FAB005] shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 bg-emerald-500 w-4 h-4 rounded-full border-2 border-white" />
            </div>

            <div className="space-y-1 text-center sm:text-left">
              <div className="flex items-center gap-2.5 justify-center sm:justify-start">
                <h1 className="text-2xl font-black text-[#023047]">
                  {store.user.fullName}
                </h1>
                <span className="bg-[#FFF8E6] text-[#023047] border border-[#FAB005]/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                  {store.user.memberTier}
                </span>
              </div>
              <p className="text-xs text-slate-500">{store.user.email} • {store.user.phone}</p>
              <p className="text-xs text-slate-400">Dhaka Resident • VIP Fast Dispatch</p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-4 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-8 text-center">
            <div>
              <span className="text-xl font-black text-[#023047] block">
                {store.orders.length}
              </span>
              <span className="text-[11px] font-bold text-slate-400 uppercase">
                Orders
              </span>
            </div>
            <div>
              <span className="text-xl font-black text-[#023047] block">
                {store.wishlist.length}
              </span>
              <span className="text-[11px] font-bold text-slate-400 uppercase">
                Wishlist
              </span>
            </div>
            <div>
              <span className="text-xl font-black text-emerald-600 block">
                {formatPrice(totalSpent, store.currency)}
              </span>
              <span className="text-[11px] font-bold text-slate-400 uppercase">
                Spent
              </span>
            </div>
          </div>
        </div>

        {/* Dashboard Tabs & Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar Tabs */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setActiveUserTab('orders')}
              style={
                store.activeUserTab === 'orders'
                  ? { backgroundColor: '#023047', color: '#ffffff' }
                  : { backgroundColor: '#ffffff', color: '#334155' }
              }
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl font-bold text-xs transition-all cursor-pointer ${
                store.activeUserTab === 'orders'
                  ? 'shadow-md'
                  : 'hover:bg-slate-100 border border-slate-200/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4" style={{ color: store.activeUserTab === 'orders' ? '#FAB005' : '#64748b' }} />
                <span style={{ color: store.activeUserTab === 'orders' ? '#ffffff' : '#1e293b' }}>My Orders & Tracking</span>
              </div>
              <span style={{ backgroundColor: '#FAB005', color: '#0f172a' }} className="px-2 py-0.5 rounded-full text-[10px] font-black">
                {store.orders.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveUserTab('profile')}
              style={
                store.activeUserTab === 'profile'
                  ? { backgroundColor: '#023047', color: '#ffffff' }
                  : { backgroundColor: '#ffffff', color: '#334155' }
              }
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl font-bold text-xs transition-all cursor-pointer ${
                store.activeUserTab === 'profile'
                  ? 'shadow-md'
                  : 'hover:bg-slate-100 border border-slate-200/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <User className="w-4 h-4" style={{ color: store.activeUserTab === 'profile' ? '#FAB005' : '#64748b' }} />
                <span style={{ color: store.activeUserTab === 'profile' ? '#ffffff' : '#1e293b' }}>Profile Settings</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveUserTab('addresses')}
              style={
                store.activeUserTab === 'addresses'
                  ? { backgroundColor: '#023047', color: '#ffffff' }
                  : { backgroundColor: '#ffffff', color: '#334155' }
              }
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl font-bold text-xs transition-all cursor-pointer ${
                store.activeUserTab === 'addresses'
                  ? 'shadow-md'
                  : 'hover:bg-slate-100 border border-slate-200/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4" style={{ color: store.activeUserTab === 'addresses' ? '#FAB005' : '#64748b' }} />
                <span style={{ color: store.activeUserTab === 'addresses' ? '#ffffff' : '#1e293b' }}>Saved Addresses</span>
              </div>
              <span className="text-[10px] text-slate-400">
                {store.user.addresses.length}
              </span>
            </button>

            {/* Admin Switcher Card */}
            <div className="pt-4">
              <div className="bg-[#FFF8E6] border border-[#FAB005]/40 rounded-2xl p-4 space-y-2.5">
                <div className="flex items-center gap-2 text-[#023047] font-bold text-xs">
                  <Shield className="w-4 h-4 text-[#FAB005]" />
                  <span>Store Management</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  Manage inventory, inspect factory POs, and interview salesmen candidates:
                </p>
                <a
                  href="http://localhost:3006/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#FAB005] hover:bg-[#e09d00] text-slate-950 font-bold rounded-xl text-xs shadow-xs transition-transform hover:scale-[1.02]"
                >
                  <span>Launch Admin Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Main Content */}
          <div className="lg:col-span-3">
            {/* Orders Tab */}
            {store.activeUserTab === 'orders' && (
              <div className="space-y-6">
                {/* Active Tracking Spotlight */}
                {selectedOrder && (
                  <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-400 uppercase">
                            Tracking Order:
                          </span>
                          <span className="text-sm font-black text-[#023047]">
                            {selectedOrder.id}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Placed on {new Date(selectedOrder.placedAt).toLocaleDateString()} via {selectedOrder.paymentMethod}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full border border-blue-200 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Status: {selectedOrder.status}</span>
                        </span>
                      </div>
                    </div>

                    {/* 4-Step Visual Progress Stepper */}
                    <div className="pt-2">
                      <div className="grid grid-cols-4 gap-2 text-center relative">
                        {/* Connecting line */}
                        <div className="absolute top-4 left-[12%] right-[12%] h-1 bg-slate-100 -z-0" />
                        <div
                          className="absolute top-4 left-[12%] h-1 bg-[#FAB005] -z-0 transition-all duration-700"
                          style={{
                            width:
                              selectedOrder.status === 'Delivered'
                                ? '76%'
                                : selectedOrder.status === 'Shipped'
                                ? '50%'
                                : selectedOrder.status === 'Processing'
                                ? '25%'
                                : '0%',
                          }}
                        />

                        {/* Step 1: Placed */}
                        <div className="space-y-1.5 relative z-10">
                          <div className="w-8 h-8 rounded-full bg-[#FAB005] text-slate-950 font-bold mx-auto flex items-center justify-center text-xs shadow-md">
                            <CheckCircle className="w-4 h-4" />
                          </div>
                          <span className="text-[11px] font-bold text-slate-800 block">
                            Order Placed
                          </span>
                          <span className="text-[10px] text-slate-400 block">Confirmed</span>
                        </div>

                        {/* Step 2: Processing */}
                        <div className="space-y-1.5 relative z-10">
                          <div
                            className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center text-xs shadow-md font-bold ${
                              selectedOrder.status !== 'Pending'
                                ? 'bg-[#FAB005] text-slate-950'
                                : 'bg-slate-200 text-slate-500'
                            }`}
                          >
                            <Package className="w-4 h-4" />
                          </div>
                          <span className="text-[11px] font-bold text-slate-800 block">
                            Processing
                          </span>
                          <span className="text-[10px] text-slate-400 block">Dhaka Hub</span>
                        </div>

                        {/* Step 3: In Transit */}
                        <div className="space-y-1.5 relative z-10">
                          <div
                            className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center text-xs shadow-md font-bold ${
                              selectedOrder.status === 'Shipped' ||
                              selectedOrder.status === 'Delivered'
                                ? 'bg-[#FAB005] text-slate-950'
                                : 'bg-slate-200 text-slate-500'
                            }`}
                          >
                            <Truck className="w-4 h-4" />
                          </div>
                          <span className="text-[11px] font-bold text-slate-800 block">
                            In Transit
                          </span>
                          <span className="text-[10px] text-slate-400 block">Courier</span>
                        </div>

                        {/* Step 4: Delivered */}
                        <div className="space-y-1.5 relative z-10">
                          <div
                            className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center text-xs shadow-md font-bold ${
                              selectedOrder.status === 'Delivered'
                                ? 'bg-emerald-500 text-white'
                                : 'bg-slate-200 text-slate-500'
                            }`}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </div>
                          <span className="text-[11px] font-bold text-slate-800 block">
                            Delivered
                          </span>
                          <span className="text-[10px] text-slate-400 block">Completed</span>
                        </div>
                      </div>
                    </div>

                    {/* Order Details & Line items */}
                    <div className="pt-4 border-t border-slate-100 space-y-3">
                      <span className="text-xs font-bold text-slate-700 block">
                        Purchased Items:
                      </span>
                      <div className="space-y-2">
                        {selectedOrder.items.map((it, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={it.image}
                                alt={it.name}
                                className="w-12 h-12 rounded-xl object-contain bg-white border border-slate-200 p-1"
                              />
                              <div>
                                <h4 className="text-xs font-bold text-[#023047]">
                                  {it.name}
                                </h4>
                                <span className="text-[11px] text-slate-400">
                                  Qty: {it.qty} {it.selectedSize ? `• Size: ${it.selectedSize}` : ''}
                                </span>
                              </div>
                            </div>

                            <span className="text-xs font-black text-[#023047]">
                              {formatPrice(it.price * it.qty, store.currency)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Total Bar */}
                      <div className="flex items-center justify-between pt-2 text-xs font-bold text-slate-700">
                        <span>Total Paid ({selectedOrder.paymentMethod}):</span>
                        <span className="text-base font-black text-[#023047]">
                          {formatPrice(selectedOrder.total, store.currency)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Orders History List */}
                <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-[#023047] uppercase tracking-wider">
                    All Order Records ({store.orders.length})
                  </h3>

                  <div className="divide-y divide-slate-100">
                    {store.orders.map((ord) => (
                      <div
                        key={ord.id}
                        onClick={() => setSelectedOrderId(ord.id)}
                        className={`py-3.5 flex items-center justify-between cursor-pointer rounded-xl px-3 transition-colors ${
                          selectedOrderId === ord.id ? 'bg-[#FFF8E6]' : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[#023047]">
                              {ord.id}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400">
                              • {ord.items.length} item(s)
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400">
                            {new Date(ord.placedAt).toLocaleDateString()} • {ord.paymentMethod}
                          </p>
                        </div>

                        <div className="text-right space-y-0.5">
                          <span className="text-xs font-black text-[#023047] block">
                            {formatPrice(ord.total, store.currency)}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                            {ord.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {store.activeUserTab === 'profile' && (
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                <h3 className="text-base font-black text-[#023047]">
                  Personal Profile & Security
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-500 font-bold mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      defaultValue={store.user.fullName}
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 font-bold mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      defaultValue={store.user.email}
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 font-bold mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      defaultValue={store.user.phone}
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 font-bold mb-1">
                      Membership Status
                    </label>
                    <input
                      type="text"
                      disabled
                      defaultValue={store.user.memberTier}
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-100 font-bold text-amber-700"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => emartToast('Profile settings updated successfully! 🎉', 'success')}
                    style={{
                      backgroundColor: '#FAB005',
                      color: '#0f172a',
                      padding: '10px 24px',
                      borderRadius: '12px',
                      fontWeight: 800,
                      fontSize: '12px',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                    className="hover:brightness-105 active:scale-95 transition-all shadow-xs"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {/* Addresses Tab */}
            {store.activeUserTab === 'addresses' && (
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-[#023047]">
                    Saved Delivery Addresses
                  </h3>
                  <button
                    type="button"
                    onClick={() => emartToast('Add new address modal coming soon!', 'info')}
                    style={{
                      backgroundColor: '#f1f5f9',
                      color: '#0f172a',
                      padding: '8px 16px',
                      borderRadius: '12px',
                      fontWeight: 700,
                      fontSize: '12px',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                    className="hover:bg-slate-200 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Address</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {store.user.addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2 relative"
                    >
                      {addr.isDefault && (
                        <span className="bg-[#FAB005] text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                          Default Shipping
                        </span>
                      )}
                      <h4 className="text-xs font-black text-[#023047]">{addr.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {addr.address}, {addr.city}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
