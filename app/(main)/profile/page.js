"use client";
import { useState, useEffect } from "react";
import {
  ChevronRight,
  Heart,
  Archive,
  Clock,
  MessageSquare,
  Search,
  CreditCard,
  User,
  LogOut,
  X,
  Check,
  Star,
  Image as ImageIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("myListings");
  const [showCloseAccountModal, setShowCloseAccountModal] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [listings, setListings] = useState({
    myListings: [],
    pendingApproval: [],
    archived: [],
    favorites: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchProfileData();
    fetchListings();
  }, []);

  const fetchProfileData = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/profile`,
        {
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        setProfileData(data);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const fetchListings = async () => {
    try {
      setIsLoading(true);
      const [listingsRes, pendingRes, archivedRes, favoritesRes] =
        await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/listings`, {
            credentials: "include",
          }),
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/listings/pending`, {
            credentials: "include",
          }),
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/listings/archived`, {
            credentials: "include",
          }),
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/listings/favorites`, {
            credentials: "include",
          }),
        ]);

      const listingsData = await listingsRes.json();
      const pendingData = await pendingRes.json();
      const archivedData = await archivedRes.json();
      const favoritesData = await favoritesRes.json();

      setListings({
        myListings: listingsData || [],
        pendingApproval: pendingData || [],
        archived: archivedData || [],
        favorites: favoritesData || [],
      });
    } catch (error) {
      console.error("Error fetching listings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
          credentials: "include",
        }
      );

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfileData(updatedProfile);
        alert("Profile updated successfully");
      }
    } catch (error) {
      console.error("Update profile error:", error);
      alert("Error updating profile");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target);
      const data = {
        currentPassword: formData.get("currentPassword"),
        newPassword: formData.get("newPassword"),
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/profile/password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
          credentials: "include",
        }
      );

      if (response.ok) {
        alert("Password changed successfully");
        e.target.reset();
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Error changing password");
      }
    } catch (error) {
      console.error("Change password error:", error);
      alert("Error changing password");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/profile`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.ok) {
        router.push("/");
      }
    } catch (error) {
      console.error("Delete account error:", error);
      alert("Error deleting account");
    }
  };

  const toggleFavorite = async (listingId, isFavorite) => {
    try {
      const endpoint = isFavorite ? "favorite" : "unfavorite";
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/listings/${listingId}/${endpoint}`,
        {
          method: isFavorite ? "POST" : "DELETE",
          credentials: "include",
        }
      );

      if (response.ok) {
        fetchListings(); // Refresh favorites list
      }
    } catch (error) {
      console.error("Favorite toggle error:", error);
    }
  };

  const updateListingStatus = async (listingId, status) => {
    try {
      const endpoint = status === "ARCHIVED" ? "archive" : "reactivate";
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/listings/${listingId}/${endpoint}`,
        {
          method: "PUT",
          credentials: "include",
        }
      );

      if (response.ok) {
        fetchListings(); // Refresh listings
      }
    } catch (error) {
      console.error("Update listing status error:", error);
    }
  };

  const deleteListing = async (listingId) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/listings/${listingId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.ok) {
        fetchListings(); // Refresh listings
      }
    } catch (error) {
      console.error("Delete listing error:", error);
    }
  };

  if (isLoading && !profileData) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Profile Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            Unable to load profile data. Please try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              My Account
            </h2>

            <nav className="space-y-1">
              {/* Listings Section */}
              <div className="mb-2">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Listings
                </h3>
                <button
                  onClick={() => setActiveTab("myListings")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === "myListings"
                      ? "bg-teal-50 text-teal-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center">
                    <ImageIcon className="h-4 w-4 mr-2" />
                    My listings
                  </div>
                  <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">
                    {listings.myListings.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab("pendingApproval")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === "pendingApproval"
                      ? "bg-teal-50 text-teal-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Pending approval
                  </div>
                  <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">
                    {listings.pendingApproval.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab("archived")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === "archived"
                      ? "bg-teal-50 text-teal-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center">
                    <Archive className="h-4 w-4 mr-2" />
                    Archived listings
                  </div>
                  <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">
                    {listings.archived.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab("favorites")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === "favorites"
                      ? "bg-teal-50 text-teal-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center">
                    <Heart className="h-4 w-4 mr-2" />
                    Favourite listings
                  </div>
                  <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">
                    {listings.favorites.length}
                  </span>
                </button>
              </div>

              {/* Other Sections */}
              <div className="mb-2">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Activities
                </h3>
                <button
                  onClick={() => setActiveTab("messenger")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === "messenger"
                      ? "bg-teal-50 text-teal-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                </button>

                <button
                  onClick={() => setActiveTab("transactions")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === "transactions"
                      ? "bg-teal-50 text-teal-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Transactions
                  </div>
                  <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">
                    0
                  </span>
                </button>
              </div>

              {/* Account Section */}
              <div className="pt-2 border-t border-gray-200">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Account
                </h3>
                <button
                  onClick={() => setActiveTab("account")}
                  className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === "account"
                      ? "bg-teal-50 text-teal-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <User className="h-4 w-4 mr-2" />
                  My Account
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Log Out
                </button>

                <button
                  onClick={() => setShowCloseAccountModal(true)}
                  className="w-full flex items-center px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <X className="h-4 w-4 mr-2" />
                  Close account
                </button>
              </div>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* My Listings */}
          {activeTab === "myListings" && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  My Listings
                </h2>
                <button
                  className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-md hover:bg-teal-700 cursor-pointer"
                  onClick={() => router.push("/create-listing")}
                >
                  Create New Listing
                </button>
              </div>

              {listings.myListings.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {listings.myListings.map((listing) => (
                    <ListingCard
                      key={listing.id}
                      listing={listing}
                      onArchive={() =>
                        updateListingStatus(listing.id, "ARCHIVED")
                      }
                      onDelete={() => deleteListing(listing.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No listings
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    You haven't created any listings yet.
                  </p>
                  <div className="mt-6">
                    <button
                      className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-md hover:bg-teal-700 cursor-pointer"
                      onClick={() => router.push("/create-listing")}
                    >
                      Create your first listing
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Pending Approval */}
          {activeTab === "pendingApproval" && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Pending Approval
              </h2>

              {listings.pendingApproval.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {listings.pendingApproval.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} isPending />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Clock className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No pending listings
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    All your listings are currently approved.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Archived Listings */}
          {activeTab === "archived" && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Archived Listings
              </h2>

              {listings.archived.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {listings.archived.map((listing) => (
                    <ListingCard
                      key={listing.id}
                      listing={listing}
                      isArchived
                      onReactivate={() =>
                        updateListingStatus(listing.id, "APPROVED")
                      }
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Archive className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No archived listings
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    You haven't archived any listings yet.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Favorite Listings */}
          {activeTab === "favorites" && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Favourite Listings
              </h2>

              {listings.favorites.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {listings.favorites.map((listing) => (
                    <ListingCard
                      key={listing.id}
                      listing={listing}
                      isFavorite
                      onFavoriteToggle={() => toggleFavorite(listing.id, false)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Heart className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No favorite listings
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    You haven't saved any listings to your favorites yet.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Messenger */}
          {activeTab === "messenger" && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Messenger
              </h2>
              <div className="text-center py-12">
                <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No messages
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  You don't have any messages yet.
                </p>
              </div>
            </div>
          )}

          {/* Transactions */}
          {activeTab === "transactions" && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Transactions
              </h2>
              <div className="text-center py-12">
                <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No transactions
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  You don't have any transactions yet.
                </p>
              </div>
            </div>
          )}

          {/* My Account */}
          {activeTab === "account" && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                My Account
              </h2>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-8 w-8 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {profileData.firstName} {profileData.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Member since{" "}
                      {new Date(profileData.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleUpdateProfile}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                        defaultValue={profileData.firstName}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                        defaultValue={profileData.lastName}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                        defaultValue={profileData.email}
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                        defaultValue={profileData.phone}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                        defaultValue={profileData.city}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end mt-6">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-md hover:bg-teal-700"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>

                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Change Password
                  </h3>
                  <form onSubmit={handleChangePassword}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Current Password
                        </label>
                        <input
                          type="password"
                          name="currentPassword"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          New Password
                        </label>
                        <input
                          type="password"
                          name="newPassword"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex justify-end mt-6">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-md hover:bg-teal-700"
                      >
                        Change Password
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Close Account Modal */}
      {showCloseAccountModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Close Account
              </h3>
              <button
                onClick={() => setShowCloseAccountModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Closing your account will permanently delete all your listings,
                messages, and account data. This action cannot be undone.
              </p>
              <div className="pt-4 border-t border-gray-200">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                    required
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    I understand that this action is irreversible
                  </span>
                </label>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowCloseAccountModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                >
                  Close Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ListingCard({
  listing,
  isPending,
  isArchived,
  isFavorite,
  onArchive,
  onDelete,
  onReactivate,
  onFavoriteToggle,
}) {
  const router = useRouter();

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-48 bg-gray-100">
        {listing.images?.length > 0 ? (
          <img
            src={listing.images[0].url}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <ImageIcon className="h-12 w-12" />
          </div>
        )}
        <button
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm"
          onClick={onFavoriteToggle}
        >
          <Heart
            className={`h-5 w-5 ${
              isFavorite ? "text-red-500 fill-red-500" : "text-gray-400"
            }`}
          />
        </button>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium text-gray-900">{listing.title}</h3>
          <span className="text-lg font-semibold text-teal-600">
            ₹{listing.price}
          </span>
        </div>
        <div className="mt-1 flex items-center text-sm text-gray-500">
          <MapPin className="h-4 w-4 mr-1" />
          {listing.city}
        </div>
        <div className="mt-3 flex justify-between items-center text-sm text-gray-500">
          <span>
            Posted: {new Date(listing.createdAt).toLocaleDateString()}
          </span>
          <button
            className="text-teal-600 hover:text-teal-700"
            onClick={() => router.push(`/listings/${listing.id}`)}
          >
            View Details
          </button>
        </div>

        {isPending && (
          <div className="mt-3 flex items-center text-sm text-yellow-600">
            <Clock className="h-4 w-4 mr-1" />
            Pending Approval
          </div>
        )}

        {isArchived && (
          <div className="mt-3 flex items-center text-sm text-gray-500">
            <Archive className="h-4 w-4 mr-1" />
            Archived
          </div>
        )}

        <div className="mt-4 flex space-x-2">
          {!isArchived && !isPending && (
            <button
              onClick={onArchive}
              className="flex-1 px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200"
            >
              Archive
            </button>
          )}

          {isArchived && (
            <button
              onClick={onReactivate}
              className="flex-1 px-3 py-1 bg-teal-100 text-teal-700 text-sm rounded-md hover:bg-teal-200"
            >
              Reactivate
            </button>
          )}

          <button
            onClick={onDelete}
            className="flex-1 px-3 py-1 bg-red-100 text-red-700 text-sm rounded-md hover:bg-red-200"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function MapPin({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
