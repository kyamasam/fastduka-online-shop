'use client';

import { formatPrice } from '@/lib/format';
import { useCurrency, useThemeColors } from '@/store/settings.store';
import { Product } from '@/types/product';
import {
    Eye,
    Heart,
    ShoppingCart,
    Star,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react'; // Added useState
// Import your component here
import { QuickViewModal } from './QuickViewModal';

interface ProductCardProps {
    product: Product;
    onAddToCart?: (product: Product, quantity?: number) => void;
    onQuickView?: (product: Product) => void;
    onAddToWishlist?: (product: Product) => void;
}

export function ProductCard({
    product,
    onAddToCart,
    onQuickView,
    onAddToWishlist
}: ProductCardProps) {
    const { symbol } = useCurrency();
    const { primary } = useThemeColors();

    // 1. Manage Modal State
    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

    // Helper function to render stars
    const renderStars = (rating: number, totalReviews: number) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const emptyStars = 5 - Math.ceil(rating);

        return (
            <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-0.5">
                    {[...Array(fullStars)].map((_, i) => (
                        <Star
                            key={`full-${i}`}
                            size={16}
                            className="fill-yellow-400 text-yellow-400"
                        />
                    ))}
                    {hasHalfStar && (
                        <Star
                            key="half"
                            size={16}
                            className="fill-yellow-400 text-yellow-400"
                            style={{ clipPath: 'inset(0 50% 0 0)' }}
                        />
                    )}
                    {[...Array(emptyStars)].map((_, i) => (
                        <Star
                            key={`empty-${i}`}
                            size={16}
                            className="fill-none text-yellow-400"
                        />
                    ))}
                </div>
                <span className="text-sm text-gray-600">
                    {rating} / 5 Stars - {totalReviews} Review{totalReviews !== 1 ? 's' : ''}
                </span>
            </div>
        );
    };

    return (
        <>
            <div className="flex flex-col h-full text-left">
                {/* Image Container */}
                <Link
                    href={`/product/${product.id}/${product.slug}`}
                    className="relative aspect-[4/5] h-64 rounded-xl overflow-hidden bg-gray-100 mb-4 group cursor-pointer block"
                >
                    <img
                        src={product.primary_photo || '/placeholder-product.jpg'}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Out of Stock Badge - Updated to use .in_stock from your JSON */}
                    {!product.in_stock && (
                        <div
                            className="absolute top-4 right-4 text-white text-xs font-bold px-4 py-1.5 rounded-md uppercase tracking-wider shadow-md z-10"
                            style={{ backgroundColor: '#E91E63' }}
                        >
                            Out-Of-Stock
                        </div>
                    )}

                    {/* Action Icons Bar */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-white rounded-full px-4 py-2 shadow-lg translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                onAddToCart?.(product);
                            }}
                            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-50 transition-colors cursor-pointer"
                            aria-label="Add to cart"
                            disabled={!product.in_stock}
                        >
                            <ShoppingCart size={20} className="text-gray-700" />
                        </button>

                        {/* 2. Update Eye Button to open Modal */}
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                setIsQuickViewOpen(true);
                                onQuickView?.(product);
                            }}
                            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-50 transition-colors cursor-pointer"
                            aria-label="Quick view"
                        >
                            <Eye size={20} className="text-gray-700" />
                        </button>

                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                onAddToWishlist?.(product);
                            }}
                            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-50 transition-colors cursor-pointer"
                            aria-label="Add to wishlist"
                        >
                            <Heart size={20} className="text-gray-700" />
                        </button>
                    </div>
                </Link>

                {/* Product Content */}
                <div className="flex flex-col flex-1">
                    <p className="text-sm text-gray-600 mb-1.5">
                        {product.category?.name || 'Home Deco'}
                    </p>

                    <h3 className="text-lg font-normal leading-tight mb-1.5">
                        <Link
                            href={`/product/${product.id}/${product.slug}`}
                            className="hover:opacity-80 transition-opacity cursor-pointer"
                            style={{ color: primary }}
                        >
                            {product.name} - <span className="text-gray-400">{product.inventory} Left</span>
                        </Link>
                    </h3>

                    <p className="text-[15px] text-gray-600 leading-relaxed mb-4 line-clamp-3">
                        {product.description || 'Minimalist yet refined item...'}
                    </p>

                    {/* Updated Rating parameters to match your JSON structure */}
                    {renderStars(
                        product.review_stats?.average_rating || 0,
                        product.review_stats?.total_reviews || 0
                    )}

                    <div className="mt-auto">
                        <p className="text-xl font-bold text-gray-900">
                            {formatPrice(product.sale_price || product.selling_price, symbol)}
                        </p>
                    </div>
                </div>
            </div>

            {/* 3. Call the Separate Component */}
            <QuickViewModal
                product={product}
                isOpen={isQuickViewOpen}
                onClose={() => setIsQuickViewOpen(false)}
                onAddToCart={onAddToCart}
            />
        </>
    );
}