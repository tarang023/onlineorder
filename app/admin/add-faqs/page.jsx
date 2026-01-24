 "use client";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Icon from "../../components/AppIcon" // Adjust path to your icon component

export default function AddFaqPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: "General"
  });

  const categories = ["General", "Orders", "Delivery", "Payment", "Account"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post("/api/admin/add-faq", formData);
      if (response.data.success) {
        toast.success("FAQ Added Successfully!");
        setFormData({ question: "", answer: "", category: "General" }); // Reset
      }
    } catch (error) {
      toast.error("Failed to add FAQ");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-soft border border-border/50 p-8">
        
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-primary/10 rounded-xl text-primary">
            <Icon name="HelpCircle" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-heading-bold text-text-primary">Add New FAQ</h1>
            <p className="text-text-secondary">Create helpful content for the support center.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Category Select */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Question Input */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Question</label>
            <input
              type="text"
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none"
              placeholder="e.g., How can I track my order?"
              required
            />
          </div>

          {/* Answer Textarea */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Answer</label>
            <textarea
              value={formData.answer}
              onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
              className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none h-40 resize-none"
              placeholder="Write the detailed answer here..."
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-700 transition-all font-medium flex justify-center items-center gap-2"
          >
            {isLoading ? "Saving..." : <><Icon name="Plus" /> Publish FAQ</>}
          </button>
        </form>
      </div>
    </div>
  );
}