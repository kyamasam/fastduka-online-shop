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

interface ProductCardProps {
    product: Product;
    onAddToCart?: (product: Product) => void;
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

    // Helper function to render stars
    const renderStars = (rating: number, totalReviews: number) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const emptyStars = 5 - Math.ceil(rating);

        return (
            <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-0.5">
                    {/* Full stars */}
                    {[...Array(fullStars)].map((_, i) => (
                        <Star
                            key={`full-${i}`}
                            size={16}
                            className="fill-yellow-400 text-yellow-400"
                        />
                    ))}
                    {/* Half star */}
                    {hasHalfStar && (
                        <Star
                            key="half"
                            size={16}
                            className="fill-yellow-400 text-yellow-400"
                            style={{ clipPath: 'inset(0 50% 0 0)' }}
                        />
                    )}
                    {/* Empty stars */}
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
        <div className="flex flex-col h-full">
            {/* Image Container */}
            <div className="relative aspect-[4/5] h-64  rounded-xl overflow-hidden bg-gray-100 mb-4">
                <img
                    src={product.primary_photo || '/placeholder-product.jpg'}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />

                {/* Out of Stock Badge */}
                {product.stock === 0 && (
                    <div
                        className="absolute top-4 right-4 text-white text-xs font-bold px-4 py-1.5 rounded-md uppercase tracking-wider shadow-md"
                        style={{ backgroundColor: '#E91E63' }}
                    >
                        Out-Of-Stock
                    </div>
                )}

                {/* Action Icons Bar - Positioned at bottom of image */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-white rounded-full px-4 py-2 shadow-lg">
                    <button
                        onClick={() => onAddToCart?.(product)}
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-50 transition-colors"
                        aria-label="Add to cart"
                        disabled={product.stock === 0}
                    >
                        <ShoppingCart size={20} className="text-gray-700" />
                    </button>
                    <button
                        onClick={() => onQuickView?.(product)}
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-50 transition-colors"
                        aria-label="Quick view"
                    >
                        <Eye size={20} className="text-gray-700" />
                    </button>
                    <button
                        onClick={() => onAddToWishlist?.(product)}
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-50 transition-colors"
                        aria-label="Add to wishlist"
                    >
                        <Heart size={20} className="text-gray-700" />
                    </button>
                </div>
            </div>

            {/* Product Content */}
            <div className="flex flex-col flex-1">
                {/* Category */}
                <p className="text-sm text-gray-600 mb-1.5">
                    {product.category?.name || 'Home Deco'}
                </p>

                {/* Product Title */}
                <h3 className="text-lg font-normal leading-tight mb-1.5">
                    <Link
                        href={`/product-details/${product.name}/${product.id}`}
                        className="hover:opacity-80 transition-opacity"
                        style={{ color: primary }}
                    >
                        {product.name} - <span className="text-gray-400">{product.stock} Left</span>
                    </Link>
                </h3>

                {/* Description */}
                <p className="text-[15px] text-gray-600 leading-relaxed mb-4 line-clamp-4">
                    {product.description || 'Minimalist yet refined, this handcrafted item adds a touch of natural sophistication to any room.'}
                </p>

                {/* Rating Stars */}
                {renderStars(product.rating || 0, product.reviews_count || 0)}

                {/* Price */}
                <div className="mt-auto">
                    <p className="text-xl font-normal text-gray-900">
                        {formatPrice(product.sale_price || product.selling_price, symbol)}
                    </p>
                </div>
            </div>
        </div>
    );
}