"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Icon from "../components/AppIcon";
import CustomerNavigation from "../components/ui/CustomerNavigation";
import toast from "react-hot-toast";
// Components
import DeliveryMap from "../components/order-tracking/DeliveryMap";
import DriverDetails from "../components/order-tracking/DriverDetails";
import OrderActions from "../components/order-tracking/OrderActions";
import OrderProgressTimeline from "../components/order-tracking/OrderProgressTimeline";
import OrderSummaryCard from "../components/order-tracking/OrderSummaryCard";
import axios from 'axios';

import { useSearchParams } from 'next/navigation';

function OrderTrackingStatus() {
  const [currentOrder, setCurrentOrder] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();


  const orderId = searchParams.get('orderId');
  const total = searchParams.get('total');
  // Mock order data
  const mockOrder = {
    id: "ORD-2024-001234",
    status: "preparing", // confirmed, preparing, ready, out_for_delivery, delivered
    orderTime: new Date(Date.now() - 1800000), // 30 minutes ago
    estimatedDelivery: new Date(Date.now() + 1200000), // 20 minutes from now
    type: "delivery", // delivery or pickup
    restaurant: {
      name: "TasteBite Downtown",
      phone: "+1 (555) 123-4567",
      address: "123 Main Street, Downtown, NY 10001",
    },
    customer: {
      name: "John Doe",
      phone: "+1 (555) 987-6543",
      address: "456 Oak Avenue, Apt 2B, NY 10002",
    },
    items: [
      {
        id: 1,
        name: "Margherita Pizza",
        variant: "Large",
        quantity: 1,
        price: 18.99,
        customizations: ["Extra Cheese", "Thin Crust"],
      },
      {
        id: 2,
        name: "Caesar Salad",
        variant: "Regular",
        quantity: 2,
        price: 12.99,
        customizations: ["No Croutons", "Dressing on Side"],
      },
      {
        id: 3,
        name: "Garlic Bread",
        variant: "6 pieces",
        quantity: 1,
        price: 6.99,
        customizations: [],
      },
    ],
    subtotal: 51.96,
    tax: 4.16,
    deliveryFee: 3.99,
    tip: 8.0,
    total: 68.11,
    paymentMethod: "Credit Card ending in 4532",
    timeline: [
      {
        status: "confirmed",
        timestamp: new Date(Date.now() - 1800000),
        title: "Order Confirmed",
        description: "Your order has been received and confirmed",
      },
      {
        status: "preparing",
        timestamp: new Date(Date.now() - 1200000),
        title: "Preparing Your Order",
        description: "Our kitchen is preparing your delicious meal",
        estimatedCompletion: new Date(Date.now() + 600000),
      },
      {
        status: "ready",
        timestamp: null,
        title: "Ready for Pickup",
        description: "Your order is ready and waiting for delivery",
        estimatedCompletion: new Date(Date.now() + 900000),
      },
      {
        status: "out_for_delivery",
        timestamp: null,
        title: "Out for Delivery",
        description: "Your order is on its way to you",
        estimatedCompletion: new Date(Date.now() + 1200000),
      },
      {
        status: "delivered",
        timestamp: null,
        title: "Delivered",
        description: "Enjoy your meal!",
      },
    ],
    driver: {
      name: "Mike Rodriguez",
      photo: "https://randomuser.me/api/portraits/men/32.jpg",
      phone: "+1 (555) 456-7890",
      vehicle: "Honda Civic - ABC 123",
      rating: 4.8,
      location: {
        lat: 40.7589,
        lng: -73.9851,
      },
    },
    deliveryInstructions: "Ring doorbell twice. Leave at door if no answer.",
    canModify: false,
    canCancel: false,
  };
 

useEffect(() => {
  const loadOrder =async()=>{
      try{
        setIsLoading(true);
        const orderId = searchParams.get('orderId');
        const response =await axios.post("/api/orders/sendDetails");
        console.log("Login success", response.data);
        setCurrentOrder(response.data.data);
        return true;
      }catch(error){
        console.log("Login failed", error.message);
        toast.error(error.message);
      }finally{
        // setIsLoading(false);
      }
    }
   loadOrder();
  },[]);

useEffect(() => {
  // This code will only run AFTER the cartItems state has been successfully updated
  if(currentOrder){
    console.log("1. current orderd data is:",currentOrder);
    setIsLoading(false);
  }
  console.log("2. React has re-rendered. The cartItems are now:",currentOrder);
  if(!isLoading){

    console.log("data type of cartitem",typeof currentOrder);
    currentOrder.items.map((item) => {
      console.log("Item:", item);
    });
  }
},[currentOrder]);









  const handleReorder = () => {
    console.log("Reordering items:", currentOrder.items);
    // Navigate to cart with items
  };

  const handleContactSupport = () => {
    console.log("Opening support chat");
  };

  const handleRateOrder = () => {
    console.log("Opening rating modal");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <CustomerNavigation />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Icon
              name="Loader2"
              size={48}
              className="text-primary animate-spin mx-auto mb-4"
            />
            <p className="text-text-secondary font-body">
              Loading your order details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentOrder) {
    return (
      <div className="min-h-screen bg-background">
        <CustomerNavigation />
        <div className="pt-16 flex items-center justify-center min-h-screen px-4">
          <div className="text-center max-w-md">
            <div className="w-24 h-24 bg-error-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon name="AlertCircle" size={48} className="text-error" />
            </div>
            <h1 className="text-2xl font-heading font-heading-medium text-text-primary mb-4">
              Order Not Found
            </h1>
            <p className="text-text-secondary font-body mb-6">
              We couldn't find the order you're looking for. It may have been
              completed or cancelled.
            </p>
            <Link
              href="/customer-account-order-history"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-700 transition-smooth font-body font-body-medium"
            >
              <Icon name="History" size={20} />
              <span>View Order History</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <CustomerNavigation />

      <div className="pt-16">
        {/* Header */}
        <div className="bg-surface border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-heading font-heading-medium text-text-primary">
                  Order Tracking
                </h1>
                <p className="text-text-secondary font-body mt-1">
                  Order #{currentOrder.orderId}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleContactSupport}
                  className="flex items-center space-x-2 px-4 py-2 border border-border text-text-secondary hover:text-primary hover:border-primary rounded-lg transition-smooth font-body font-body-medium"
                >
                  <Icon name="MessageCircle" size={18} />
                  <span className="hidden sm:inline">Support</span>
                </button>
                <button
                  onClick={handleReorder}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-smooth font-body font-body-medium"
                >
                  <Icon name="RotateCcw" size={18} />
                  <span className="hidden sm:inline">Reorder</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Progress & Summary */}
            <div className="lg:col-span-2 space-y-8">
              {/* Order Progress Timeline */}
              <OrderProgressTimeline
                timeline={currentOrder.timeline}
                currentStatus={currentOrder.status}
              />

              {/* Delivery Map (for delivery orders) */}
              {currentOrder.orderType === "delivery" && (
                <DeliveryMap
                  order={currentOrder}
                  driver={currentOrder.driver}
                />
              )}

              {/* Driver Details (when out for delivery) */}
              {currentOrder.status === "out_for_delivery" &&
                currentOrder.driver && (
                  <DriverDetails driver={currentOrder.driver} />
                )}
            </div>

            {/* Right Column - Order Summary & Actions */}
            <div className="space-y-6">
              {/* Order Summary */}
              <OrderSummaryCard order={currentOrder} />

              {/* Order Actions */}
              <OrderActions
                order={currentOrder}
                onReorder={handleReorder}
                onContactSupport={handleContactSupport}
                onRateOrder={handleRateOrder}
              />

              {/* Restaurant Info */}
              <div className="bg-surface rounded-xl border border-border p-6">
                <h3 className="text-lg font-heading font-heading-medium text-text-primary mb-4">
                  Restaurant Details
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Icon
                      name="Store"
                      size={20}
                      className="text-text-secondary mt-0.5"
                    />
                    <div>
                      <p className="font-body font-body-medium text-text-primary">
                        {currentOrder.restaurant.name}
                      </p>
                      <p className="text-sm text-text-secondary font-body">
                        {currentOrder.restaurant.address}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Icon
                      name="Phone"
                      size={20}
                      className="text-text-secondary"
                    />
                    <a
                      href={`tel:${currentOrder.restaurant.phone}`}
                      className="text-primary hover:text-primary-700 font-body font-body-medium transition-smooth"
                    >
                      {currentOrder.restaurant.phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Delivery Instructions */}
              {currentOrder.type === "delivery" &&
                currentOrder.deliveryInstructions && (
                  <div className="bg-accent-50 rounded-xl border border-accent-200 p-6">
                    <h3 className="text-lg font-heading font-heading-medium text-text-primary mb-3">
                      Delivery Instructions
                    </h3>
                    <p className="text-text-secondary font-body">
                      {currentOrder.deliveryInstructions}
                    </p>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderTrackingStatus;
