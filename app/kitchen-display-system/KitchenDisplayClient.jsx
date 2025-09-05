// src/pages/kitchen-display-system/index.jsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Icon from '../components/AppIcon';
import KitchenInterface from '../components/ui/KitchenInterface';
import axios from 'axios';
import StationFilter from '../components/kitchen-display/StationFilter';
import OrderStatusColumn from '../components/kitchen-display/OrderStatusColumn';
import PerformanceMetrics from '../components/kitchen-display/PerformanceMetrics';
import OrderModificationAlert from '../components/kitchen-display/OrderModificationAlert';
 

function KitchenDisplayClient({initialOrders}) {

  const [orders, setOrders] = useState(initialOrders);
  const [selectedStation, setSelectedStation] = useState('all');
 
  const [isLoading, setIsLoading] = useState(false);
  const [modifiedOrders, setModifiedOrders] = useState();
  const [showMetrics, setShowMetrics] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [status,changeStatus]=useState(false);
 
  //handle order update from server
  const handleOrderStatusUpdate = useCallback(async (orderId, newStatus) => {
    changeStatus(true);
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: newStatus, lastUpdated: new Date() } : order
      )
    );
    await axios.post("/api/orders/changeOrder",{orderId:orderId,status:newStatus})

  }, []);

  // Handle order priority updates
  const handleOrderPriorityUpdate = useCallback((orderId, newPriority) => {
    setOrders(prevOrders =>
      prevOrders?.map(order =>
        order?.id === orderId ? { ...order, priority: newPriority } : order
      )
    );
  }, []);

  // Handle item completion toggle
  const handleItemToggle = useCallback((orderId, itemId) => {
 
    setOrders(prevOrders =>
      prevOrders?.map(order => {
        console.log(order.id)
        if (order?.id === orderId) {
          return {
            ...order,
            items: order?.items?.map(item =>
              item?.productId === itemId ? { ...item, completed: !item?.completed } : item
            )
          };
        }
        return order;
      })
    );
  }, []);


  // Filter orders by station
  const filteredOrders = ()=>{ 
  
  orders.length > 0 &&  orders?.filter(order => {
    if (selectedStation === 'all') return true;
    return order?.station === selectedStation;
  }) || [];
}

  // Group orders by status
  
   
  const newOrder=orders.length > 0 && orders.filter((order)=>(order.status=='new')) || [];
  const inprogressOrder=orders.length > 0 && orders.filter((order)=>(order.status=='in-progress')) || [];
  const readyOrder=orders.length > 0 && orders.filter((order)=>(order.status=='ready')) || [];
  const completedOrder=orders.length > 0 && orders.filter((order)=>(order.status=='completed')) || [];
 

  // Calculate performance metrics
  const performanceMetrics = {
    averagePrepTime: 12.5,
    completionRate: 94.2,
    // activeOrders: filteredOrders?.filter(order => order?.status !== 'completed')?.length || 0,
    activeOrders: filteredOrders?.order?.status !== 'completed'?.length || 0,
    totalOrders: filteredOrders?.length || 0
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Icon name="Loader2" size={48} className="text-primary animate-spin mb-4" />
          <p className="text-text-secondary font-body">Loading kitchen display system...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* <KitchenInterface /> */}
      
      <div className="pt-20 p-4 lg:p-6">
        {/* Kitchen Header */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl lg:text-3xl font-heading font-heading-bold text-text-primary">
                Kitchen Display System
              </h1>
              <p className="text-text-secondary font-body mt-1">
                Real-time order management and preparation coordination
              </p>
            </div>
            
            {/* Header Actions */}
            <div className="mt-4 lg:mt-0 flex items-center space-x-4">
              <button
                onClick={() => setShowMetrics(!showMetrics)}
                className={`px-4 py-2 rounded-lg font-body font-body-medium transition-smooth ${
                  showMetrics
                    ? 'bg-primary text-white' :'bg-surface text-text-secondary hover:bg-primary-50 hover:text-primary border border-border'
                }`}
              >
                <Icon name="BarChart3" size={16} className="mr-2" />
                Metrics
              </button>
              
            </div>
          </div>
        </div>
        
                
        {/* Station Filter */}
       
        <StationFilter
          selectedStation={selectedStation}
          onStationChange={setSelectedStation}
          orderCounts={{
            all: orders?.length || 0,
            grill: orders?.length > 0 && orders.filter((order) => order.station === 'grill').length || 0,
            fryer: orders?.length > 0 && orders.filter((order) => order.station === 'fryer').length || 0,
            salad: orders?.length > 0 && orders.filter((order) => order.station === 'salad').length || 0,
            beverages: orders?.length > 0 && orders.filter((order) => order.station === 'beverages').length || 0
          }}
          orderByStatus={{
             new: orders?.length > 0 && orders.filter((order) => order.status === 'new').length || 0,
            inprogress: orders?.length > 0 && orders.filter((order) => order.status === 'inprogress').length || 0,
            ready: orders?.length > 0 && orders.filter((order) => order.status === 'ready').length || 0,
            completed: orders?.length > 0 && orders.filter((order) => order.status === 'completed').length || 0,

          }
          }
        />

        {/* Performance Metrics */}
        {showMetrics && (
          <PerformanceMetrics metrics={performanceMetrics} className="mb-6" />
        )}

        {/* Order Modification Alerts */}
        {modifiedOrders?.length > 0 && (
          <OrderModificationAlert
            orders={modifiedOrders}
            onDismiss={(orderId) => {
              setModifiedOrders(prev => prev?.filter(order => order?.id !== orderId) || []);
            }}
            className="mb-6"
          />
        )}

        {/* Orders Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <OrderStatusColumn
            title="New Orders"
            status="new"
            orders={newOrder}
            // orders={orders}
            onOrderStatusUpdate={handleOrderStatusUpdate}
            onOrderPriorityUpdate={handleOrderPriorityUpdate}
            onItemToggle={handleItemToggle}
            currentTime={currentTime}
            color="accent"
            currentStation={selectedStation}

          />
          
          <OrderStatusColumn
            title="In Progress"
            status="in-progress"
            orders={inprogressOrder}
            onOrderStatusUpdate={handleOrderStatusUpdate}
            onOrderPriorityUpdate={handleOrderPriorityUpdate}
            onItemToggle={handleItemToggle}
            currentTime={currentTime}
            color="warning"
            currentStation={selectedStation}

          />
          
          <OrderStatusColumn
            title="Ready"
            status="ready"
            orders={readyOrder}
            onOrderStatusUpdate={handleOrderStatusUpdate}
            onOrderPriorityUpdate={handleOrderPriorityUpdate}
            onItemToggle={handleItemToggle}
            currentTime={currentTime}
            color="primary"
            currentStation={selectedStation}

          />
          
          <OrderStatusColumn
            title="Completed"
            status="completed"
            orders={completedOrder}
            onOrderStatusUpdate={handleOrderStatusUpdate}
            onOrderPriorityUpdate={handleOrderPriorityUpdate}
            onItemToggle={handleItemToggle}
            currentTime={currentTime}
            color="success"
            currentStation={selectedStation}
          />
        </div>
      </div>
    </div>
  );
}

export default KitchenDisplayClient;