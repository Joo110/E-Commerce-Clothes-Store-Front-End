"use client";

import Image from "next/image";
import Link from "next/link";
import SearchBar from "./SearchBar";
import { Bell, Home } from "lucide-react";
import ShoppingCartIcon from "./ShoppingCartIcon";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkLoginStatus = () => {
    const token = Cookies.get("token");
    const userId = Cookies.get("userId");
    setIsLoggedIn(!!token && !!userId);
  };

  useEffect(() => {
    checkLoginStatus();
    window.addEventListener("login", checkLoginStatus);
    window.addEventListener("logout", checkLoginStatus);

    return () => {
      window.removeEventListener("login", checkLoginStatus);
      window.removeEventListener("logout", checkLoginStatus);
    };
  }, []);

  const handleAuthClick = (e: React.MouseEvent) => {
    if (isLoggedIn) {
      e.preventDefault();
      Cookies.remove("token");
      Cookies.remove("userId");
      setIsLoggedIn(false);
      window.dispatchEvent(new Event("logout"));
    }
  };

  return (
    <nav className="w-full bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* LEFT */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="Logo" width={40} height={40} />
          <p className="block text-base md:text-lg font-semibold">JOOSTORE.</p>
        </Link>

        {/* RIGHT */}
        <div className="flex items-center gap-6">
          <SearchBar onSearch={() => {}} />

          <Link href="/" className="hover:text-black text-gray-600">
            <Home className="w-5 h-5" />
          </Link>
          <ShoppingCartIcon />

          <Link
            href={isLoggedIn ? "#" : "/login"}
            onClick={handleAuthClick}
            className="text-sm font-medium hover:text-black text-gray-700"
          >
            {isLoggedIn ? "Sign out" : "Sign in"}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;