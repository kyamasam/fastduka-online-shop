'use client';

import ReviewForm from '@/components/reviews/ReviewForm';
import { formatPrice } from '@/lib/format';
import { useCurrency, useThemeColors } from '@/store/settings.store';
import { Product } from '@/types/product';
import { Star } from 'lucide-react';
import { useState } from 'react';
import Breadcrumbs from '../Breadcrumbs';

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(product.primary_photo);
  const { symbol } = useCurrency();
  const { primary } = useThemeColors();

  const handleQuantityChange = (type: 'increase' | 'decrease') => {
    if (type === 'increase' && quantity < product.inventory) {
      setQuantity(quantity + 1);
    } else if (type === 'decrease' && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const renderStars = (rating: number, size: number = 20) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={size}
          className={
            i <= Math.floor(rating)
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-yellow-400'
          }
        />
      );
    }
    return stars;
  };

  // Get all product images (primary + additional photos)
  const allImages = [
    product.primary_photo,
    ...product.photos.map((photo) => photo.photo),
  ];

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <div className='container'>

        {/* Breadcrumb */}

        <Breadcrumbs title={product?.name} child_page_label={product.category.name} child_page_label2={product.name} />

        {/* Main Product Section */}
        <div className=" mx-auto ">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Image Gallery */}
            <div className="flex gap-4 h-72">
              {/* Thumbnail Images - Left Side */}
              {allImages.length > 1 && (
                <div className="flex flex-col gap-4 w-24">
                  {allImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(image)}
                      className={`aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 transition-all ${selectedImage === image
                        ? ''
                        : 'border-transparent hover:border-gray-300'
                        }`}
                      style={selectedImage === image ? { borderColor: primary } : undefined}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Main Image */}
              <div className="flex-1 aspect-[3/4] w-2/3 rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Category */}
              <p className="text-sm text-gray-600">{product.category.name}</p>

              {/* Product Name */}
              <h1 className="text-4xl font-bold" style={{ color: primary }}>
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {renderStars(product.review_stats.average_rating)}
                </div>
                <span className="text-gray-600">
                  {product.review_stats.average_rating.toFixed(1)}/5.0 ({product.review_stats.total_reviews} reviews)
                </span>
              </div>

              {/* Description */}
              <p className="text-gray-700 leading-relaxed">{product.description}</p>

              {/* Price */}
              <div className="space-y-1">
                {product.on_sale && product.sale_price > 0 ? (
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 line-through text-lg">
                      {formatPrice(product.selling_price, symbol)}
                    </span>
                    <span className="text-3xl font-bold text-gray-900">
                      {formatPrice(product.sale_price, symbol)}
                    </span>
                  </div>
                ) : (
                  <span className="text-3xl font-bold text-gray-900">
                    {formatPrice(product.selling_price, symbol)}
                  </span>
                )}
              </div>

              {/* Quantity Label */}
              <div>
                <label className="block font-medium mb-3" style={{ color: primary }}>
                  Quantity
                </label>

                <div className="flex gap-4">
                  {/* Quantity Selector */}
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange('decrease')}
                      className="px-4 py-3 hover:bg-gray-50 transition-colors text-gray-600"
                      disabled={quantity <= 1}
                    >
                      −
                    </button>
                    <input
                      type="text"
                      value={quantity}
                      readOnly
                      className="w-16 text-center border-x border-gray-300 py-3 text-gray-900"
                    />
                    <button
                      onClick={() => handleQuantityChange('increase')}
                      className="px-4 py-3 hover:bg-gray-50 transition-colors text-gray-600"
                      disabled={quantity >= product.inventory}
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    disabled={!product.in_stock}
                    className="flex-1 py-3 px-6 rounded-lg border-2 font-medium hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      borderColor: primary,
                      color: primary,
                    }}
                    onMouseEnter={(e) => {
                      if (product.in_stock) {
                        e.currentTarget.style.backgroundColor = primary;
                        e.currentTarget.style.color = 'white';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (product.in_stock) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = primary;
                      }
                    }}
                  >
                    {product.in_stock ? 'Add To Cart' : 'Out of Stock'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Section */}
          <div className="mt-16 border-t border-gray-300 pt-12">
            <h2 className="text-2xl font-bold mb-6">Product Details</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm text-gray-600 mb-2">
                  {product.category.name}
                </h3>
                <h4 className="text-xl font-semibold" style={{ color: primary }}>
                  {product.name}
                </h4>
              </div>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
              {product.additional_information && (
                <div className="mt-4">
                  <p className="text-gray-700">{product.additional_information}</p>
                </div>
              )}
              {!product.additional_information && (
                <p className="text-gray-500 italic">No additional information is available</p>
              )}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-16 border-t border-gray-300 pt-12" id="reviews">
            <h2 className="text-2xl font-bold mb-8">Reviews</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Customer Reviews Summary */}
              <div>
                <h3 className="text-xl font-semibold mb-4" style={{ color: primary }}>
                  Customer reviews
                </h3>
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-5xl font-bold">
                    {product.review_stats.average_rating.toFixed(1)}/5
                  </span>
                  <div className="flex items-center gap-1">
                    {renderStars(product.review_stats.average_rating, 16)}
                  </div>
                </div>

                {/* Rating Breakdown */}
                <div className="space-y-3">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const breakdown =
                      product.review_stats.rating_breakdown[star.toString()];
                    return (
                      <div key={star} className="flex items-center gap-3">
                        <span className="text-sm text-gray-600 w-12">
                          {star} Star
                        </span>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-yellow-400"
                            style={{ width: `${breakdown.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 w-16 text-right">
                          {breakdown.count} ({breakdown.percentage}%)
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Rating & Review */}
                <div className="mt-8">
                  <h4 className="text-lg font-semibold mb-4">Rating & Review</h4>
                  {product.reviews.length === 0 ? (
                    <p className="font-semibold" style={{ color: primary }}>No Reviews Found</p>
                  ) : (
                    <div className="space-y-4">
                      {product.reviews.map((review: any) => (
                        <div key={review.id} className="border-b pb-4">
                          <div className="flex items-center gap-2 mb-2">
                            {renderStars(review.rating, 16)}
                            <span className="text-sm text-gray-600">
                              {review.created_at}
                            </span>
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Review Form */}
              <div>
                <ReviewForm productId={product.id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
