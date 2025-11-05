"use client";
import React from "react";
import ComingSoonImage from "@/public/images/coming-soon.webp";
import Image from "next/image";
import { useRouter } from "next/navigation";
const NotFound = () => {
  const route = useRouter();
  const handleGoBack = () => {
    route.back();
  };
  return (
    <div className="w-full h-full">
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-2xl w-full ">
          <div className="flex items-center justify-center mb-5">
            <Image
              className="w-50 h-50"
              src={ComingSoonImage}
              alt="Coming Soon"
              width={200}
              height={200}
            />
          </div>
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 ">
            Coming Soon!
          </h1>
          <p className="text-lg text-gray-900 text-center mb-8">
            We{"'"}re working hard to bring you this page. Stay tuned for
            something awesome!
          </p>
          <div className="flex w-full mx-auto justify-center">
            <button
              onClick={handleGoBack}
              className="px-7 cursor-pointer font-bold py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition 
              "
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
