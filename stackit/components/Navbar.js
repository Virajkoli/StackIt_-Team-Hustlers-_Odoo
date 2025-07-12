"use client";

import Link from "next/link";
import { useState } from "react";
import { Bell, User, LogOut, Menu, X, Search, Settings, ChevronDown, Shield, Camera } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import NotificationBell from "./NotificationBell";
import SearchBar from "./SearchBar";

export default function Navbar() {
  const { data: session, status, update } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert("Please select a valid image file");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    setImageUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload/profile', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload image');
      }

      const data = await response.json();
      
      // Update session with new image
      await update({
        ...session,
        user: {
          ...session.user,
          image: data.imageUrl
        }
      });

      alert("Profile picture updated successfully!");

    } catch (error) {
      console.error('Image upload error:', error);
      alert("Failed to upload image: " + error.message);
    } finally {
      setImageUploading(false);
      // Clear the file input
      e.target.value = '';
      setIsProfileDropdownOpen(false);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-300 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block">
                StackIt
              </span>
            </Link>

            {/* Main Navigation */}
            <div className="hidden md:flex space-x-1">
              <Link
                href="/"
                className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
              >
                Questions
              </Link>
              <Link
                href="/tags"
                className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
              >
                Tags
              </Link>
              <Link
                href="/users"
                className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
              >
                Users
              </Link>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-6 hidden md:block">
            <SearchBar />
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-3">
            {status === "loading" ? (
              <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
            ) : session ? (
              <div className="flex items-center space-x-3">
                <NotificationBell />
                
                {/* User Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center space-x-2 p-1 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <div className="relative w-8 h-8 rounded-full overflow-hidden bg-blue-600 flex items-center justify-center">
                      {session.user.image ? (
                        <img
                          src={session.user.image}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-white text-sm font-medium">
                          {session.user.name?.[0] || session.user.email?.[0] || "U"}
                        </span>
                      )}
                      {/* Upload overlay on hover */}
                      <label className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                        <Camera className="w-3 h-3 text-white" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={imageUploading}
                        />
                      </label>
                      {imageUploading && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>
                    <span className="hidden md:block text-sm text-gray-700 font-medium max-w-24 truncate">
                      {session.user.name || session.user.username || session.user.email}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileDropdownOpen && (
                    <>
                      {/* Backdrop */}
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setIsProfileDropdownOpen(false)}
                      ></div>
                      
                      {/* Dropdown Content */}
                      <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                        <div className="py-1">
                          {/* User Info */}
                          <div className="px-4 py-2 border-b border-gray-100">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {session.user.name || session.user.username}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {session.user.email}
                            </p>
                          </div>
                          
                          {/* Menu Items */}
                          <Link
                            href="/profile"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsProfileDropdownOpen(false)}
                          >
                            <Settings className="w-4 h-4 mr-3" />
                            Profile Settings
                          </Link>
                          
                          {/* Quick Profile Picture Upload */}
                          <label className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                            <Camera className="w-4 h-4 mr-3" />
                            {imageUploading ? "Uploading..." : "Change Profile Picture"}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                              disabled={imageUploading}
                            />
                          </label>
                          
                          {/* Admin Dashboard Link */}
                          {session.user.role === "ADMIN" && (
                            <Link
                              href="/admin"
                              className="flex items-center px-4 py-2 text-sm text-orange-700 hover:bg-orange-50"
                              onClick={() => setIsProfileDropdownOpen(false)}
                            >
                              <Shield className="w-4 h-4 mr-3" />
                              Admin Dashboard
                            </Link>
                          )}
                          
                          <button
                            onClick={() => {
                              setIsProfileDropdownOpen(false);
                              signOut();
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                          >
                            <LogOut className="w-4 h-4 mr-3" />
                            Sign out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded border border-blue-600"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="px-3 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded"
                >
                  Sign up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-600 hover:text-gray-900"
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-2">
            <div className="space-y-1">
              {/* Search on mobile */}
              <div className="px-2 py-2">
                <SearchBar className="w-full" />
              </div>

              <Link
                href="/"
                className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
              >
                Questions
              </Link>
              <Link
                href="/tags"
                className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
              >
                Tags
              </Link>
              <Link
                href="/users"
                className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
              >
                Users
              </Link>
              <Link
                href="/ask"
                className="block px-3 py-2 text-sm text-white bg-orange-500 hover:bg-orange-600 rounded font-medium mx-2"
              >
                Ask Question
              </Link>

              {!session && (
                <div className="px-2 pt-2 space-y-2">
                  <Link
                    href="/login"
                    className="block w-full px-3 py-2 text-sm text-center text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    className="block w-full px-3 py-2 text-sm text-center text-white bg-blue-600 hover:bg-blue-700 rounded"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
