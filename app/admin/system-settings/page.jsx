"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import AdminNavigation from "../../components/ui/AdminNavigation";
import Icon from "../../components/AppIcon";

function SystemSettingsPage() {
  const [settings, setSettings] = useState({
    taxRate: { value: "0", type: "number", description: "Default tax rate percentage" },
    deliveryFee: { value: "0", type: "number", description: "Flat delivery fee amount" },
    currency: { value: "USD", type: "string", description: "Default store currency" },
    isOpen: { value: "true", type: "boolean", description: "Is the restaurant currently open for orders?" }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/admin/system-settings");
      if (response.data.success && response.data.data.length > 0) {
        const fetchedSettings = {};
        response.data.data.forEach(setting => {
          fetchedSettings[setting.key] = {
            value: setting.value,
            type: setting.type,
            description: setting.description
          };
        });
        
        // Merge fetched settings with default structure to ensure keys exist
        setSettings(prev => ({
          ...prev,
          ...fetchedSettings
        }));
      }
    } catch (error) {
      console.error("Failed to fetch system settings", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage({ type: "", text: "" });
    try {
      const response = await axios.put("/api/admin/system-settings", settings);
      if (response.data.success) {
        setSaveMessage({ type: "success", text: "Settings saved successfully!" });
        setTimeout(() => setSaveMessage({ type: "", text: "" }), 3000);
      }
    } catch (error) {
      console.error("Failed to save settings", error);
      setSaveMessage({ type: "error", text: "Failed to save settings. Please try again." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: { ...prev[key], value }
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminNavigation />

      <div className="lg:pl-64 pt-16">
        <main className="p-4 md:p-6 lg:p-8">
          <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-heading font-heading-bold text-text-primary">
                System Settings
              </h1>
              <p className="text-text-secondary font-body mt-1">
                Configure global application variables and restaurant statuses.
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-3">
              <button 
                onClick={fetchSettings} 
                className="flex items-center space-x-2 bg-surface hover:bg-surface-50 border border-border px-4 py-2 rounded-lg transition-smooth font-body text-sm text-text-primary shadow-sm"
              >
                <Icon name="RefreshCw" size={16} className={isLoading ? "animate-spin" : ""} />
              </button>
              <button 
                onClick={handleSave} 
                disabled={isLoading || isSaving}
                className="flex items-center space-x-2 bg-primary hover:bg-primary-600 text-white px-6 py-2 rounded-lg transition-smooth font-body-medium text-sm shadow-soft disabled:opacity-50"
              >
                {isSaving ? <Icon name="Loader2" size={16} className="animate-spin" /> : <Icon name="Save" size={16} />}
                <span>Save Changes</span>
              </button>
            </div>
          </div>

          {saveMessage.text && (
            <div className={`mb-6 p-4 rounded-lg flex items-center space-x-3 ${saveMessage.type === 'success' ? 'bg-success-50 text-success-700 border border-success-200' : 'bg-error-50 text-error-700 border border-error-200'}`}>
              <Icon name={saveMessage.type === 'success' ? 'CheckCircle' : 'AlertCircle'} size={20} />
              <span className="font-body font-body-medium text-sm">{saveMessage.text}</span>
            </div>
          )}

          <div className="bg-surface rounded-xl shadow-soft p-6">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <Icon name="Loader2" size={48} className="text-primary animate-spin" />
              </div>
            ) : (
              <div className="space-y-8 max-w-3xl">
                
                {/* Store Status */}
                <div className="pb-6 border-b border-border">
                  <h3 className="text-lg font-heading font-heading-bold text-text-primary mb-4">Store Operational Status</h3>
                  <div className="flex items-start space-x-4">
                    <div className="flex-1">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <div className="relative">
                          <input 
                            type="checkbox" 
                            className="sr-only" 
                            checked={settings.isOpen.value === "true"}
                            onChange={(e) => handleInputChange('isOpen', e.target.checked ? "true" : "false")}
                          />
                          <div className={`block w-14 h-8 rounded-full transition-colors ${settings.isOpen.value === "true" ? 'bg-success' : 'bg-gray-300'}`}></div>
                          <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${settings.isOpen.value === "true" ? 'transform translate-x-6' : ''}`}></div>
                        </div>
                        <div>
                          <p className="font-body font-body-bold text-text-primary">
                            {settings.isOpen.value === "true" ? "Restaurant is Open" : "Restaurant is Closed"}
                          </p>
                          <p className="text-sm font-body text-text-secondary mt-1">{settings.isOpen.description}</p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Financial Settings */}
                <div className="pb-6 border-b border-border">
                  <h3 className="text-lg font-heading font-heading-bold text-text-primary mb-4">Financial & Ordering</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-body font-body-bold text-text-primary mb-2">Tax Rate (%)</label>
                      <input 
                        type="number"
                        value={settings.taxRate.value}
                        onChange={(e) => handleInputChange('taxRate', e.target.value)}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-body text-text-primary"
                        placeholder="e.g. 5"
                      />
                      <p className="text-xs text-text-secondary mt-2 font-body">{settings.taxRate.description}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-body font-body-bold text-text-primary mb-2">Delivery Fee</label>
                      <input 
                        type="number"
                        value={settings.deliveryFee.value}
                        onChange={(e) => handleInputChange('deliveryFee', e.target.value)}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-body text-text-primary"
                        placeholder="e.g. 2.99"
                      />
                      <p className="text-xs text-text-secondary mt-2 font-body">{settings.deliveryFee.description}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-body font-body-bold text-text-primary mb-2">Currency Code</label>
                      <input 
                        type="text"
                        value={settings.currency.value}
                        onChange={(e) => handleInputChange('currency', e.target.value)}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-body text-text-primary uppercase"
                        placeholder="USD, EUR, etc."
                      />
                      <p className="text-xs text-text-secondary mt-2 font-body">{settings.currency.description}</p>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default SystemSettingsPage;
