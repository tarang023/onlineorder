import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import Icon from "../AppIcon";
import pathname, { usePathname } from "next/navigation";

function AdminNavigation() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const location = usePathname();

  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        const response = await axios.post("/api/users/me");
        if (response.data?.data) {
          setAdminUser(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch admin details:", error);
      }
    };
    fetchAdminDetails();
  }, []);

  const navigationSections = [
    {
      title: "Dashboard",
      items: [
        {
          label: "Overview",
          path: "/admin/dashboard",
          icon: "BarChart3",
        },
      ],
    },
    {
      title: "Orders",
      items: [
        { label: "Live Orders", path: "/admin/live-orders", icon: "Clock" },
        {
          label: "Order History",
          path: "/admin/order-history",
          icon: "History",
        },
        {
          label: "Kitchen Display",
          path: "/kitchen-display-system",
          icon: "Monitor",
        },
      ],
    },
    {
      title: "Menu Management",
      items: [
        { label: "Add Menu Items", path: "/admin/menu", icon: "ChefHat" },
        { label: "Add Categories", path: "/admin/categories", icon: "Grid3X3" },
      ],
    },
    {
      title: "Customers",
      items: [
        { label: "Customer List", path: "/admin/customers", icon: "Users" },
        { label: "Reviews", path: "/admin/reviews", icon: "Star" },
      ],
    },
    {
      title: "Settings",
      items: [
        { label: "Add Admin", path: "/admin/add-admin", icon: "UserCheck" },
        { label: "System", path: "/admin/system-settings", icon: "Settings" },
      ],
    },
  ];

  const isActivePath = (path) => location.pathname === path;

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-navigation bg-surface shadow-soft border-b border-border">
        <div className="px-4 lg:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Mobile Menu Button */}
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 text-text-secondary hover:text-primary transition-smooth"
              >
                <Icon name="Menu" size={24} />
              </button>

              <Link
                href="/restaurant-admin-dashboard"
                className="flex items-center space-x-3"
              >
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Icon name="ChefHat" size={20} color="white" />
                </div>
                <div className="hidden sm:block">
                  <span className="text-xl font-heading font-heading-medium text-text-primary">
                    TasteBite
                  </span>
                  <span className="text-sm text-text-secondary font-body block">
                    Admin Dashboard
                  </span>
                </div>
              </Link>
            </div>

            {/* Header Actions */}
            <div className="flex items-center space-x-4 relative">
              {/* User Menu */}
              <div 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-secondary-50 transition-smooth cursor-pointer"
              >
                <div className="w-8 h-8 bg-secondary-200 rounded-full flex items-center justify-center">
                  <Icon name="User" size={16} className="text-secondary" />
                </div>
                <span className="hidden sm:block text-sm font-body font-body-medium text-text-primary">
                  {adminUser ? `${adminUser.firstName} ${adminUser.lastName}` : "Admin User"}
                </span>
                <Icon
                  name="ChevronDown"
                  size={16}
                  className="text-text-secondary"
                />
              </div>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-surface rounded-xl shadow-floating border border-border z-dropdown overflow-hidden">
                  <div className="p-4 border-b border-border bg-surface-50">
                    <p className="font-heading font-heading-bold text-text-primary">
                      {adminUser ? `${adminUser.firstName} ${adminUser.lastName}` : "Admin User"}
                    </p>
                    <p className="text-sm font-body text-text-secondary truncate">
                      {adminUser?.email || "admin@tastebite.com"}
                    </p>
                  </div>
                  <div className="p-2">
                    <div className="px-3 py-2">
                      <p className="text-xs font-body font-body-medium text-text-secondary uppercase tracking-wider mb-1">Role</p>
                      <p className="text-sm font-body text-text-primary capitalize">{adminUser?.role || "Admin"}</p>
                    </div>
                    {adminUser?.phone && (
                      <div className="px-3 py-2">
                        <p className="text-xs font-body font-body-medium text-text-secondary uppercase tracking-wider mb-1">Phone</p>
                        <p className="text-sm font-body text-text-primary">{adminUser.phone}</p>
                      </div>
                    )}
                  </div>
                  <div className="p-2 border-t border-border bg-surface-50">
                    <button 
                      onClick={() => setIsProfileOpen(false)}
                      className="w-full text-left px-3 py-2 text-sm text-text-secondary hover:text-primary transition-smooth font-body"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-[990] lg:block lg:bg-surface lg:border-r lg:border-border lg:shadow-soft transition-all duration-300 ${
          isSidebarCollapsed ? "lg:w-16" : "lg:w-64"
        }`}
      >
        <div className="flex flex-col h-full pt-16">

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
            {navigationSections.map((section) => (
              <div key={section.title}>
                {!isSidebarCollapsed && (
                  <h3 className="text-xs font-body font-body-medium text-text-secondary uppercase tracking-wider mb-3">
                    {section.title}
                  </h3>
                )}
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={`flex items-center px-3 py-2 rounded-lg transition-smooth font-body font-body-medium ${
                        isActivePath(item.path)
                          ? "text-primary bg-primary-50 border-r-2 border-primary"
                          : "text-text-secondary hover:text-primary hover:bg-primary-50"
                      } ${isSidebarCollapsed ? "justify-center" : "space-x-3"}`}
                      title={isSidebarCollapsed ? item.label : ""}
                    >
                      <Icon name={item.icon} size={20} />
                      {!isSidebarCollapsed && <span>{item.label}</span>}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-modal">
          <div
            className="fixed inset-0 bg-secondary-900 bg-opacity-50"
            onClick={toggleMobileMenu}
          ></div>
          <div className="fixed inset-y-0 left-0 w-64 bg-surface shadow-floating">
            <div className="flex flex-col h-full pt-16">
              <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
                {navigationSections.map((section) => (
                  <div key={section.title}>
                    <h3 className="text-xs font-body font-body-medium text-text-secondary uppercase tracking-wider mb-3">
                      {section.title}
                    </h3>
                    <div className="space-y-1">
                      {section.items.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={toggleMobileMenu}
                          className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-smooth font-body font-body-medium min-h-touch ${
                            isActivePath(item.path)
                              ? "text-primary bg-primary-50"
                              : "text-text-secondary hover:text-primary hover:bg-primary-50"
                          }`}
                        >
                          <Icon name={item.icon} size={20} />
                          <span>{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminNavigation;
