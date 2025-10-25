import { auth } from "@/lib/auth";
import NavLogo from "./NavLogo";
import NavRightSection from "./NavRightSection";

export default async function Navbar() {
  const session = await auth();

  return (
    <nav className="fixed top-12 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLogo />
          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <input
              type="text"
              placeholder="Search BGIFT..."
              className="w-full px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Right Section */}
          <NavRightSection user={session?.user} />
        </div>
      </div>
    </nav>
  );
}
