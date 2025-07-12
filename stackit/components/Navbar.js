"use client";

import Link from "next/link";
import { useState } from "react";
import { Bell, User, LogOut, Menu, X, Search } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import NotificationBell from "./NotificationBell";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
              <span className="text-xl font-bold text-gray-900 hidden sm:block">StackIt</span>
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
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search questions..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-3">
            {status === "loading" ? (
              <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
            ) : session ? (
              <div className="flex items-center space-x-3">
                <NotificationBell />
                
                {/* User Avatar & Menu */}
                <div className="relative">
                  <div className="flex items-center space-x-2 cursor-pointer">
                    <div className="w-7 h-7 bg-blue-600 rounded-sm flex items-center justify-center text-white text-xs font-medium">
                      {session.user.name?.[0] || session.user.email?.[0] || "U"}
                    </div>
                    <span className="hidden md:block text-sm text-gray-700 font-medium">
                      {session.user.name || session.user.email}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={() => signOut()}
                  className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
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

            {/* Ask Question Button */}
            <Link
              href="/ask"
              className="px-3 py-1.5 text-sm text-white bg-orange-500 hover:bg-orange-600 rounded font-medium hidden md:block"
            >
              Ask Question
            </Link>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-600 hover:text-gray-900"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search questions..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                  />
                </div>
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
