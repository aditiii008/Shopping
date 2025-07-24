"use client";

import Link from "next/link";
import {
  ShoppingCartIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { useCartStore } from "@/store/cart-store";

interface SessionUser {
  id: string;
  email: string;
  name?: string | null;
}

export const Navbar = () => {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { items, clearCart } = useCartStore();
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const [user, setUser] = useState<SessionUser | null>(null);
  const [checking, setChecking] = useState(true);

  const fetchSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/session", { cache: "no-store" });
      if (!res.ok) throw new Error("no session");
      const data = await res.json();
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setChecking(false);
    }
  }, []);

  // Load current session on mount
  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  // Listen for session-changed events (triggered on sign-in, sign-up, logout)
  useEffect(() => {
    const handleSessionChange = () => {
      setChecking(true);
      fetchSession();
    };

    window.addEventListener("session-changed", handleSessionChange);
    return () => window.removeEventListener("session-changed", handleSessionChange);
  }, [fetchSession]);

  // Responsive close
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = useCallback(async () => {
    await fetch("/api/auth/signout", { method: "POST" });
    setUser(null);
    clearCart();

    window.dispatchEvent(new Event("session-changed")); // Trigger refresh
    router.push("/");
    router.refresh();
  }, [router, clearCart]);

  const greeting = user?.name?.trim() ? user.name : user?.email ?? "";

  return (
    <nav className="sticky top-0 z-50 bg-[#FFF7F2] shadow-sm text-[#3D3D3D]">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/" className="hover:text-[#B1856D] transition-colors">
          <span className="font-playfair text-2xl tracking-wide">
            Uncover
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link href="/" className="hover:text-[#B1856D] transition-colors">
            Home
          </Link>
          <Link href="/products" className="hover:text-[#B1856D] transition-colors">
            Products
          </Link>
          <Link href="/checkout" className="hover:text-[#B1856D] transition-colors">
            Checkout
          </Link>
          <Link href="/orders" className="hover:text-[#B1856D] transition-colors">
            My Orders
          </Link>
        </div>

        {/* Right Controls */}
        <div className="flex items-center space-x-6">
          {/* Cart */}
          <Link href="/checkout" className="relative">
            <ShoppingCartIcon className="h-6 w-6 text-[#3D3D3D]" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#B1856D] text-xs text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Auth Controls */}
          {checking ? null : user ? (
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-sm max-w-[140px] truncate" title={greeting}>
                Hi, {greeting}
              </span>
              <Button
                variant="outline"
                className="border-[#B1856D] text-[#3D3D3D] hover:bg-[#EADBD2]"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          ) : (
            <Link
              href="/sign-in"
              className="border border-[#B1856D] text-[#3D3D3D] px-4 py-2 rounded-lg hover:bg-[#EADBD2] transition"
            >
              Login
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            className="md:hidden"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? (
              <XMarkIcon className="h-6 w-6 text-[#3D3D3D]" />
            ) : (
              <Bars3Icon className="h-6 w-6 text-[#3D3D3D]" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <nav className="md:hidden bg-[#FFF7F2] shadow-inner text-[#3D3D3D]">
          <ul className="flex flex-col p-4 space-y-2">
            <li>
              <Link
                href="/"
                className="block hover:text-[#B1856D] transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/products"
                className="block hover:text-[#B1856D] transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Products
              </Link>
            </li>
            <li>
              <Link
                href="/checkout"
                className="block hover:text-[#B1856D] transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Checkout
              </Link>
            </li>
            <li>
              <Link
                href="/orders"
                className="block hover:text-[#B1856D] transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                My Orders
              </Link>
            </li>
            <li className="pt-2 border-t border-[#D2BAA8] mt-2">
              {user ? (
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left px-2 py-2 rounded-lg hover:bg-[#EADBD2]"
                >
                  Logout
                </button>
              ) : (
                <Link
                  href="/sign-in"
                  onClick={() => setMobileOpen(false)}
                  className="block px-2 py-2 rounded-lg hover:bg-[#EADBD2]"
                >
                  Login
                </Link>
              )}
            </li>
          </ul>
        </nav>
      )}
    </nav>
  );
};
