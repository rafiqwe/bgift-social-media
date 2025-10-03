import React from 'react'
import Link from "next/link";

const SideQuickLike = () => {
  return (
    <div>
     <div className="px-4">
        <h3 className="text-sm font-semibold text-gray-600 mb-3">
          Quick Links
        </h3>
        <div className="space-y-2 text-sm">
          <Link href="/about" className="block text-gray-600 hover:text-blue-600">
            About BGIFT
          </Link>
          <Link href="/help" className="block text-gray-600 hover:text-blue-600">
            Help Center
          </Link>
          <Link href="/privacy" className="block text-gray-600 hover:text-blue-600">
            Privacy Policy
          </Link>
        </div>
      </div>

      <div className="mt-6 px-4 text-xs text-gray-500">
        <p>BGIFT Social © {new Date().getFullYear()}</p>
        <p className="mt-1">
          BGIFT Institute of Science and Technology
        </p>
      </div>
    </div>
  )
}

export default SideQuickLike