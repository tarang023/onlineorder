"use client";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Icon from "../../components/AppIcon"; // Adjust path to your Icon component

export default function AddAdminPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
console.log("hrer",formData);
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic Validation
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      // Call the API we designed earlier
      const response = await axios.post("/api/admin/add-admin", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: "admin" // Explicitly setting the role here
      });
console.log("response",response);
      if (response.data.success) {
        toast.success("New Admin created successfully!");
        // Optional: Reset form or redirect
        setFormData({ firstName: "", lastName: "", email: "", phone: "", password: "", confirmPassword: "" });
        router.push("/admin/dashboard"); 
      }
    } catch (error) {
        
     const errMsg = error.response?.data?.error || "Failed to create admin";
     toast.error(errMsg);
        alert("only super admin can create admin");
        router.push("/admin/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50 p-6 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-soft p-8 border border-border/50">
        
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading font-heading-bold text-text-primary">
              Add New Admin
            </h1>
            <p className="text-text-secondary font-body mt-1">
              Create a new administrator account with dashboard access.
            </p>
          </div>
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <Icon name="ShieldCheck" size={24} />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <label className="block text-sm font-body font-body-medium text-text-primary mb-2">
                First Name <span className="text-error">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-secondary-50/50"
                placeholder="Sarah"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-body font-body-medium text-text-primary mb-2">
                Last Name <span className="text-error">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-secondary-50/50"
                placeholder="Connor"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-body font-body-medium text-text-primary mb-2">
                Email Address <span className="text-error">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-secondary-50/50"
                placeholder="admin@tastebite.com"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-body font-body-medium text-text-primary mb-2">
                Phone Number <span className="text-error">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-secondary-50/50"
                placeholder="+1 234 567 890"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Password */}
            <div>
              <label className="block text-sm font-body font-body-medium text-text-primary mb-2">
                Password <span className="text-error">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-secondary-50/50"
                placeholder="••••••••"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-body font-body-medium text-text-primary mb-2">
                Confirm Password <span className="text-error">*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-secondary-50/50"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Warning Note */}
          <div className="bg-orange-50 border border-orange-100 p-4 rounded-lg flex items-start gap-3">
            <Icon name="AlertTriangle" size={20} className="text-orange-500 mt-0.5" />
            <p className="text-sm text-orange-800 font-body">
              <strong>Security Notice:</strong> This user will have full access to manage orders, menu items, and customer data. Please verify their identity before creating the account.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 rounded-lg border border-border text-text-secondary font-body font-body-medium hover:bg-secondary-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-3 rounded-lg bg-primary text-white font-body font-body-medium hover:bg-primary-700 transition-all shadow-soft flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Icon name="Loader2" size={20} className="animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Icon name="UserPlus" size={20} />
                  Create Admin Account
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}