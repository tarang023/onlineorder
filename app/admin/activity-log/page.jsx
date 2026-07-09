"use client";

import AdminNavigation from "@/app/components/ui/AdminNavigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Icon from "@/app/components/AppIcon";
import Link from "next/link";

export default function ActivityLogPage() {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActivityLog = async () => {
      try {
        const response = await axios.get("/api/admin/activity-log");
        if (response.data.success) {
          setActivities(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch activity log", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchActivityLog();
  }, []);

  const getRelativeTime = (timestamp) => {
    const now = new Date();
    const targetDate = new Date(timestamp);
    const diffInMinutes = Math.floor((now - targetDate) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getActivityIcon = (type) => {
    const iconMap = {
      order: "ShoppingBag",
      inventory: "Package",
      review: "Star",
      system: "Settings",
      payment: "CreditCard",
      staff: "Users",
      customer: "User",
    };
    return iconMap[type] || "Bell";
  };

  const getStatusColor = (status) => {
    const colorMap = {
      new: "bg-primary-100 text-primary-700 border-primary-200",
      success: "bg-success-100 text-success-700 border-success-200",
      warning: "bg-warning-100 text-warning-700 border-warning-200",
      error: "bg-error-100 text-error-700 border-error-200",
      info: "bg-secondary-100 text-secondary-700 border-secondary-200",
      positive: "bg-success-100 text-success-700 border-success-200",
    };
    return colorMap[status] || "bg-secondary-100 text-secondary-700 border-secondary-200";
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminNavigation />

      <div className="lg:pl-64 pt-16">
        <main className="p-4 md:p-6 lg:p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <div className="flex items-center text-sm text-text-secondary mb-2">
                <Link href="/admin/dashboard" className="hover:text-primary transition-smooth">
                  Dashboard
                </Link>
                <Icon name="ChevronRight" size={16} className="mx-2" />
                <span className="text-text-primary">Activity Log</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-heading font-heading-bold text-text-primary">
                Activity Log
              </h1>
              <p className="text-text-secondary font-body mt-1">
                Complete history of all recent orders and system activities
              </p>
            </div>
          </div>

          <div className="bg-surface rounded-xl shadow-soft overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center p-12">
                <Icon name="Loader2" size={32} className="text-primary animate-spin" />
              </div>
            ) : activities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Icon name="Calendar" size={48} className="text-text-secondary mb-4" />
                <p className="text-text-secondary font-body text-lg">No activities to display</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-background-alt border-b border-border">
                      <th className="py-4 px-6 font-heading font-heading-medium text-text-secondary text-sm">Type</th>
                      <th className="py-4 px-6 font-heading font-heading-medium text-text-secondary text-sm">Description</th>
                      <th className="py-4 px-6 font-heading font-heading-medium text-text-secondary text-sm">Status</th>
                      <th className="py-4 px-6 font-heading font-heading-medium text-text-secondary text-sm text-right">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {activities.map((activity) => (
                      <tr key={activity.id} className="hover:bg-secondary-50 transition-smooth">
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            <div className={`p-2 rounded-lg mr-3 ${getStatusColor(activity.status).split(' ')[0]} ${getStatusColor(activity.status).split(' ')[1]}`}>
                              <Icon name={getActivityIcon(activity.type)} size={18} />
                            </div>
                            <span className="font-body font-body-medium text-text-primary capitalize">{activity.type}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-body font-body-medium text-text-primary">{activity.title}</div>
                          <div className="text-sm font-body text-text-secondary">{activity.description}</div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-2.5 py-1 text-xs font-body font-body-medium rounded-full border ${getStatusColor(activity.status)}`}>
                            {activity.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="font-body font-body-medium text-text-primary whitespace-nowrap">
                            {getRelativeTime(activity.timestamp)}
                          </div>
                          <div className="text-xs font-body text-text-secondary whitespace-nowrap">
                            {new Date(activity.timestamp).toLocaleDateString()} {new Date(activity.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </div>
                        </td>
                      </tr>
                    ))}
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
