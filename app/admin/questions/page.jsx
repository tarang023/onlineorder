"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Icon from "@/app/components/AppIcon"; // Adjust path to your Icon component

export default function AdminHelpInbox() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState({}); // Stores reply text for each message ID

  // Fetch all messages on load
  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      // Create this API endpoint to fetch all messages (HelpMessage.find())
      const res = await axios.get("/api/admin/questions"); 
      if (res.data.success) {
        setMessages(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching messages");
    } finally {
      setLoading(false);
    }
  };

  // Handle Send Reply
  const handleSendReply = async (messageId) => {
    const text = replyText[messageId];
    if (!text) return toast.error("Please type a reply first");

    try {
      await axios.post("/api/admin/reply-help", {
        messageId,
        replyText: text
      });
      toast.success("Reply sent successfully!");
      
      // Update local state to show the new reply immediately
      setMessages(messages.map(msg => 
        msg._id === messageId 
          ? { ...msg, adminReply: text, status: 'replied', repliedAt: new Date() } 
          : msg
      ));
      
      // Clear input
      setReplyText(prev => ({ ...prev, [messageId]: "" }));

    } catch (error) {
      toast.error("Failed to send reply");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading Inbox...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Help Center Inbox</h1>
          <p className="text-gray-500">Manage and reply to customer inquiries.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg border shadow-sm text-sm font-medium">
          Total: {messages.length}
        </div>
      </div>

      <div className="space-y-6">
        {messages.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed">
            <p className="text-gray-400">No messages found.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              
              {/* Header: User Info */}
              <div className="p-6 border-b border-gray-50 flex justify-between items-start bg-gray-50/30">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg uppercase">
                    {msg.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{msg.name}</h3>
                    <p className="text-sm text-gray-500">{msg.email}</p>
                  </div>
                </div>
                
                {/* Status Badge */}
                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                  msg.status === 'replied' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {msg.status === 'replied' ? 'Replied' : 'Pending'}
                </div>
              </div>

              {/* Body: The Question */}
              <div className="p-6">
                <p className="text-gray-800 text-lg mb-2">"{msg.message}"</p>
                <p className="text-xs text-gray-400">
                  Received: {new Date(msg.createdAt).toLocaleDateString()} at {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </p>
              </div>

              {/* Footer: Admin Action Area */}
              <div className="bg-gray-50 p-6 border-t border-gray-100">
                {msg.adminReply ? (
                  // STATE 1: Already Replied
                  <div className="bg-green-50/50 border border-green-100 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon name="CheckCircle" size={16} className="text-green-600" />
                      <span className="text-xs font-bold text-green-700 uppercase">You replied on {new Date(msg.repliedAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-700">{msg.adminReply}</p>
                  </div>
                ) : (
                  // STATE 2: Needs Reply
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={replyText[msg._id] || ""}
                      onChange={(e) => setReplyText({ ...replyText, [msg._id]: e.target.value })}
                      placeholder="Type your reply to the customer here..."
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                    <button
                      onClick={() => handleSendReply(msg._id)}
                      className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
                    >
                      <Icon name="Send" size={18} />
                      Send
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}