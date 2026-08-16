'use client'
import { Bell, HomeIcon, MessageCircleMoreIcon, Settings, User, UsersIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'

const SideNav = ({id}) => {
  const pathname = usePathname();

const menuItems = [
    { icon: <HomeIcon size={20}/> , label: "Feed", href: "/feed" },
    { icon: <UsersIcon size={20}/>, label: "Friends", href: "/friends" },
    { icon: <MessageCircleMoreIcon size={20}/>, label: "Messages", href: "/messages" },
    { icon: <User size={20}/>, label: "Profile", href: `/profile/${id}` },
    { icon: <Settings size={20}/>, label: "Settings", href: "/settings" },
    { icon: <Bell size={20}/>, label: "Collage Notice", href: "/notice" },
  ];

  return (
     <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              pathname === item.href
                ? "bg-blue-100  text-gray-600 font-medium"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
  )
}

export default SideNav