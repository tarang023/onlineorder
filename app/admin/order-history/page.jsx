"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import AdminNavigation from "../../components/ui/AdminNavigation";
import Icon from "../../components/AppIcon";

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/admin/orders");
      if (response.data.success) {
        setOrders(response.data.data.orders);
      }
    } catch (error) {
      console.error("Failed to fetch order history", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "new":
        return "bg-primary-100 text-primary-700";
      case "confirmed":
        return "bg-secondary-100 text-secondary-700";
      case "preparing":
        return "bg-warning-100 text-warning-700";
      case "ready":
        return "bg-success-100 text-success-700";
      case "out_for_delivery":
        return "bg-accent-100 text-accent-700";
      case "delivered":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusLabel = (status) => {
    return status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminNavigation />

      <div className="lg:pl-64 pt-16">
        <main className="p-4 md:p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-heading font-heading-bold text-text-primary">
              Order History
            </h1>
            <p className="text-text-secondary font-body mt-1">
              View all past and current orders.
            </p>
          </div>

          <div className="bg-surface rounded-xl shadow-soft p-6">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <Icon name="Loader2" size={48} className="text-primary animate-spin" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="py-3 px-4 font-body font-body-medium text-sm text-text-secondary">Order ID</th>
                      <th className="py-3 px-4 font-body font-body-medium text-sm text-text-secondary">Customer</th>
                      <th className="py-3 px-4 font-body font-body-medium text-sm text-text-secondary">Date & Time</th>
                      <th className="py-3 px-4 font-body font-body-medium text-sm text-text-secondary">Total</th>
                      <th className="py-3 px-4 font-body font-body-medium text-sm text-text-secondary">Status</th>
                      <th className="py-3 px-4 font-body font-body-medium text-sm text-text-secondary">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-text-secondary font-body">
                          No orders found.
                        </td>
                      </tr>
                    ) : (
                      orders.map((order) => (
                        <tr key={order._id} className="border-b border-border hover:bg-surface-50 transition-smooth">
                          <td className="py-3 px-4 font-body font-body-medium text-sm text-text-primary">#{order.orderId}</td>
                          <td className="py-3 px-4 font-body text-sm text-text-primary">{order.customerName}</td>
                          <td className="py-3 px-4 font-body text-sm text-text-secondary">
                            {new Date(order.timestamp).toLocaleString()}
                          </td>
                          <td className="py-3 px-4 font-body text-sm text-text-primary">${order.total?.toFixed(2)}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-body-medium ${getStatusColor(order.status)}`}>
                              {getStatusLabel(order.status)}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="text-primary hover:text-primary-700 text-sm font-body font-body-medium transition-smooth"
                            >
                              Details
                            </button>
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

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-surface rounded-xl shadow-floating w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-surface px-6 py-4 border-b border-border flex justify-between items-center z-10">
              <h2 className="text-xl font-heading font-heading-bold text-text-primary">
                Order #{selectedOrder.orderId} Details
              </h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-text-secondary hover:text-text-primary transition-smooth"
              >
                <Icon name="X" size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Customer & Order Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-body font-body-bold text-text-secondary mb-2 uppercase tracking-wide">Customer Info</h3>
                  <p className="font-body text-text-primary"><span className="font-medium">Name:</span> {selectedOrder.customerName}</p>
                  <p className="font-body text-text-primary"><span className="font-medium">Phone:</span> {selectedOrder.customerPhone}</p>
                  <p className="font-body text-text-primary"><span className="font-medium">Address:</span> {selectedOrder.customerAddress}</p>
                </div>
                <div>
                  <h3 className="text-sm font-body font-body-bold text-text-secondary mb-2 uppercase tracking-wide">Order Info</h3>
                  <p className="font-body text-text-primary"><span className="font-medium">Type:</span> {selectedOrder.orderType || 'Delivery'}</p>
                  <p className="font-body text-text-primary"><span className="font-medium">Payment:</span> {selectedOrder.paymentMethod || 'Cash on Delivery'}</p>
                  <p className="font-body text-text-primary"><span className="font-medium">Status:</span> {getStatusLabel(selectedOrder.status)}</p>
                </div>
              </div>

              {/* Items List */}
              <div>
                <h3 className="text-sm font-body font-body-bold text-text-secondary mb-3 uppercase tracking-wide">Items</h3>
                <div className="border border-border rounded-lg overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-surface-50">
                      <tr>
                        <th className="py-2 px-4 font-body font-body-medium text-xs text-text-secondary">Item</th>
                        <th className="py-2 px-4 font-body font-body-medium text-xs text-text-secondary text-center">Qty</th>
                        <th className="py-2 px-4 font-body font-body-medium text-xs text-text-secondary text-right">Price</th>
                        <th className="py-2 px-4 font-body font-body-medium text-xs text-text-secondary text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {selectedOrder.items?.map((item, idx) => (
                        <tr key={idx}>
                          <td className="py-3 px-4 font-body text-sm text-text-primary">
                            {item.name} {item.variant ? `(${item.variant})` : ''}
                            {item.customizations?.length > 0 && (
                              <div className="text-xs text-text-secondary mt-1">
                                {item.customizations.join(', ')}
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4 font-body text-sm text-text-primary text-center">{item.quantity}</td>
                          <td className="py-3 px-4 font-body text-sm text-text-primary text-right">${item.price?.toFixed(2)}</td>
                          <td className="py-3 px-4 font-body text-sm text-text-primary text-right">${(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-surface-50">
                      <tr>
                        <td colSpan={3} className="py-3 px-4 font-body font-body-bold text-sm text-text-primary text-right">Total:</td>
                        <td className="py-3 px-4 font-body font-body-bold text-sm text-primary text-right">${selectedOrder.total?.toFixed(2)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-border bg-surface-50 flex justify-end rounded-b-xl">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-2 bg-text-secondary text-white rounded-lg hover:bg-text-primary transition-smooth font-body-medium text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderHistory;
