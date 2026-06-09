'use client';

import { formatPrice } from '@/lib/format';
import type { TCartItem } from '@/store/cart.store';
import { useCurrency, useThemeColors } from '@/store/settings.store';
import { X } from 'lucide-react';

interface CartDrawerItemProps {
  item: TCartItem;
  onRemove: (productId: number, variantId?: number) => void;
}

export function CartDrawerItem({ item, onRemove }: CartDrawerItemProps) {
  const { symbol } = useCurrency();
  const { primary } = useThemeColors();
  const { product, quantity, variant } = item;

  const price = variant?.price ?? (product.on_sale ? product.sale_price : product.selling_price);

  return (
    <div className="flex gap-4 py-4 border-b border-gray-100">
      {/* Product Image */}
      <div className="w-20 h-20 flex-shrink-0 bg-gray-50 rounded overflow-hidden">
        <img
          src={product.primary_photo || '/placeholder.jpg'}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <h3 style={{ color: primary }} className="font-semibold text-base mb-1">
          {product.name} x{quantity}
        </h3>
        <p className="text-gray-900 font-bold text-lg">
          {formatPrice(price, symbol)}
        </p>
      </div>

      {/* Remove Button */}
      <button
        onClick={() => onRemove(product.id, variant?.id)}
        className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors border border-gray-300 rounded"
        aria-label="Remove item"
      >
        <X size={16} />
      </button>
    </div>
  );
}
