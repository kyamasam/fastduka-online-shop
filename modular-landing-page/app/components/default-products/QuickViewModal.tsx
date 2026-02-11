'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Minus, Plus, Star } from 'lucide-react';
import { Product } from '@/types/product';
import { formatPrice } from '@/lib/format';
import { useCurrency } from '@/store/settings.store';

interface QuickViewModalProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
    onAddToCart?: (product: Product, quantity: number) => void;
}

export function QuickViewModal({ product, isOpen, onClose, onAddToCart }: QuickViewModalProps) {
    const { symbol } = useCurrency();
    const [selectedImage, setSelectedImage] = useState<string>('');
    const [quantity, setQuantity] = useState(1);
    const [mounted, setMounted] = useState(false);

    // Ensure component is mounted (client-side only)
    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    // Update selected image when product changes
    useEffect(() => {
        if (product) {
            setSelectedImage(product.primary_photo);
            setQuantity(1);
        }
    }, [product]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen || !product || !mounted) return null;

    // Helper to combine primary photo and gallery photos
    const allPhotos = [
        product.primary_photo,
        ...(product.photos?.map(p => p.photo) || [])
    ].filter(Boolean);

    const handleQuantityChange = (val: number) => {
        if (val < 1) return;
        if (product.inventory && val > product.inventory) return;
        setQuantity(val);
    };

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="relative bg-white w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-sm shadow-2xl flex flex-col md:flex-row"
                onClick={(e) => e.stopPropagation()}
            >

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-1 hover:bg-gray-100 transition-colors"
                >
                    <X size={24} className="text-gray-800" />
                </button>

                {/* Left Side: Image Gallery */}
                <div className="w-full md:w-3/5 flex h-full min-h-[400px]">
                    {/* Thumbnails Sidebar */}
                    <div className="w-24 flex-shrink-0 p-4 space-y-3 overflow-y-auto border-r border-gray-50">
                        {allPhotos.map((photo, idx) => (
                            <div
                                key={idx}
                                className={`aspect-square cursor-pointer overflow-hidden border-2 transition-all ${selectedImage === photo ? 'border-gray-800' : 'border-transparent'
                                    }`}
                                onClick={() => setSelectedImage(photo)}
                            >
                                <img src={photo} alt="" className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>

                    {/* Main Image Display */}
                    <div className="flex-1 bg-gray-50 flex items-center justify-center overflow-hidden">
                        <img
                            src={selectedImage}
                            alt={product.name}
                            className="w-full h-full object-contain"
                        />
                    </div>
                </div>

                {/* Right Side: Product Details */}
                <div className="w-full md:w-2/5 p-8 overflow-y-auto">
                    <p className="text-sm text-gray-500 mb-1">{product.category?.name}</p>
                    <h2 className="text-4xl font-normal text-red-600 mb-4">{product.name}</h2>

                    {/* Rating */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    size={18}
                                    className={i < Math.floor(product.review_stats?.average_rating || 0) ? 'fill-current' : ''}
                                />
                            ))}
                        </div>
                        <span className="text-sm text-gray-600">
                            {product.review_stats?.rating_display || '0.0/5.0 (0 reviews)'}
                        </span>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 leading-relaxed mb-8">
                        {product.description || "No description available."}
                    </p>

                    {/* Price Section */}
                    <div className="flex items-baseline gap-4 mb-2">
                        {product.selling_price > 0 && (
                            <span className="text-gray-400 line-through text-lg">
                                {formatPrice(product.selling_price, symbol)}
                            </span>
                        )}
                        <span className="text-3xl font-medium text-gray-900">
                            {formatPrice(product.sale_price, symbol)}
                        </span>
                    </div>

                    {/* Quantity Selector */}
                    <div className="mt-8 space-y-4">
                        <label className="text-sm font-semibold text-red-600 uppercase">Quantity</label>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center border border-gray-200 rounded-sm">
                                <button
                                    onClick={() => handleQuantityChange(quantity - 1)}
                                    className="p-3 hover:bg-gray-50"
                                >
                                    <Minus size={16} />
                                </button>
                                <input
                                    type="number"
                                    value={quantity}
                                    readOnly
                                    className="w-12 text-center border-none focus:ring-0 text-lg"
                                />
                                <button
                                    onClick={() => handleQuantityChange(quantity + 1)}
                                    className="p-3 hover:bg-gray-50"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>

                            <button
                                onClick={() => onAddToCart?.(product, quantity)}
                                disabled={!product.in_stock}
                                className="flex-1 py-3 px-8 border border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {product.in_stock ? 'Add To Cart' : 'Out of Stock'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}