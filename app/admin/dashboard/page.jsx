"use client";

import Icon from "../../components/AppIcon"
import AdminNavigation from "../../components/ui/AdminNavigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import CustomerSatisfaction from "../../components/restaurant-admin/CustomerSatisfaction";
import LocationPerformance from "../../components/restaurant-admin/LocationPerformance";
import OrderStatusChart from "../../components/restaurant-admin/OrderStatusChart";
import RecentActivity from "../../components/restaurant-admin/RecentActivity";
import SalesOverview from "../../components/restaurant-admin/SalesOverview";
import TopSellingItems from "../../components/restaurant-admin/TopSellingItems";
function RestaurantAdminDashboard() {
  const [dateRange, setDateRange] = useState("week");
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    // Fetch data from API
    const loadData = async () => {
      setIsLoading(true);
      try {
          const response = await axios.get("/api/admin/dashboard");
          if (response.data.success) {
            setDashboardData(response.data.data);
          }
        } catch (error) {
          console.error("Failed to fetch dashboard data", error);
        } finally {
          setIsLoading(false);
        }
    };

    loadData();
  }, [dateRange]);

  const handleDateRangeChange = (range) => {
    setDateRange(range);
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminNavigation />

      <div className="lg:pl-64 pt-16">
        <main className="p-4 md:p-6 lg:p-8">
          {/* Dashboard Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-heading font-heading-bold text-text-primary">
                  Restaurant Dashboard
                </h1>
                <p className="text-text-secondary font-body mt-1">
                  Overview of your restaurant's performance and operations
                </p>
              </div>

              {/* Date Range Selector */}
              <div className="mt-4 md:mt-0 flex items-center space-x-2 bg-surface rounded-lg border border-border p-1">
                {["day", "week", "month", "year"].map((range) => (
                  <button
                    key={range}
                    onClick={() => handleDateRangeChange(range)}
                    className={`px-4 py-2 text-sm font-body font-body-medium rounded-md transition-smooth ${
                      dateRange === range
                        ? "bg-primary text-white"
                        : "text-text-secondary hover:bg-primary-50 hover:text-primary"
                    }`}
                  >
                    {range.charAt(0).toUpperCase() + range.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-96">
              <div className="flex flex-col items-center">
                <Icon
                  name="Loader2"
                  size={48}
                  className="text-primary animate-spin mb-4"
                />
                <p className="text-text-secondary font-body">
                  Loading dashboard data...
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <SummaryCard
                  title="Total Sales"
                  value={`$${dashboardData.summary.totalSales.toLocaleString(
                    "en-US",
                    { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                  )}`}
                  icon="DollarSign"
                  trend={dashboardData.summary.trends?.sales || 0}
                  color="primary"
                />

                <SummaryCard
                  title="Total Orders"
                  value={dashboardData.summary.totalOrders}
                  icon="ShoppingBag"
                  trend={dashboardData.summary.trends?.orders || 0}
                  color="secondary"
                />

                <SummaryCard
                  title="Average Order"
                  value={`$${dashboardData.summary.averageOrderValue.toFixed(
                    2
                  )}`}
                  icon="TrendingUp"
                  trend={dashboardData.summary.trends?.averageOrder || 0}
                  color="accent"
                />

                <SummaryCard
                  title="Customer Satisfaction"
                  value={`${dashboardData.summary.customerSatisfaction}/5`}
                  icon="Star"
                  trend={dashboardData.summary.trends?.satisfaction || 0}
                  color="success"
                />
              </div>

              {/* Main Dashboard Content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Sales Overview Chart - 2/3 width */}
                <div className="lg:col-span-2 bg-surface rounded-xl shadow-soft p-6">
                  <SalesOverview
                    data={dashboardData.salesTrend}
                    dateRange={dateRange}
                  />
                </div>

                {/* Order Status Distribution - 1/3 width */}
                <div className="bg-surface rounded-xl shadow-soft p-6">
                  <OrderStatusChart
                    data={dashboardData.orderStatusDistribution}
                  />
                </div>
              </div>

              {/* Second Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Top Selling Items */}
                <div className="bg-surface rounded-xl shadow-soft p-6">
                  <TopSellingItems items={dashboardData.topSellingItems} />
                </div>

                {/* Recent Activity */}
                <div className="bg-surface rounded-xl shadow-soft p-6">
                  <RecentActivity activities={dashboardData.recentActivity} />
                </div>
              </div>
                   
              <div className="bg-surface rounded-xl shadow-soft p-6 mb-8">
                <h2 className="text-xl font-heading font-heading-medium text-text-primary mb-4">
                  Quick Actions
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  <QuickActionCard
                    title="Menu Items"
                    icon="Utensils"
                    path="/admin-menu"
                    color="primary"
                  />

                  <QuickActionCard
                    title="Orders"
                    icon="ShoppingBag"
                    path="/admin-orders"
                    color="secondary"
                  />

                  <QuickActionCard
                    title="Customers"
                    icon="Users"
                    path="/admin-customers"
                    color="accent"
                  />

                  <QuickActionCard
                    title="Kitchen"
                    icon="ChefHat"
                    path="/kitchen-display-system"
                    color="success"
                  />


                  <QuickActionCard
                    title="Settings"
                    icon="Settings"
                    path="/admin-system-settings"
                    color="error"
                  />
                </div>
              </div>
            </>
          )}
        </main>

        {/* Footer */}
        <footer className="bg-surface border-t border-border p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-4 md:mb-0">
                <p className="text-sm text-text-secondary font-body">
                  &copy; {new Date().getFullYear()} RestaurantHub Pro. All
                  rights reserved.
                </p>
              </div>
              <div className="flex space-x-4">
                <Link
                  href="/admin-system-settings"
                  className="text-sm text-text-secondary hover:text-primary transition-smooth"
                >
                  System Settings
                </Link>
                <Link
                  href="/admin-restaurant-settings"
                  className="text-sm text-text-secondary hover:text-primary transition-smooth"
                >
                  Restaurant Profile
                </Link>
                <a
                  href="#"
                  className="text-sm text-text-secondary hover:text-primary transition-smooth"
                >
                  Help Center
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

// Summary Card Component
function SummaryCard({ title, value, icon, trend, color, dateRange }) {
  const getColorClass = (colorName) => {
    const colorMap = {
      primary: "bg-primary-50 text-primary",
      secondary: "bg-secondary-50 text-secondary",
      accent: "bg-accent-50 text-accent",
      success: "bg-success-50 text-success",
      warning: "bg-warning-50 text-warning",
      error: "bg-error-50 text-error",
    };
    return colorMap[colorName] || colorMap.primary;
  };

  const getTrendIcon = (trendValue) => {
    return trendValue >= 0 ? "TrendingUp" : "TrendingDown";
  };

  const getTrendColorClass = (trendValue) => {
    return trendValue >= 0 ? "text-success" : "text-error";
  };

  return (
    <div className="bg-surface rounded-xl shadow-soft p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-text-secondary font-body text-sm mb-1">{title}</p>
          <h3 className="text-2xl font-heading font-heading-bold text-text-primary">
            {value}
          </h3>
        </div>
        <div className={`p-3 rounded-lg ${getColorClass(color)}`}>
          <Icon name={icon} size={24} />
        </div>
      </div>

      <div className="mt-4 flex items-center">
        <Icon
          name={getTrendIcon(trend)}
          size={16}
          className={getTrendColorClass(trend)}
        />

        <span
          className={`ml-1 text-sm font-body font-body-medium ${getTrendColorClass(
            trend
          )}`}
        >
          {Math.abs(trend)}%
        </span>
        <span className="ml-1 text-xs text-text-secondary font-body">
          vs. previous {dateRange}
        </span>
      </div>
    </div>
  );
}

// Quick Action Card Component
function QuickActionCard({ title, icon, path, color }) {
  const getColorClass = (colorName) => {
    const colorMap = {
      primary: "bg-primary-50 text-primary hover:bg-primary hover:text-white",
      secondary:
        "bg-secondary-50 text-secondary hover:bg-secondary hover:text-white",
      accent: "bg-accent-50 text-accent hover:bg-accent hover:text-white",
      success: "bg-success-50 text-success hover:bg-success hover:text-white",
      warning: "bg-warning-50 text-warning hover:bg-warning hover:text-white",
      error: "bg-error-50 text-error hover:bg-error hover:text-white",
    };
    return colorMap[colorName] || colorMap.primary;
  };

  return (
    <Link
      href={path}
      className={`flex flex-col items-center justify-center p-4 rounded-xl transition-smooth ${getColorClass(
        color
      )}`}
    >
      <Icon name={icon} size={28} />
      <span className="mt-2 text-sm font-body font-body-medium">{title}</span>
    </Link>
  );
}

export default RestaurantAdminDashboard;
