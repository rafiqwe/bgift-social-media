'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'

const SideNav = ({id}) => {
  const pathname = usePathname();

const menuItems = [
    { icon: "🏠", label: "Feed", href: "/feed" },
    { icon: "👥", label: "Friends", href: "/friends" },
    { icon: "💬", label: "Messages", href: "/messages" },
    { icon: "👤", label: "Profile", href: `/profile/${id}` },
    { icon: "⚙️", label: "Settings", href: "/settings" },
    { icon: "🔔", label: "Collage Notice", href: "/notice" },
  ];

  return (
     <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              pathname === item.href
                ? "bg-blue-100 text-blue-600 font-medium"
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