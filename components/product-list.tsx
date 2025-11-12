"use client";

import Stripe from "stripe";
import { ProductCard } from "./product-card";
import { useState, useMemo, useRef, useEffect } from "react";
import { ArrowsUpDownIcon, FunnelIcon } from "@heroicons/react/24/outline";
import { Button } from "./ui/button";
import { productTypes } from "@/data/products";
import { useSearchParams, useRouter } from "next/navigation";

interface Props {
  products: Stripe.Product[];
}

type SortOption = "default" | "price-asc" | "price-desc" | "name-asc" | "name-desc";

export const ProductList = ({ products }: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const typeFromUrl = searchParams.get("type");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortOption, setSortOption] = useState<SortOption>("default");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(typeFromUrl);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  // Синхронизиране на selectedType с URL параметъра
  useEffect(() => {
    const typeParam = searchParams.get("type");
    setSelectedType(typeParam);
  }, [searchParams]);

  // Функция за обновяване на URL при промяна на филтъра
  const handleTypeChange = (type: string | null) => {
    setSelectedType(type);
    setIsFilterOpen(false);
    if (type) {
      router.push(`/products?type=${encodeURIComponent(type)}`);
    } else {
      router.push("/products");
    }
  };

  // Затваряне на dropdown при клик извън него
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };

    if (isDropdownOpen || isFilterOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen, isFilterOpen]);

  const getSortLabel = (option: SortOption) => {
    switch (option) {
      case "default":
        return "Подредба";
      case "price-asc":
        return "Цена ↑";
      case "price-desc":
        return "Цена ↓";
      case "name-asc":
        return "Име А-Я";
      case "name-desc":
        return "Име Я-А";
      default:
        return "Подредба";
    }
  };

  // Филтриране на типовете, за които има поне един продукт
  const availableTypes = useMemo(() => {
    const typesSet = new Set<string>();
    products.forEach((product) => {
      const productType = product.metadata?.productType;
      if (productType) {
        typesSet.add(productType);
      }
    });
    return productTypes.filter((type) => typesSet.has(type));
  }, [products]);

  const filteredAndSortedProducts = useMemo(() => {
    // Филтриране по тип
    let filtered = products.filter((product) => {
      if (selectedType) {
        const productType = product.metadata?.productType;
        if (productType !== selectedType) {
          return false;
        }
      }
      return true;
    });

    // Филтриране по търсене
    filtered = filtered.filter((product) => {
      const term = searchTerm.toLowerCase();
      const nameMatch = product.name.toLowerCase().includes(term);
      const descriptionMatch = product.description
        ? product.description.toLowerCase().includes(term)
        : false;

      return nameMatch || descriptionMatch;
    });

    // Сортиране
    if (sortOption === "price-asc") {
      filtered = [...filtered].sort((a, b) => {
        const priceA = (a.default_price as Stripe.Price)?.unit_amount || 0;
        const priceB = (b.default_price as Stripe.Price)?.unit_amount || 0;
        return priceA - priceB;
      });
    } else if (sortOption === "price-desc") {
      filtered = [...filtered].sort((a, b) => {
        const priceA = (a.default_price as Stripe.Price)?.unit_amount || 0;
        const priceB = (b.default_price as Stripe.Price)?.unit_amount || 0;
        return priceB - priceA;
      });
    } else if (sortOption === "name-asc") {
      filtered = [...filtered].sort((a, b) => {
        return a.name.localeCompare(b.name, "bg");
      });
    } else if (sortOption === "name-desc") {
      filtered = [...filtered].sort((a, b) => {
        return b.name.localeCompare(a.name, "bg");
      });
    }

    return filtered;
  }, [products, searchTerm, sortOption, selectedType]);

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-center sm:items-center">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Търси продукти..."
          className="w-full max-w-md rounded-full border-2 border-pink-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-300 bg-white"
        />
        <div className="flex gap-2 self-end sm:self-auto">
        <div className="relative" ref={filterRef}>
          <Button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`bg-pink-400 text-white hover:bg-pink-500 rounded-full shadow-md hover:shadow-lg transition-all px-4 py-2 h-auto gap-2 ${
              selectedType ? "ring-2 ring-pink-300" : ""
            }`}
          >
            <FunnelIcon className="h-4 w-4" />
            <span className="text-sm">Филтър</span>
          </Button>
          <div
            className={`absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border-2 border-pink-200 overflow-hidden z-50 transition-all duration-300 ease-out max-h-96 overflow-y-auto ${
              isFilterOpen
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
            }`}
          >
            <button
              onClick={() => handleTypeChange(null)}
              className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                selectedType === null
                  ? "bg-pink-100 text-pink-600 font-semibold"
                  : "text-gray-700 hover:bg-pink-50"
              }`}
            >
              Всички продукти
            </button>
            {availableTypes.map((type) => (
              <button
                key={type}
                onClick={() => handleTypeChange(type)}
                className={`w-full text-left px-4 py-3 text-sm transition-colors border-t border-pink-100 ${
                  selectedType === type
                    ? "bg-pink-100 text-pink-600 font-semibold"
                    : "text-gray-700 hover:bg-pink-50"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
        <div className="relative" ref={dropdownRef}>
          <Button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="bg-pink-400 text-white hover:bg-pink-500 rounded-full shadow-md hover:shadow-lg transition-all px-4 py-2 h-auto gap-2"
          >
            <ArrowsUpDownIcon className="h-4 w-4" />
            <span className="text-sm">{getSortLabel(sortOption)}</span>
          </Button>
          <div
            className={`absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border-2 border-pink-200 overflow-hidden z-50 transition-all duration-300 ease-out ${
              isDropdownOpen
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
            }`}
          >
            <button
              onClick={() => {
                setSortOption("default");
                setIsDropdownOpen(false);
              }}
              className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                sortOption === "default"
                  ? "bg-pink-100 text-pink-600 font-semibold"
                  : "text-gray-700 hover:bg-pink-50"
              }`}
            >
              Подредба по подразбиране
            </button>
            <button
              onClick={() => {
                setSortOption("price-asc");
                setIsDropdownOpen(false);
              }}
              className={`w-full text-left px-4 py-3 text-sm transition-colors border-t border-pink-100 ${
                sortOption === "price-asc"
                  ? "bg-pink-100 text-pink-600 font-semibold"
                  : "text-gray-700 hover:bg-pink-50"
              }`}
            >
              Цена: Възходящо ↑
            </button>
            <button
              onClick={() => {
                setSortOption("price-desc");
                setIsDropdownOpen(false);
              }}
              className={`w-full text-left px-4 py-3 text-sm transition-colors border-t border-pink-100 ${
                sortOption === "price-desc"
                  ? "bg-pink-100 text-pink-600 font-semibold"
                  : "text-gray-700 hover:bg-pink-50"
              }`}
            >
              Цена: Низходящо ↓
            </button>
            <button
              onClick={() => {
                setSortOption("name-asc");
                setIsDropdownOpen(false);
              }}
              className={`w-full text-left px-4 py-3 text-sm transition-colors border-t border-pink-100 ${
                sortOption === "name-asc"
                  ? "bg-pink-100 text-pink-600 font-semibold"
                  : "text-gray-700 hover:bg-pink-50"
              }`}
            >
              Име: А-Я
            </button>
            <button
              onClick={() => {
                setSortOption("name-desc");
                setIsDropdownOpen(false);
              }}
              className={`w-full text-left px-4 py-3 text-sm transition-colors border-t border-pink-100 ${
                sortOption === "name-desc"
                  ? "bg-pink-100 text-pink-600 font-semibold"
                  : "text-gray-700 hover:bg-pink-50"
              }`}
            >
              Име: Я-А
            </button>
          </div>
        </div>
        </div>
      </div>
      <ul className="mt-6 grid grid-cols-2 gap-2 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredAndSortedProducts.map((product, key) => (
          <li key={key}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </div>
  );
};
