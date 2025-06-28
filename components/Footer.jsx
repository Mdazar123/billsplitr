"use client";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 w-full border-t border-gray-800">
      <div className="container mx-auto px-4 flex flex-col items-center justify-center py-5 gap-4">
        {/* Logo and name centered */}
        <div className="flex items-center gap-2 justify-center">
          <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h7.79M16 5v2M8 5v2m-3 4h16M17 17l2 2 4-4" /></svg>
          </div>
          <span className="text-base sm:text-lg font-bold">BillSplitr</span>
        </div>
        {/* Navigation links centered */}
        <nav className="flex flex-wrap items-center justify-center gap-2 text-sm sm:text-base">
          <a href="/dashboard" className="hover:text-white">Dashboard</a>
          <span className="mx-1">/</span>
          <a href="/about" className="hover:text-white">About</a>
          <span className="mx-1">/</span>
          <a href="/login" className="hover:text-white">Sign In</a>
          <span className="mx-1">/</span>
          <a href="/register" className="hover:text-white">Sign Up</a>
        </nav>
      </div>
      <div className="border-t border-gray-800 mt-2 pt-4 pb-2 text-center text-xs text-gray-400">
        &copy; 2025 BillSplitr. All rights reserved. Made with <span className="text-pink-500">❤️</span> for better expense management.
      </div>
    </footer>
  );
}
