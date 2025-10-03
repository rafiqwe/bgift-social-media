import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import LightIcon from '@/public/images/bgift-icon-light.png'
const NavLogo = () => {
  return (
    <Link href="/feed" className="flex items-center gap-2">
        <div className="w-10 h-10 bg-gradient-to-r relative from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Image width={30} height={30} src={LightIcon} alt="bgift-social-icon" />
        </div>
        <span className="text-xl font-bold text-gray-800 hidden sm:block">
            BGIFT Social
        </span>
    </Link>
  )
}

export default NavLogo