'use client';

import { formatPrice } from '@/lib/format';
import type { TCartItem } from '@/store/cart.store';
import { useCurrency } from '@/store/settings.store';
import { Minus, Plus, X } from 'lucide-react';


interface CartItemProps {
    item: TCartItem,
    onUpdateQuantity: (id: number, quantity: number) => void;
    onRemove: (id: number) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
    const { symbol } = useCurrency();
    const { product, quantity } = item;

    return (
        <tr className="border-b border-gray-100 group">
            {/* Product Info */}
            <td className="py-8 pr-6">
                <div className="flex items-center gap-6 text-left">
                    <div className="w-16 h-16 flex-shrink-0 bg-gray-50 rounded-sm overflow-hidden">
                        <img
                            src={product.primary_photo || '/placeholder.jpg'}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <span className="text-lg font-medium text-gray-900">{product.name}</span>
                </div>
            </td>

            {/* Price */}
            <td className="py-8 px-6 text-center">
                <span className="text-lg font-medium whitespace-nowrap">
                    {formatPrice(product.sale_price || product.selling_price, symbol)}
                </span>
            </td>

            {/* Quantity Selector */}
            <td className="py-8 px-6">
                <div className="flex justify-center">
                    <div className="flex items-center border border-gray-300 rounded-full px-2 py-1">
                        <button
                            onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                            className="p-1.5 cursor-pointer hover:text-gray-900 text-gray-400 transition-colors"
                        >
                            <Minus size={16} />
                        </button>
                        <span className="w-10 text-center font-semibold text-lg">{quantity}</span>
                        <button
                            onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                            className="p-1.5 cursor-pointer hover:text-gray-900 text-gray-400 transition-colors"
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                </div>
            </td>

            {/* Remove Action */}
            <td className="py-8 pl-6 text-right">
                <button
                    onClick={() => onRemove(product.id)}
                    className="flex flex-col items-center ml-auto gap-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                    <X size={18} />
                    <span className="text-[10px] uppercase font-bold tracking-tighter">Remove</span>
                </button>
            </td>
        </tr>
    );
}