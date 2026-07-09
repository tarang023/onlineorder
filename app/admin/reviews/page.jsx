"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import AdminNavigation from "../../components/ui/AdminNavigation";
import Icon from "../../components/AppIcon";

function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
    // Poll every 30 seconds for real-time updates
    const interval = setInterval(fetchReviews, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get("/api/admin/reviews");
      if (response.data.success) {
        setReviews(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch reviews", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, idx) => (
      <Icon
        key={idx}
        name="Star"
        size={16}
        className={idx < rating ? "text-yellow-400 fill-current" : "text-gray-300"}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminNavigation />

      <div className="lg:pl-64 pt-16">
        <main className="p-4 md:p-6 lg:p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-heading font-heading-bold text-text-primary">
                Customer Reviews
              </h1>
              <p className="text-text-secondary font-body mt-1">
                Real-time feed of customer feedback and ratings.
              </p>
            </div>
            <button 
              onClick={() => { setIsLoading(true); fetchReviews(); }} 
              className="flex items-center space-x-2 bg-surface hover:bg-surface-50 border border-border px-4 py-2 rounded-lg transition-smooth font-body text-sm text-text-primary shadow-sm"
            >
              <Icon name="RefreshCw" size={16} className={isLoading ? "animate-spin" : ""} />
              <span>Refresh</span>
            </button>
          </div>

          <div className="bg-surface rounded-xl shadow-soft p-6">
            {isLoading && reviews.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <Icon name="Loader2" size={48} className="text-primary animate-spin" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="py-3 px-4 font-body font-body-medium text-sm text-text-secondary">Customer</th>
                      <th className="py-3 px-4 font-body font-body-medium text-sm text-text-secondary">Rating</th>
                      <th className="py-3 px-4 font-body font-body-medium text-sm text-text-secondary">Review</th>
                      <th className="py-3 px-4 font-body font-body-medium text-sm text-text-secondary">Date</th>
                      <th className="py-3 px-4 font-body font-body-medium text-sm text-text-secondary">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviews.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-text-secondary font-body">
                          No reviews found.
                        </td>
                      </tr>
                    ) : (
                      reviews.map((review) => (
                        <tr key={review._id} className="border-b border-border hover:bg-surface-50 transition-smooth">
                          <td className="py-3 px-4 font-body font-body-medium text-sm text-text-primary">
                            {review.customerName}
                          </td>
                          <td className="py-3 px-4 flex items-center space-x-1">
                            {renderStars(review.rating)}
                          </td>
                          <td className="py-3 px-4 font-body text-sm text-text-secondary max-w-md truncate">
                            {review.comment}
                          </td>
                          <td className="py-3 px-4 font-body text-sm text-text-secondary">
                            {new Date(review.date).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-body-medium ${
                              review.status === 'published' ? 'bg-success-100 text-success-700' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {review.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default ReviewsPage;
