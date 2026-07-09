"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import Icon from "../../components/AppIcon";

export default function ActiveOrderPage() {
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDelivering, setIsDelivering] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    if (!orderId) {
      router.push('/rider/dashboard');
      return;
    }
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      // Use dedicated rider endpoint for getting the order details
      const response = await axios.get(`/api/rider/orders/${orderId}`);
      if (response.data.success) {
        setOrder(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch order details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeliver = async () => {
    setIsDelivering(true);
    try {
      const response = await axios.post(`/api/rider/orders/${order.orderId}/deliver`);
      if (response.data.success) {
        alert("Order delivered successfully!");
        router.push("/rider/dashboard");
      }
    } catch (error) {
      console.error("Failed to mark delivered:", error);
      alert(error.response?.data?.error || "Failed to deliver order.");
    } finally {
      setIsDelivering(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Icon name="Loader2" size={48} className="animate-spin text-primary" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center justify-center">
        <h2 className="text-xl font-bold mb-4">Order not found</h2>
        <button onClick={() => router.push('/rider/dashboard')} className="text-primary hover:underline">
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="bg-white shadow-sm p-4 flex items-center space-x-3 sticky top-0 z-10">
        <button onClick={() => router.push('/rider/dashboard')} className="p-2 hover:bg-gray-100 rounded-full transition">
          <Icon name="ArrowLeft" size={24} className="text-gray-600" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Active Delivery</h1>
      </header>

      <main className="max-w-2xl mx-auto p-4 sm:p-6 mt-2 space-y-6">
        
        {/* Order Meta */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-gray-500 font-medium">Order ID</p>
              <p className="text-lg font-bold text-gray-900">#{order.orderId}</p>
            </div>
            <span className="bg-purple-100 text-purple-800 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
              OUT FOR DELIVERY
            </span>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Icon name="CreditCard" size={20} className="text-gray-500" />
              <span className="font-medium text-gray-700">{order.paymentMethod || 'Cash on Delivery'}</span>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">To Collect</p>
              <p className="font-bold text-lg text-primary">
                ${order.totalAmount 
                  ? order.totalAmount.toFixed(2) 
                  : ((order.items?.reduce((acc, item) => acc + (item.price * item.quantity), 0) || 0) * 1.08).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Locations */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative">
          <div className="absolute left-8 top-10 bottom-10 w-0.5 bg-gray-200"></div>
          
          <div className="flex items-start space-x-4 mb-8 relative z-10">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <Icon name="Store" size={16} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Pickup</p>
              <p className="font-bold text-gray-900 text-lg">{order.restaurant?.name || "Restaurant Name"}</p>
              <p className="text-gray-600 mt-1">{order.restaurant?.address || order.address}</p>
            </div>
          </div>

          <div className="flex items-start space-x-4 relative z-10">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
              <Icon name="MapPin" size={16} className="text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Dropoff</p>
              <p className="font-bold text-gray-900 text-lg">{order.customer?.name || "Customer Name"}</p>
              <p className="text-gray-600 mt-1">{order.customer?.address || order.address}</p>
              {order.customer?.phone && (
                <a href={`tel:${order.customer.phone}`} className="inline-flex items-center space-x-2 mt-3 text-primary hover:text-blue-700 font-medium">
                  <Icon name="Phone" size={16} />
                  <span>Call Customer</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Items List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <Icon name="ShoppingBag" size={20} />
            <span>Order Items</span>
          </h3>
          <ul className="divide-y divide-gray-100">
            {order.items?.map((item, idx) => (
              <li key={idx} className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-800">
                    <span className="text-gray-500 mr-2">{item.quantity}x</span> 
                    {item.name}
                  </p>
                  {item.customizations?.length > 0 && (
                    <p className="text-sm text-gray-500 ml-6">{item.customizations.join(", ")}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={handleDeliver}
            disabled={isDelivering}
            className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-4 rounded-xl shadow-md transition disabled:opacity-70 flex items-center justify-center space-x-2 text-lg"
          >
            {isDelivering ? (
              <>
                <Icon name="Loader2" size={24} className="animate-spin" />
                <span>Marking Delivered...</span>
              </>
            ) : (
              <>
                <Icon name="CheckCircle" size={24} />
                <span>Mark as Delivered</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
