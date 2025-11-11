"use client";

import Link from "next/link";
import {
  ShoppingCartIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useCartStore } from "@/store/cart-store";
import { useEffect, useState, useRef } from "react";
import { Button } from "./ui/button";
export const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const { items } = useCartStore();
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevCartCountRef = useRef(cartCount);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Animate cart icon when item is added
  useEffect(() => {
    if (cartCount > prevCartCountRef.current) {
      setIsAnimating(true);
      setTimeout(() => {
        setIsAnimating(false);
      }, 600);
    }
    prevCartCountRef.current = cartCount;
  }, [cartCount]);

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-pink-50 via-rose-50 to-orange-50 shadow-md border-b border-pink-100">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link
          href="/"
          className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-orange-300 bg-clip-text text-transparent hover:from-pink-500 hover:to-orange-400 transition-all"
        >
          S&F Art
        </Link>
        <div className="hidden md:flex space-x-6">
          <Link
            href="/"
            className="text-gray-700 hover:text-pink-400 transition-colors font-medium"
          >
            Начало
          </Link>
          <Link
            href="/products"
            className="text-gray-700 hover:text-pink-400 transition-colors font-medium"
          >
            Продукти
          </Link>
          <Link
            href="/about"
            className="text-gray-700 hover:text-pink-400 transition-colors font-medium"
          >
            За Нас
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/checkout" className="relative">
            <ShoppingCartIcon
              className={`h-6 w-6 text-pink-400 hover:text-pink-500 transition-all duration-300 ${
                isAnimating ? "scale-125" : "scale-100"
              }`}
            />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-pink-400 text-xs text-white font-bold shadow-md">
                {cartCount}
              </span>
            )}
          </Link>
          <Button
            variant="ghost"
            className="md:hidden"
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            {mobileOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="bg-gradient-to-b from-pink-50 to-rose-50 shadow-md">
          <ul className="flex flex-col p-4 space-y-2">
            <li>
              <Link
                href="/"
                className="block text-gray-700 hover:text-pink-400 transition-colors font-medium py-2 rounded-lg hover:bg-pink-100 px-3"
                onClick={() => setMobileOpen(false)}
              >
                Начало
              </Link>
            </li>
            <li>
              <Link
                href="/products"
                className="block text-gray-700 hover:text-pink-400 transition-colors font-medium py-2 rounded-lg hover:bg-pink-100 px-3"
                onClick={() => setMobileOpen(false)}
              >
                Продукти
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="block text-gray-700 hover:text-pink-400 transition-colors font-medium py-2 rounded-lg hover:bg-pink-100 px-3"
                onClick={() => setMobileOpen(false)}
              >
                За Нас
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </nav>
  );
};
