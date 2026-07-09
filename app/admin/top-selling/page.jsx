"use client";


import { useEffect, useState } from "react";
import axios from "axios";
import AdminNavigation from "@/app/components/ui/AdminNavigation";
import Icon from "@/app/components/AppIcon";
import Link from "next/link";

export default function TopSellingItemsPage() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTopSelling = async () => {
      try {
        const response = await axios.get("/api/admin/top-selling");
        if (response.data.success) {
          setItems(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch top selling items", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTopSelling();
  }, []);

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
                <span className="text-text-primary">Top Selling Items</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-heading font-heading-bold text-text-primary">
                Top Selling Items
              </h1>
              <p className="text-text-secondary font-body mt-1">
                Complete list of all items sold, ranked by popularity
              </p>
            </div>
          </div>

          <div className="bg-surface rounded-xl shadow-soft overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center p-12">
                <Icon name="Loader2" size={32} className="text-primary animate-spin" />
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Icon name="Package" size={48} className="text-text-secondary mb-4" />
                <p className="text-text-secondary font-body text-lg">No items to display</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-background-alt border-b border-border">
                      <th className="py-4 px-6 font-heading font-heading-medium text-text-secondary text-sm">Rank</th>
                      <th className="py-4 px-6 font-heading font-heading-medium text-text-secondary text-sm">Item Name</th>
                      <th className="py-4 px-6 font-heading font-heading-medium text-text-secondary text-sm">Category</th>
                      <th className="py-4 px-6 font-heading font-heading-medium text-text-secondary text-sm text-right">Total Sold</th>
                      <th className="py-4 px-6 font-heading font-heading-medium text-text-secondary text-sm text-right">Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {items.map((item) => (
                      <tr key={item.productId} className="hover:bg-secondary-50 transition-smooth">
                        <td className="py-4 px-6 font-body text-text-primary">#{item.id}</td>
                        <td className="py-4 px-6 font-body font-body-medium text-text-primary">{item.name}</td>
                        <td className="py-4 px-6 font-body text-text-secondary">{item.category}</td>
                        <td className="py-4 px-6 font-body text-text-primary text-right">{item.sales}</td>
                        <td className="py-4 px-6 font-body font-body-bold text-primary text-right">
                          ${item.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
