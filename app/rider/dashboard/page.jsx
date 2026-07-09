"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Icon from "../../components/AppIcon";

export default function RiderDashboard() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [claimingId, setClaimingId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 15000); // Poll every 15s
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("/api/rider/orders/available");
      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch available orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const claimOrder = async (orderId) => {
    setClaimingId(orderId);
    try {
      const response = await axios.post(`/api/rider/orders/${orderId}/claim`);
      if (response.data.success) {
        router.push(`/rider/active-order?orderId=${orderId}`);
      }
    } catch (error) {
      console.error("Failed to claim order:", error);
      alert(error.response?.data?.error || "Failed to claim order. Another rider might have taken it.");
      fetchOrders(); // Refresh list immediately if claim fails
    } finally {
      setClaimingId(null);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get("/api/users/logout");
      window.location.href = "/customer-login-register";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="bg-primary p-2 rounded-lg">
            <Icon name="Bike" size={24} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Rider Dashboard</h1>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition"
        >
          <Icon name="LogOut" size={20} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </header>

      <main className="max-w-4xl mx-auto p-4 sm:p-6 mt-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Available Orders</h2>
          <button 
            onClick={() => { setIsLoading(true); fetchOrders(); }}
            className="flex items-center space-x-2 text-primary hover:bg-blue-50 px-3 py-2 rounded-lg transition"
          >
            <Icon name="RefreshCw" size={18} className={isLoading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
        </div>

        {isLoading && orders.length === 0 ? (
          <div className="flex justify-center py-20">
            <Icon name="Loader2" size={40} className="animate-spin text-primary" />
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-12 text-center border border-gray-100">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Coffee" size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No orders available right now</h3>
            <p className="text-gray-500">Take a break! We'll show new orders here when restaurants mark them as ready.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.orderId} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-md transition">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                      Ready for Pickup
                    </span>
                    <span className="text-sm text-gray-500 font-medium">#{order.orderId}</span>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Pickup From</p>
                      <p className="font-medium text-gray-900">{order.restaurant?.name || "Restaurant"}</p>
                      <p className="text-sm text-gray-600 line-clamp-1">{order.restaurant?.address || order.address}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Deliver To</p>
                      <p className="font-medium text-gray-900">{order.customer?.name || "Customer"}</p>
                      <p className="text-sm text-gray-600 line-clamp-1">{order.customer?.address || order.address}</p>
                    </div>
                  </div>
                </div>
                
                <div className="w-full sm:w-auto mt-2 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                  <button
                    onClick={() => claimOrder(order.orderId)}
                    disabled={claimingId === order.orderId}
                    className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg shadow-sm transition disabled:opacity-70 flex items-center justify-center space-x-2"
                  >
                    {claimingId === order.orderId ? (
                      <>
                        <Icon name="Loader2" size={20} className="animate-spin" />
                        <span>Accepting...</span>
                      </>
                    ) : (
                      <>
                        <span>Accept Order</span>
                        <Icon name="ArrowRight" size={18} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
