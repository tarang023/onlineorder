"use client";

import React, { useState } from "react";
import axios from "axios";
import CustomerNavigation from "../components/ui/CustomerNavigation";
import Icon from "../components/AppIcon";

function ReviewUsPage() {
  const [formData, setFormData] = useState({
    rating: 0,
    comment: ""
  });
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleRatingClick = (rating) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.rating === 0 || !formData.comment) {
      setMessage({ type: "error", text: "Please fill in all fields and select a rating." });
      return;
    }

    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await axios.post("/api/reviews", formData);
      if (response.data.success) {
        setMessage({ type: "success", text: "Thank you for your review! Your feedback helps us improve." });
        setFormData({ rating: 0, comment: "" }); // Reset form
      }
    } catch (error) {
      console.error("Failed to submit review:", error);
      setMessage({ type: "error", text: "Something went wrong while submitting your review. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <CustomerNavigation />

      <main className="max-w-3xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
        <div className="bg-surface rounded-2xl shadow-soft p-8 md:p-12 mt-8">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Star" size={32} className="text-primary fill-current" />
            </div>
            <h1 className="text-3xl font-heading font-heading-bold text-text-primary mb-3">
              We Value Your Feedback
            </h1>
            <p className="text-text-secondary font-body">
              How was your experience with TasteBite? Let us know so we can serve you better!
            </p>
          </div>

          {message.text && (
            <div className={`mb-8 p-4 rounded-xl flex items-center space-x-3 ${message.type === 'success' ? 'bg-success-50 text-success-700 border border-success-200' : 'bg-error-50 text-error-700 border border-error-200'}`}>
              <Icon name={message.type === 'success' ? 'CheckCircle' : 'AlertCircle'} size={24} />
              <p className="font-body font-body-medium">{message.text}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-body font-body-bold text-text-primary mb-2">
                Your Rating
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingClick(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="p-1 transition-transform hover:scale-110 focus:outline-none"
                  >
                    <Icon
                      name="Star"
                      size={36}
                      className={`transition-colors duration-200 ${
                        (hoveredRating || formData.rating) >= star
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="comment" className="block text-sm font-body font-body-bold text-text-primary mb-2">
                Your Review
              </label>
              <textarea
                id="comment"
                name="comment"
                rows={5}
                value={formData.comment}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-body text-text-primary transition-smooth bg-surface resize-none"
                placeholder="Tell us what you liked or how we can improve..."
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-primary hover:bg-primary-600 text-white rounded-xl transition-smooth font-body-bold text-lg shadow-soft disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <Icon name="Loader2" size={24} className="animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <span>Submit Review</span>
                </>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default ReviewUsPage;
