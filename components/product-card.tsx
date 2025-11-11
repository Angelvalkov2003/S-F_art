"use client";

import Link from "next/link";
import Stripe from "stripe";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Image from "next/image";
import { Button } from "./ui/button";
import { useCartStore } from "@/store/cart-store";
import { useState } from "react";

interface Props {
  product: Stripe.Product;
}

export const ProductCard = ({ product }: Props) => {
  const { addItem } = useCartStore();
  const price = product.default_price as Stripe.Price;
  const [isAdded, setIsAdded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const onAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (price && price.unit_amount) {
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
    }
  };

  return (
    <Card className="group hover:shadow-2xl transition-all duration-300 py-0 h-full flex flex-col border-2 border-pink-200 gap-0 rounded-2xl overflow-hidden bg-gradient-to-b from-white to-pink-50 hover:border-pink-300 hover:scale-105">
        <Link href={`/products/${product.id}`} className="block">
          {product.images && product.images[0] && (
            <div className="relative h-60 w-full overflow-hidden">
              <Image
                src={product.images[0]}
                alt={product.name}
                layout="fill"
                objectFit="cover"
                className="group-hover:opacity-90 transition-opacity duration-300 group-hover:scale-110"
              />
            </div>
          )}
          <CardHeader className="p-4 bg-gradient-to-b from-pink-50 to-white">
            <CardTitle className="text-xl font-bold text-gray-800">
              {product.name}
            </CardTitle>
          </CardHeader>
        </Link>
        <CardContent className="p-4 flex-grow flex flex-col justify-between bg-white">
          {product.description && (
            <p className="text-gray-600 text-sm mb-2">{product.description}</p>
          )}
          {price && price.unit_amount && (
            <p className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-orange-300 bg-clip-text text-transparent">
              {(price.unit_amount / 100).toFixed(2)} лв.
            </p>
          )}
          <div className="mt-4 flex gap-2 relative">
            <div className="flex-1 relative">
              <Button
                onClick={onAddToCart}
                className={`w-full bg-pink-400 text-white hover:bg-pink-500 rounded-full shadow-md hover:shadow-lg transition-all ${
                  isAnimating ? 'scale-95' : 'transform hover:scale-105'
                }`}
              >
                {isAdded ? '✓ Добавено!' : 'Добави в количката'}
              </Button>
            </div>
            <Button 
              asChild 
              variant="outline" 
              className="flex-1 rounded-full border-2 border-pink-300 text-pink-400 hover:bg-pink-50 transition-all"
            >
              <Link href={`/products/${product.id}`}>Виж детайли</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
  );
};
