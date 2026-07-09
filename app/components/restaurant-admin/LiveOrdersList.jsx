import Icon from "../AppIcon";
import Link from "next/link";

function LiveOrdersList({ orders }) {
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
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusLabel = (status) => {
    return status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-heading-medium text-text-primary">
          Live Orders
        </h2>
        <Link
          href="/admin-orders"
          className="text-sm font-body font-body-medium text-primary hover:text-primary-600 transition-smooth"
        >
          View All Live Orders
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="py-3 px-4 font-body font-body-medium text-sm text-text-secondary">
                Order ID
              </th>
              <th className="py-3 px-4 font-body font-body-medium text-sm text-text-secondary">
                Customer
              </th>
              <th className="py-3 px-4 font-body font-body-medium text-sm text-text-secondary">
                Time
              </th>
              <th className="py-3 px-4 font-body font-body-medium text-sm text-text-secondary">
                Total
              </th>
              <th className="py-3 px-4 font-body font-body-medium text-sm text-text-secondary">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {(!orders || orders.length === 0) ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-8 text-center text-text-secondary font-body"
                >
                  No live orders at the moment.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-border hover:bg-surface-50 transition-smooth"
                >
                  <td className="py-3 px-4 font-body font-body-medium text-sm text-text-primary">
                    #{order.orderId}
                  </td>
                  <td className="py-3 px-4 font-body text-sm text-text-primary">
                    {order.customerName}
                  </td>
                  <td className="py-3 px-4 font-body text-sm text-text-secondary">
                    {new Date(order.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="py-3 px-4 font-body text-sm text-text-primary">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-xs font-body-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LiveOrdersList;
