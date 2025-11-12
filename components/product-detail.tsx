"use client";

import Stripe from "stripe";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { useCartStore } from "@/store/cart-store";
import { useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

interface Props {
  product: Stripe.Product;
}

export const ProductDetail = ({ product }: Props) => {
  const { addItem } = useCartStore();
  const price = product.default_price as Stripe.Price;
  const [isAdded, setIsAdded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const onAddItem = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: price.unit_amount as number,
      imageUrl: product.images ? product.images[0] : null,
      quantity: 1,
    });

    // Trigger animation
    setIsAnimating(true);
    setIsAdded(true);

    // Reset animation after it completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 600);

    // Reset added state after showing message
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8 md:gap-4 items-center">
      {product.images && product.images[0] && (
        <div className="flex justify-center items-center w-full md:w-1/2">
          <div className="relative inline-block rounded-3xl overflow-hidden shadow-2xl border-4 border-pink-200 bg-white p-2 max-w-full md:max-w-md">
            <Image
              src={product.images[0]}
              alt={product.name}
              width={800}
              height={800}
              unoptimized
              style={{
                objectFit: "contain",
                display: "block",
                maxWidth: "100%",
                height: "auto",
              }}
              className="transition duration-300 hover:opacity-90"
            />
          </div>
        </div>
      )}
      <div className="md:w-1/2 space-y-6 bg-gradient-to-br from-pink-50 to-orange-50 p-8 rounded-3xl border-2 border-pink-200 shadow-lg">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-orange-300 bg-clip-text text-transparent">
          {product.name}
        </h1>
        <p className="text-sm text-pink-500 mb-4 text-left">
          Слагаме избрано от вас име върху продукта — уточнява се след поръчка.
        </p>
        {product.description && (
          <p className="text-gray-700 mb-4 text-lg leading-relaxed">
            {product.description}
          </p>
        )}
        {price && price.unit_amount && (
          <p className="text-3xl font-bold mb-6 bg-gradient-to-r from-pink-400 to-orange-300 bg-clip-text text-transparent text-right">
            {(price.unit_amount / 100).toFixed(2)} €
          </p>
        )}
        <div className="flex gap-4 items-center">
          <Button
            asChild
            variant="outline"
            className="rounded-full border-2 border-pink-300 text-pink-400 hover:bg-pink-50 transition-all px-6 py-4 text-lg font-semibold flex items-center gap-2"
          >
            <Link href="/products">
              <ArrowLeftIcon className="h-5 w-5" />
              Назад
            </Link>
          </Button>
          <Button
            onClick={onAddItem}
            className={`bg-pink-400 text-white hover:bg-pink-500 rounded-full px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all flex-1 ${
              isAnimating ? "scale-95" : "transform hover:scale-105"
            }`}
          >
            {isAdded ? "✓ Добавено!" : "Добави в количката"}
          </Button>
        </div>
      </div>
    </div>
  );
};
