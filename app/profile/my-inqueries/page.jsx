"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link"; // <--- 1. Import Link
import Icon from "@/app/components/AppIcon";

export default function MyInquiriesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyMessages();
  }, []);

  const fetchMyMessages = async () => {
    try {
      const res = await axios.get("/api/users/my-messages");
      if (res.data.success) {
        setMessages(res.data.data);
      }
    } catch (error) {
      console.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading your history...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      
      {/* --- HEADER WITH ACTION BUTTON --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Support History</h1>
          <p className="text-gray-500 mt-2">View past inquiries and responses from our team.</p>
        </div>
        
        {/* The New Button */}
        <Link 
          href="/support-page" 
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-700 transition-all font-medium shadow-sm hover:shadow-md"
        >
          <Icon name="PlusCircle" size={20} />
          <span>Ask New Question</span>
        </Link>
      </div>

      <div className="space-y-6">
        {messages.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <Icon name="MessageSquare" size={24} />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No inquiries yet</h3>
            <p className="text-gray-500 max-w-sm mx-auto mt-2 mb-6">
              If you need help with an order or have a question, you can send us a message.
            </p>
            {/* Optional: Add the button here too for empty states */}
            <Link 
              href="/support-page" 
              className="text-primary font-medium hover:underline"
            >
              Go to Support Page &rarr;
            </Link>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg._id} className="border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow bg-white">
              
              {/* Question Section */}
              <div className="flex gap-4">
                <div className="mt-1 min-w-[40px]">
                   <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                     <Icon name="User" size={20} className="text-gray-600" />
                   </div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">You Asked</span>
                    <span className="text-xs text-gray-400">{new Date(msg.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-900 font-medium leading-relaxed">{msg.message}</p>
                </div>
              </div>

              {/* Connector Line */}
              <div className="ml-5 h-6 border-l-2 border-dashed border-gray-200 my-2"></div>

              {/* Answer Section */}
              <div className="flex gap-4">
                <div className="mt-1 min-w-[40px]">
                   <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                     <Icon name="Headphones" size={20} className="text-primary" />
                   </div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">Support Team</span>
                    {msg.repliedAt && (
                      <span className="text-xs text-gray-400">{new Date(msg.repliedAt).toLocaleDateString()}</span>
                    )}
                  </div>
                  
                  {msg.adminReply ? (
                    <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                      <p className="text-gray-800">{msg.adminReply}</p>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-50 text-yellow-700 rounded-lg text-sm font-medium">
                      <Icon name="Clock" size={14} />
                      Waiting for response...
                    </div>
                  )}
                </div>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}