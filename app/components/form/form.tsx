"use client";

import { signInSocialMedia } from "@/app/action/authAciton";
// import { auth } from "@/lib/auth";
import { FacebookIcon, Github } from "lucide-react";
import Image from "next/image";

export default  function SignInForm() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      {/* Title */}
      <h1 className="text-2xl font-bold mb-6">Sign in to Your Account</h1>

      {/* Buttons */}
      <form action={signInSocialMedia} className="flex flex-col gap-4 w-64">
        <button
            name="action" 
            value={'google'}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
        >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 488 512">
            <path fill="#4285F4" d="M488 261.8c0-17.8-1.5-35.2-4.3-52H249v98h134c-5.8 31.4-23 57.9-49 75.6v62h79c46.2-42.6 75-105.3 75-183.6z"/>
            <path fill="#34A853" d="M249 492c66 0 121.3-21.7 161.7-59.1l-79-62c-22.1 15-50.5 23.7-82.7 23.7-63.6 0-117.5-42.9-136.8-100.5h-81v63.3C70.5 439.4 154.1 492 249 492z"/>
            <path fill="#FBBC05" d="M112.2 294.1c-4.9-14.5-7.7-29.9-7.7-45.6s2.8-31.1 7.7-45.6v-63.3h-81C18 181.7 10 214.8 10 248.5s8 66.8 21.2 95.9l81-63.3z"/>
            <path fill="#EA4335" d="M249 97.5c36 0 68.4 12.4 94 36.6l70.4-70.4C370.3 24.7 315 2 249 2 154.1 2 70.5 54.6 31.2 152.6l81 63.3C131.5 140.4 185.4 97.5 249 97.5z"/>
        </svg>
        </button>

        <button
            name="action" 
            value={'github'}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg shadow hover:bg-gray-900 transition"
        >
          {/* <Image src="/github.svg" alt="GitHub" width={20} height={20} /> */}
            <Github/>
        </button>

        <button
            name="action" 
            value={'facebook'}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          {/* <Image src="/facebook.svg" alt="Facebook" width={20} height={20} /> */}
            <FacebookIcon/>
        </button>
      </form>
    </div>
  );
}
