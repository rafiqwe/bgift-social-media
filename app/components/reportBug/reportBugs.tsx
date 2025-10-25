import Link from "next/link";
import React from "react";

const ReportBugs = () => {
  return (
    <div className="bg-[linear-gradient(95deg,rgb(0,112,116)_0%,rgb(36,167,107)_100%)] py-3 flex w-full items-center justify-center fixed top-0 z-100 left-0 right-0">
      <h1 className="text-lg font-bold text-white">
        Report a Bug
        <span className="text-white/70"> (Beta)</span>
        <Link href={"/report-bug"}>
          <span className="ml-2 underline font-medium">Click Here</span>
        </Link>
      </h1>
    </div>
  );
};

export default ReportBugs;
