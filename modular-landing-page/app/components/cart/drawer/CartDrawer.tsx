'use client';

import { formatPrice } from '@/lib/format';
import { useCartStore } from '@/store/cart.store';
import { useCurrency, useThemeColors } from '@/store/settings.store';
import { X } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';
import { CartDrawerItem } from './CartDrawerItem';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, getTotalPrice } = useCartStore();
  const { symbol } = useCurrency();
  const { primary } = useThemeColors();

  // Close drawer on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const subtotal = getTotalPrice();

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 style={{ color: primary }} className="text-2xl font-bold">
            Shopping Cart
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close cart"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6">
          {items.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 text-center">Your cart is empty</p>
            </div>
          ) : (
            <div>
              {items.map((item) => (
                <CartDrawerItem
                  key={`${item.product.id}-${item.variant?.id || 'default'}`}
                  item={item}
                  onRemove={removeItem}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 p-6 space-y-4">
            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <span style={{ color: primary }} className="text-xl font-bold">
                Subtotal:
              </span>
              <span className="text-2xl font-bold text-gray-900">
                {formatPrice(subtotal, symbol)}
              </span>
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              <Link
                href="/cart"
                onClick={onClose}
                style={{ backgroundColor: primary }}
                className="block w-full py-4 text-center border-gray-100 text-black font-semibold rounded hover:opacity-90 transition-opacity"
              >
                View Cart
              </Link>
              <Link
                href="/checkout"
                onClick={onClose}
                className="block w-full py-4 text-center font-semibold rounded border-2 hover:bg-gray-50 transition-colors"
                style={{ backgroundColor: primary, color: '#fff' }}
              >
                Checkout {primary}
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
