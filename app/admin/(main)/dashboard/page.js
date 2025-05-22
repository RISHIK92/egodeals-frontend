"use client";

// File: src/components/Sidebar.jsx
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  ChevronRight,
  Home,
  ListFilter,
  Users,
  Tag,
  DollarSign,
  MessageSquare,
  Bell,
  Settings,
  LogOut,
  BadgeIndianRupee,
  Gift,
} from "lucide-react";

const MenuItem = ({
  href,
  icon,
  label,
  isActive,
  hasSubmenu,
  submenuItems,
  onToggleSubmenu,
  isSubmenuOpen,
}) => {
  const Icon = icon;

  return (
    <div className="mb-1">
      <Link href={href} passHref>
        <div
          className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg cursor-pointer
            ${
              isActive
                ? "bg-blue-600 text-white"
                : "text-gray-100 hover:bg-blue-700"
            }`}
          onClick={hasSubmenu ? onToggleSubmenu : undefined}
        >
          <Icon className="w-5 h-5 mr-3" />
          <span className="flex-1">{label}</span>
          {hasSubmenu &&
            (isSubmenuOpen ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            ))}
        </div>
      </Link>

      {hasSubmenu && isSubmenuOpen && (
        <div className="ml-7 mt-1 space-y-1">
          {submenuItems.map((item, index) => (
            <Link href={item.href} key={index} passHref>
              <div
                className={`px-4 py-2 text-sm rounded-lg cursor-pointer ${
                  item.isActive
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {item.label}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export const Sidebar = ({ adminData }) => {
  const pathname = usePathname();
  const [openSubmenu, setOpenSubmenu] = useState(null);

  const toggleSubmenu = (menu) => {
    setOpenSubmenu(openSubmenu === menu ? null : menu);
  };

  // Extract permissions from admin data
  const permissions = adminData?.permissions || [];
  const hasPermission = (perm) => permissions.includes(perm);

  const menuItems = [
    {
      href: "/admin/dashboard",
      icon: Home,
      label: "Dashboard",
      hasSubmenu: false,
    },
    {
      href: "/admin/listings",
      icon: ListFilter,
      label: "Listings",
      hasSubmenu: true,
      submenu: "listings",
      submenuItems: [
        { href: "/admin/listings", label: "All Listings" },
        { href: "/admin/listings/pending", label: "Pending Approval" },
        { href: "/admin/listings/approved", label: "Approved" },
        { href: "/admin/listings/rejected", label: "Rejected" },
      ],
      permission: null, // No specific permission needed
    },
    {
      href: "/admin/users",
      icon: Users,
      label: "Users",
      hasSubmenu: false,
      permission: "MANAGE_USERS",
    },
    {
      href: "/admin/categories",
      icon: Tag,
      label: "Categories",
      hasSubmenu: false,
    },
    {
      href: "/admin/pricing",
      icon: DollarSign,
      label: "Pricing Plans",
      hasSubmenu: false,
      permission: "MANAGE_PRICING",
    },
    {
      href: "/admin/promotions",
      icon: Bell,
      label: "Promotions",
      hasSubmenu: true,
      submenu: "promotions",
      submenuItems: [
        { href: "/admin/promotions", label: "All Promotions" },
        { href: "/admin/promotions/active", label: "Active" },
        { href: "/admin/promotions/expired", label: "Expired" },
      ],
      permission: "MANAGE_FEATURED",
    },
    {
      href: "/admin/offer",
      icon: Gift,
      label: "Offer Zone",
      hasSubmenu: false,
    },
    {
      href: "/admin/subscription",
      icon: BadgeIndianRupee,
      label: "Subscription Plans",
      hasSubmenu: false,
    },
  ];

  // Filter menu items based on permissions
  const filteredMenuItems = menuItems.filter(
    (item) => !item.permission || hasPermission(item.permission)
  );

  return (
    <div className="flex flex-col w-64 h-screen bg-slate-900 border-r border-slate-700">
      <div className="flex items-center justify-center h-16 px-4 border-b border-slate-700">
        <img
          className="h-40"
          src="https://res.cloudinary.com/df622sxkk/image/upload/v1746742290/0c8eb74fb6f15192bef2770ba22d1524669d558f_xzk58h.png"
        />
      </div>

      <div className="flex items-center px-4 py-3 border-b border-slate-700">
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
          {adminData?.name?.charAt(0) || "A"}
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-slate-200">
            {adminData?.name || "Admin User"}
          </p>
          <p className="text-xs text-slate-400">
            {adminData?.email || "admin@example.com"}
          </p>
        </div>
      </div>

      <div className="flex-1 px-3 py-4 overflow-y-auto">
        {filteredMenuItems.map((item, index) => (
          <MenuItem
            key={index}
            href={item.href}
            icon={item.icon}
            label={item.label}
            isActive={
              pathname === item.href ||
              (item.hasSubmenu && pathname.startsWith(item.href))
            }
            hasSubmenu={item.hasSubmenu}
            submenuItems={(item.submenuItems || []).map((subItem) => ({
              ...subItem,
              isActive: pathname === subItem.href,
            }))}
            onToggleSubmenu={() => toggleSubmenu(item.submenu)}
            isSubmenuOpen={openSubmenu === item.submenu}
          />
        ))}
      </div>

      <div className="px-3 py-4 border-t border-slate-700">
        <Link href="/admin/logout" passHref>
          <div className="flex items-center px-4 py-3 text-sm font-medium text-red-400 rounded-lg cursor-pointer hover:bg-slate-800">
            <LogOut className="w-5 h-5 mr-3" />
            <span>Logout</span>
          </div>
        </Link>
      </div>
    </div>
  );
};

import { Search, Menu, X } from "lucide-react";

export const Header = ({ onToggleSidebar, isSidebarOpen }) => {
  const [searchValue, setSearchValue] = useState("");

  return (
    <header className="bg-white border-b border-gray-200 z-10">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center">
          <button
            className="p-2 rounded-md lg:hidden"
            onClick={onToggleSidebar}
          >
            {isSidebarOpen ? (
              <X className="w-6 h-6 text-gray-500" />
            ) : (
              <Menu className="w-6 h-6 text-gray-500" />
            )}
          </button>
        </div>

        <div className="flex-1 px-4 max-w-xl mx-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center">
          <button className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500"></span>
          </button>
        </div>
      </div>
    </header>
  );
};

const StatsCard = ({ title, value, icon, color }) => {
  const Icon = icon;

  return (
    <div className="bg-white rounded-lg shadow p-5">
      <div className="flex items-center">
        <div className={`flex-shrink-0 rounded-md p-3 ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-5">
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
        </div>
      </div>
    </div>
  );
};

const ActivityItem = ({ title, subtitle, time }) => {
  return (
    <div className="flex items-center py-3">
      <div className="ml-3 flex-1 border-b border-gray-100 pb-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-900">{title}</p>
          <p className="text-xs text-gray-500">{time}</p>
        </div>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    listings: 0,
    pendingListings: 0,
    activePromotions: 0,
    categories: 0,
  });
  const [recentActivity, setRecentActivity] = useState({
    listings: [],
    users: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL_ADMIN}/admin/stats`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const data = await response.json();
        setStats(data.stats);
        setRecentActivity(data.recentActivity);
      } catch (error) {
        console.error("Dashboard data error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <span className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
        <StatsCard
          title="Total Users"
          value={stats.users}
          icon={Users}
          color="bg-blue-600"
        />
        <StatsCard
          title="Total Listings"
          value={stats.listings}
          icon={ListFilter}
          color="bg-green-600"
        />
        <StatsCard
          title="Pending Listings"
          value={stats.pendingListings}
          icon={ListFilter}
          color="bg-yellow-600"
        />
        <StatsCard
          title="Active Promotions"
          value={stats.activePromotions}
          icon={Bell}
          color="bg-purple-600"
        />
        <StatsCard
          title="Categories"
          value={stats.categories}
          icon={Tag}
          color="bg-red-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Recent Listings
            </h3>
          </div>
          <div className="p-6">
            {recentActivity.listings.length > 0 ? (
              <div className="space-y-3">
                {recentActivity.listings.map((listing, index) => (
                  <ActivityItem
                    key={index}
                    title={listing.title}
                    subtitle={`Posted by ${listing.user.firstName} ${listing.user.lastName}`}
                    time={formatDate(listing.createdAt)}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                No recent listings
              </p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Users</h3>
          </div>
          <div className="p-6">
            {recentActivity.users.length > 0 ? (
              <div className="space-y-3">
                {recentActivity.users.map((user, index) => (
                  <ActivityItem
                    key={index}
                    title={`${user.firstName} ${user.lastName}`}
                    subtitle={user.email}
                    time={formatDate(user.createdAt)}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No recent users</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
import { CheckCircle, XCircle, Eye, Star, Trash } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";

const ListingsPage = () => {
  const [listings, setListings] = useState([]);
  const [totalListings, setTotalListings] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const queryParams = new URLSearchParams({
          page: currentPage,
          limit: 10,
        });

        if (statusFilter) {
          queryParams.append("status", statusFilter);
        }

        if (searchTerm) {
          queryParams.append("search", searchTerm);
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL_ADMIN}/admin/listings?${queryParams}`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch listings");
        }

        const data = await response.json();
        setListings(data.listings);
        setTotalListings(data.total);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Listings error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, [currentPage, statusFilter, searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Reset to first page when searching
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1); // Reset to first page when changing filter
  };

  const handleApprove = async (id) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_ADMIN}/admin/listings/${id}/approve`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ comments: "Approved by admin" }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to approve listing");
      }

      // Update the listings after approval
      setListings(
        listings.map((listing) =>
          listing.id === id ? { ...listing, status: "APPROVED" } : listing
        )
      );
    } catch (error) {
      toast.error("Failed to approve listing");
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_ADMIN}/admin/listings/${id}/reject`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ comments: "Rejected by admin" }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to reject listing");
      }

      // Update the listings after rejection
      setListings(
        listings.map((listing) =>
          listing.id === id ? { ...listing, status: "REJECTED" } : listing
        )
      );
    } catch (error) {
      console.error("Reject error:", error);
      toast.error("Failed to reject listing");
    }
  };

  const handleFeature = async (id) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_ADMIN}/admin/listings/${id}/feature`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ duration: "SEVEN_DAYS" }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to feature listing");
      }

      toast.success("Listing featured successfully");
    } catch (error) {
      toast.error("Failed to feature listing");
    }
  };

  const handleDelete = async (id) => {
    if (
      !confirm(
        "Are you sure you want to delete this listing? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_ADMIN}/admin/listings/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete listing");
      }

      // Remove deleted listing from the state
      setListings(listings.filter((listing) => listing.id !== id));
    } catch (error) {
      toast.error("Failed to delete listing");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const StatusBadge = ({ status }) => {
    let colorClass = "";
    let icon = null;

    switch (status) {
      case "PENDING":
        colorClass = "bg-yellow-100 text-yellow-800";
        break;
      case "APPROVED":
        colorClass = "bg-green-100 text-green-800";
        icon = <CheckCircle className="w-4 h-4 mr-1" />;
        break;
      case "REJECTED":
        colorClass = "bg-red-100 text-red-800";
        icon = <XCircle className="w-4 h-4 mr-1" />;
        break;
      default:
        colorClass = "bg-gray-100 text-gray-800";
    }

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}
      >
        {icon}
        {status}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Listings</h1>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <form onSubmit={handleSearch} className="flex w-full max-w-lg">
              <input
                type="text"
                className="px-4 py-2 w-full rounded-l-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search listings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Search
              </button>
            </form>

            <div className="mt-3 sm:mt-0 sm:ml-4">
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={statusFilter}
                onChange={handleStatusFilterChange}
              >
                <option value="">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Listing
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  User
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Category
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {listings.length > 0 ? (
                listings.map((listing) => (
                  <tr key={listing.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-md overflow-hidden">
                          {listing.images && listing.images.length > 0 ? (
                            <img
                              src={listing.images[0].url}
                              alt={listing.title}
                              className="h-10 w-10 object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 flex items-center justify-center text-gray-500">
                              N/A
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {listing.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {listing.city}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {listing.user.firstName} {listing.user.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {listing.user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {listing.category?.name || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(listing.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={listing.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          className="text-blue-600 hover:text-blue-900"
                          onClick={() => push(`/admin/listings/${listing.id}`)}
                        >
                          <Eye className="w-5 h-5" />
                        </button>

                        {listing.status === "PENDING" && (
                          <>
                            <button
                              className="text-green-600 hover:text-green-900"
                              onClick={() => handleApprove(listing.id)}
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                            <button
                              className="text-red-600 hover:text-red-900"
                              onClick={() => handleReject(listing.id)}
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          </>
                        )}

                        <button
                          className="text-yellow-600 hover:text-yellow-900"
                          onClick={() => handleFeature(listing.id)}
                        >
                          <Star className="w-5 h-5" />
                        </button>

                        <button
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleDelete(listing.id)}
                        >
                          <Trash className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No listings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">
                    {(currentPage - 1) * 10 + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(currentPage * 10, totalListings)}
                  </span>{" "}
                  of <span className="font-medium">{totalListings}</span>{" "}
                  results
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === 1
                        ? "text-gray-300"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  {/* Pagination numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }).map(
                    (_, index) => {
                      let pageNumber;
                      if (totalPages <= 5) {
                        pageNumber = index + 1;
                      } else if (currentPage <= 3) {
                        pageNumber = index + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + index;
                      } else {
                        pageNumber = currentPage - 2 + index;
                      }

                      return (
                        <button
                          key={index}
                          onClick={() => setCurrentPage(pageNumber)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === pageNumber
                              ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    }
                  )}

                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === totalPages
                        ? "text-gray-300"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};
