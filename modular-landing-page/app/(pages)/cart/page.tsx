'use client';

import Breadcrumbs from '@/components/Breadcrumbs';
import { CartItem } from '@/components/cart/page/CartItems';
import { formatPrice } from '@/lib/format';
import { useCartStore, useCartTotal } from '@/store/cart.store';
import { useCurrency, useSetting, useThemeColors } from '@/store/settings.store';
import Link from 'next/link';
import { useState } from 'react';

export default function Cart() {
  const { symbol } = useCurrency();
  const { primary, secondary } = useThemeColors();

  // Theme Settings
  const primaryColor = useSetting('primary_color');
  const secondaryColor = useSetting('secondary_color');

  // Store Actions & Data
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const { price } = useCartTotal();

  const [coupon, setCoupon] = useState('');

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
        <Link href="/shop" className="text-blue-600 hover:underline">Return to Shop</Link>
      </div>
    );
  }

  return (
    <div className="container flex flex-col justify-center mx-auto px-4">
      {/* Page Header */}
      <Breadcrumbs title='Shopping Cart' menu={[{ label: 'Shopping Cart' }]} />


      <div className="flex flex-col lg:flex-row gap-16 items-start">
        {/* Table Section */}
        <div className="flex-1 w-full">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-800 uppercase tracking-widest">
                  <th className="py-4 px-6">Product</th>
                  <th className="py-4 px-6 text-center">Price</th>
                  <th className="py-4 px-6 text-center">Quantity</th>
                  <th className="py-4 px-6"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <CartItem
                    key={item?.product?.id}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Lower Actions (Coupon & Clear) */}
          <div className="mt-12 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-8">
            <div className="w-full max-w-sm">
              <p className="text-sm font-bold mb-4 uppercase tracking-wider text-gray-700">Coupon Code:</p>
              <div className="flex border border-gray-200">
                <input
                  type="text"
                  placeholder="Enter Coupon Code"
                  className="flex-1 px-5 py-4 text-sm focus:outline-none"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                />
                <button
                  className="px-10 py-4 font-bold text-white transition-opacity hover:opacity-90 uppercase tracking-widest text-sm"
                  style={{ backgroundColor: secondaryColor || '#000' }}
                >
                  Apply
                </button>
              </div>
            </div>

            <button
              onClick={clearCart}
              className="px-12 py-4 border border-gray-200 text-gray-900 font-bold uppercase tracking-widest text-sm hover:bg-gray-50 transition-all"
            >
              Clear Cart
            </button>
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="w-full lg:w-96">
          <div className="bg-white p-10 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100 rounded-sm">
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-gray-900">Subtotal</span>
                <span className="text-2xl font-bold text-gray-900">
                  {formatPrice(price, symbol)}
                </span>
              </div>
              <div className="h-[1px] bg-gray-100 w-full" />
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-gray-900">
                  {formatPrice(price, symbol)}
                </span>
              </div>
            </div>

            <button
              className="w-full mt-12 py-5 font-bold text-white shadow-xl hover:-translate-y-1 transition-all duration-300 uppercase tracking-widest"
              style={{ backgroundColor: secondaryColor || '#000' }}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}