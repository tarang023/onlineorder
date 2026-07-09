import React from 'react';
import Icon from '../AppIcon';
import Image from '../AppImage';

function DriverDetails({ driver }) {
  const handleCallDriver = () => {
    window.location.href = `tel:${driver.phone}`;
  };

  const handleMessageDriver = () => {
    console.log("Opening message interface with driver");
  };

  return (
    <div className="bg-surface rounded-xl border border-border p-6">
      <h3 className="text-lg font-heading font-heading-medium text-text-primary mb-4">
        Your Delivery Driver
      </h3>

      <div className="flex items-start space-x-4">


        {/* Driver Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h4 className="font-heading font-heading-medium text-text-primary">
                {driver.name}
              </h4>
              <div className="flex items-center space-x-2 mt-1">
                <div className="flex items-center space-x-1">
                  <Icon name="Star" size={16} className="text-warning fill-current" />
                  <span className="text-sm font-body font-body-medium text-text-primary">
                    {driver.rating}
                  </span>
                </div>
                <span className="text-sm text-text-secondary font-body">
                  • {driver.vehicle}
                </span>
              </div>
            </div>
            
            {/* Status Badge */}
            <div className="flex items-center space-x-2 px-3 py-1 bg-success-50 rounded-full">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span className="text-sm text-success font-body font-body-medium">
                On the way
              </span>
            </div>
          </div>

          {/* Contact Actions */}
          <div className="flex items-center space-x-3">
            <button
              onClick={handleCallDriver}
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-smooth font-body font-body-medium"
            >
              <Icon name="Phone" size={18} />
              <span>Call</span>
            </button>
            
            <button
              onClick={handleMessageDriver}
              className="flex items-center space-x-2 px-4 py-2 border border-border text-text-secondary hover:text-primary hover:border-primary rounded-lg transition-smooth font-body font-body-medium"
            >
              <Icon name="MessageSquare" size={18} />
              <span>Message</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DriverDetails;