'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { useThemeColors } from '@/store/settings.store';

interface ReviewFormProps {
  productId: number;
}

export default function ReviewForm({ productId }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerEmail, setReviewerEmail] = useState('');
  const [createAccount, setCreateAccount] = useState(false);
  const { primary } = useThemeColors();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement review submission logic
    console.log({
      productId,
      rating,
      reviewTitle,
      reviewText,
      reviewerName,
      reviewerEmail,
      createAccount,
    });
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4" style={{ color: primary }}>
        Review this product
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        Your email address will not be published. Required fields are marked *
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Star Rating */}
        <div>
          <label className="block text-sm font-medium mb-2">Your Rating :</label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  size={32}
                  className={
                    star <= (hoveredRating || rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'fill-gray-300 text-gray-300'
                  }
                />
              </button>
            ))}
          </div>
        </div>

        {/* Write Review Header */}
        <div>
          <label className="block text-sm font-medium mb-2">Write Review</label>
        </div>

        {/* Review Title */}
        <div>
          <input
            type="text"
            value={reviewTitle}
            onChange={(e) => setReviewTitle(e.target.value)}
            placeholder="Review Title"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
          />
        </div>

        {/* Review Text */}
        <div>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Write your review here..."
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 resize-none"
          />
        </div>

        {/* Your Name */}
        <div>
          <label className="block text-sm font-medium mb-2">Your Name</label>
          <input
            type="text"
            value={reviewerName}
            onChange={(e) => setReviewerName(e.target.value)}
            placeholder="Your Name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
          />
        </div>

        {/* Your Email */}
        <div>
          <label className="block text-sm font-medium mb-2">Your Email</label>
          <input
            type="email"
            value={reviewerEmail}
            onChange={(e) => setReviewerEmail(e.target.value)}
            placeholder="your.email@example.com"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
          />
        </div>

        {/* Create Account Checkbox */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="createAccount"
            checked={createAccount}
            onChange={(e) => setCreateAccount(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300"
          />
          <label htmlFor="createAccount" className="text-sm text-gray-700">
            Create an account for future purchases
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="px-8 py-3 text-white font-medium rounded-lg transition-opacity hover:opacity-90"
          style={{ backgroundColor: primary }}
        >
          Submit Review
        </button>
      </form>
    </div>
  );
}
