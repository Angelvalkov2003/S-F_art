"use client";

import Link from "next/link";
import {
  ShoppingCartIcon,
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  ShoppingBagIcon,
  InformationCircleIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { useCartStore } from "@/store/cart-store";
import { useEffect, useState, useRef } from "react";
import { Button } from "./ui/button";
import { getAvailableProductTypes } from "@/data/products";

export const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState<boolean>(false);
  const [mobileProductsDropdownOpen, setMobileProductsDropdownOpen] = useState<boolean>(false);
  const { items } = useCartStore();
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevCartCountRef = useRef(cartCount);
  const productsDropdownRef = useRef<HTMLDivElement>(null);
  const mobileProductsDropdownRef = useRef<HTMLDivElement>(null);
  
  // Получаване само на типовете, за които има продукти
  const availableProductTypes = getAvailableProductTypes();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileOpen(false);
        setMobileProductsDropdownOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Затваряне на dropdown при клик извън него
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (productsDropdownRef.current && !productsDropdownRef.current.contains(event.target as Node)) {
        setProductsDropdownOpen(false);
      }
      if (mobileProductsDropdownRef.current && !mobileProductsDropdownRef.current.contains(event.target as Node)) {
        setMobileProductsDropdownOpen(false);
      }
    };

    if (productsDropdownOpen || mobileProductsDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [productsDropdownOpen, mobileProductsDropdownOpen]);

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
            className="text-pink-400 hover:text-pink-500 transition-colors font-medium flex items-center gap-2"
          >
            <HomeIcon className="h-5 w-5" />
            Начало
          </Link>
          <div className="relative" ref={productsDropdownRef}>
            <button
              onClick={() => setProductsDropdownOpen(!productsDropdownOpen)}
              className="text-pink-400 hover:text-pink-500 transition-colors font-medium flex items-center gap-2"
            >
              <ShoppingBagIcon className="h-5 w-5" />
              Продукти
              <ChevronDownIcon className={`h-4 w-4 transition-transform ${productsDropdownOpen ? "rotate-180" : ""}`} />
            </button>
            <div
              className={`absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border-2 border-pink-200 overflow-hidden z-50 transition-all duration-300 ease-out max-h-96 overflow-y-auto ${
                productsDropdownOpen
                  ? "opacity-100 translate-y-0 scale-100"
                  : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
              }`}
            >
              <Link
                href="/products"
                onClick={() => setProductsDropdownOpen(false)}
                className="block w-full text-left px-4 py-3 text-sm transition-colors text-gray-700 hover:bg-pink-50"
              >
                Всички продукти
              </Link>
              {availableProductTypes.map((type) => (
                <Link
                  key={type}
                  href={`/products?type=${encodeURIComponent(type)}`}
                  onClick={() => setProductsDropdownOpen(false)}
                  className="block w-full text-left px-4 py-3 text-sm transition-colors border-t border-pink-100 text-gray-700 hover:bg-pink-50"
                >
                  {type}
                </Link>
              ))}
            </div>
          </div>
          <Link
            href="/checkout"
            className="text-pink-400 hover:text-pink-500 transition-colors font-medium flex items-center gap-2"
          >
            <ShoppingCartIcon className="h-5 w-5" />
            Моята количка
          </Link>
          <Link
            href="/about"
            className="text-pink-400 hover:text-pink-500 transition-colors font-medium flex items-center gap-2"
          >
            <InformationCircleIcon className="h-5 w-5" />
            За Нас
          </Link>
        </div>
        <div className="flex items-center space-x-3">
          {/* Facebook Icon */}
          <a
            href="https://www.facebook.com/share/1BH1LU1GvJ"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-400 hover:text-pink-500 transition-colors"
            aria-label="Facebook"
          >
            <svg
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                clipRule="evenodd"
              />
            </svg>
          </a>
          {/* Instagram Icon */}
          <a
            href="https://www.instagram.com/s_f_art/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-400 hover:text-pink-500 transition-colors"
            aria-label="Instagram"
          >
            <svg
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                clipRule="evenodd"
              />
            </svg>
          </a>
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
              <XMarkIcon className="h-6 w-6 text-pink-400" />
            ) : (
              <Bars3Icon className="h-6 w-6 text-pink-400" />
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
                className="block text-pink-400 hover:text-pink-500 transition-colors font-medium py-2 rounded-lg hover:bg-pink-100 px-3 flex items-center gap-2"
                onClick={() => setMobileOpen(false)}
              >
                <HomeIcon className="h-5 w-5" />
                Начало
              </Link>
            </li>
            <li ref={mobileProductsDropdownRef}>
              <button
                onClick={() => setMobileProductsDropdownOpen(!mobileProductsDropdownOpen)}
                className="w-full text-left text-pink-400 hover:text-pink-500 transition-colors font-medium py-2 rounded-lg hover:bg-pink-100 px-3 flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2">
                  <ShoppingBagIcon className="h-5 w-5" />
                  Продукти
                </div>
                <ChevronDownIcon className={`h-4 w-4 transition-transform ${mobileProductsDropdownOpen ? "rotate-180" : ""}`} />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  mobileProductsDropdownOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <ul className="pl-6 pt-2 space-y-1">
                  <li>
                    <Link
                      href="/products"
                      className="block text-pink-400 hover:text-pink-500 transition-colors font-medium py-2 rounded-lg hover:bg-pink-100 px-3"
                      onClick={() => {
                        setMobileOpen(false);
                        setMobileProductsDropdownOpen(false);
                      }}
                    >
                      Всички продукти
                    </Link>
                  </li>
                  {availableProductTypes.map((type) => (
                    <li key={type}>
                      <Link
                        href={`/products?type=${encodeURIComponent(type)}`}
                        className="block text-pink-400 hover:text-pink-500 transition-colors font-medium py-2 rounded-lg hover:bg-pink-100 px-3"
                        onClick={() => {
                          setMobileOpen(false);
                          setMobileProductsDropdownOpen(false);
                        }}
                      >
                        {type}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
            <li>
              <Link
                href="/checkout"
                className="block text-pink-400 hover:text-pink-500 transition-colors font-medium py-2 rounded-lg hover:bg-pink-100 px-3 flex items-center gap-2"
                onClick={() => setMobileOpen(false)}
              >
                <ShoppingCartIcon className="h-5 w-5" />
                Моята количка
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="block text-pink-400 hover:text-pink-500 transition-colors font-medium py-2 rounded-lg hover:bg-pink-100 px-3 flex items-center gap-2"
                onClick={() => setMobileOpen(false)}
              >
                <InformationCircleIcon className="h-5 w-5" />
                За Нас
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </nav>
  );
};
