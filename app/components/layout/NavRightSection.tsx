'use client'
import { signOut } from 'next-auth/react';
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const NavRightSection = ({user} : any) => {
    // const [user, setUser] = useState<any>(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [notifications, setNotifications] = useState(0);
    const pathname = usePathname();
    console.log(user);
    
    //   useEffect(() => {
    //     // Fetch current user
    //     fetch("/api/profile/me")
    //       .then((res) => res.json())
    //       .then((data) => setUser(data))
    //       .catch(console.error);
    //   }, []);
    
      const handleLogout = async () => {
        await signOut({ callbackUrl: "/login" });
      };
  return (
    <div className="flex items-center gap-4">
            {/* Navigation Icons */}
            <Link
              href="/feed"
              className={`p-2 rounded-lg transition ${
                pathname === "/feed"
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </Link>

            <Link
              href="/friends"
              className={`p-2 rounded-lg transition ${
                pathname === "/friends"
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </Link>

            <Link
              href="/messages"
              className={`p-2 rounded-lg transition ${
                pathname === "/messages"
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </Link>

            {/* Notifications */}
            <button className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition relative">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              {notifications > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 hover:border-blue-500 transition"
              >
                {user?.image ? (
                  <Image
                    src={user.image}
                    alt={user.name}
                    width={40}
                    height={40}
                  />
                ) : (
                  <div className="w-full h-full bg-blue-500 text-white flex items-center justify-center font-bold">
                    {user?.name?.charAt(0) || "U"}
                  </div>
                )}
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                  <Link
                    href={`/profile/${user?.id}`}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition"
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                      {user?.image ? (
                        <Image
                          src={user.image}
                          alt={user.name}
                          width={48}
                          height={48}
                        />
                      ) : (
                        <div className="w-full h-full bg-blue-500 text-white flex items-center justify-center font-bold">
                          {user?.name?.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {user?.name}
                      </p>
                      <p className="text-sm text-gray-600">View Profile</p>
                    </div>
                  </Link>

                  <hr className="my-2" />

                  <Link
                    href="/settings"
                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition"
                  >
                    <svg
                      className="w-5 h-5 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span className="text-gray-700">Settings</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition text-left"
                  >
                    <svg
                      className="w-5 h-5 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    <span className="text-gray-700">Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
  )
}

export default NavRightSection