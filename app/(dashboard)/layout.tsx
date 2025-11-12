import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import RightSidebar from "../components/layout/RightSidebar";
import ReportBugs from "../components/reportBug/reportBugs";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 text-gray-900">
      {/* Top Navigation */}
      <ReportBugs />
      <Navbar />
      <div className="max-w-7xl mx-auto pt-26">
        <div className="flex  md:gap-6 md:px-4 py-6 ">
          {/* Left Sidebar - Hidden on mobile */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-20">
              <Sidebar />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0 ">{children}</main>

          {/* Right Sidebar - Hidden on mobile and tablet */}
          <aside className="hidden xl:block w-80 flex-shrink-0">
            <div className="sticky top-20">
              <RightSidebar />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
