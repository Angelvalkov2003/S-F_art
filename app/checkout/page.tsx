"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCartStore } from "@/store/cart-store";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect, useRef, memo, useCallback } from "react";
import { CartItem } from "@/store/cart-store";

interface CartItemWithChildNameProps {
  item: CartItem;
  index: number;
  onRemove: () => void;
  onAdd: () => void;
  onUpdateChildName: (childName: string | undefined) => void;
}

const CartItemWithChildName = memo(function CartItemWithChildName({
  item,
  index,
  onRemove,
  onAdd,
  onUpdateChildName,
}: CartItemWithChildNameProps) {
  const [childName, setChildName] = useState(item.childName || "");
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isFocusedRef = useRef(false);

  // Инициализиране на state само при първо зареждане или промяна на item.id
  useEffect(() => {
    // Синхронизираме само ако input-ът не е в фокус
    if (!isFocusedRef.current) {
      setChildName(item.childName || "");
    }
  }, [item.id, item.childName]); // При промяна на item.id или childName (от външен източник)

  const handleChildNameChange = (value: string) => {
    setChildName(value);
    
    // Изчистваме предишния timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Създаваме нов timer за debounce, но НЕ обновяваме cart store докато е в фокус
    // Ще обновим само при blur
  };

  const handleFocus = () => {
    isFocusedRef.current = true;
  };

  const handleBlur = () => {
    isFocusedRef.current = false;
    
    // Изчистваме timer-а и обновяваме веднага при blur
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    
    // Обновяваме cart store при blur
    onUpdateChildName(childName || undefined);
  };

  // Cleanup на timer при unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <li className="flex flex-col gap-2 border-b-2 border-pink-200 pb-2 relative">
      <div className="flex justify-between items-start gap-4">
        {item.imageUrl && (
          <div className="relative w-16 h-16 rounded-lg overflow-hidden border-2 border-pink-200 flex-shrink-0">
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRemove}
            className="border-2 border-pink-300 text-pink-400 hover:bg-pink-50"
          >
            –
          </Button>
          <span className="text-lg font-semibold">{item.quantity}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={onAdd}
            className="border-2 border-pink-300 text-pink-400 hover:bg-pink-50"
          >
            +
          </Button>
        </div>
      </div>
      <div className="flex justify-between items-end">
        <div className="flex flex-col flex-1">
          <span className="font-medium">{item.name}</span>
          <div className="mt-2">
            <label
              htmlFor={`childName-${index}`}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Име на детето (опционално)
            </label>
            <input
              ref={inputRef}
              id={`childName-${index}`}
              type="text"
              value={childName}
              onChange={(e) => handleChildNameChange(e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder="Въведете име на детето"
              className="w-full rounded-full border-2 border-pink-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-300 bg-white text-sm"
            />
          </div>
        </div>
        <span className="font-semibold whitespace-nowrap ml-4">
          {((item.price * item.quantity) / 100).toFixed(2)} €
        </span>
      </div>
    </li>
  );
});

export default function CheckoutPage() {
  const { items, removeItem, addItem, updateItemChildName } = useCartStore();
  const router = useRouter();
  const total = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // Мемоизиране на функциите за обновяване на child name
  const handleUpdateChildName = useCallback(
    (index: number, childName: string | undefined) => {
      updateItemChildName(index, childName);
    },
    [updateItemChildName]
  );

  if (items.length === 0) {
    return (
      <div className="pb-8">
        <h1 className="text-3xl font-bold leading-none tracking-tight bg-gradient-to-r from-pink-400 to-orange-300 bg-clip-text text-transparent text-center mb-8">
          Моята Количка
        </h1>
        <div className="text-center">
          <p className="text-gray-700">Вашата количка е празна</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-8">
      <h1 className="text-3xl font-bold leading-none tracking-tight bg-gradient-to-r from-pink-400 to-orange-300 bg-clip-text text-transparent text-center mb-8">
        Моята Количка
      </h1>
      <div className="container mx-auto px-4">
        <Card className="max-w-md mx-auto mb-8 border-2 border-pink-200">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Резюме на поръчката</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {items.map((item, index) => (
              <CartItemWithChildName
                key={`${item.id}-${index}-${item.childName || ''}`}
                item={item}
                index={index}
                onRemove={() => removeItem(item.id)}
                onAdd={() => addItem({ ...item, quantity: 1 })}
                onUpdateChildName={(childName) => handleUpdateChildName(index, childName)}
              />
            ))}
          </ul>
          <div className="mt-4 border-t border-pink-200 pt-2 text-lg font-semibold text-right">
            Общо: {(total / 100).toFixed(2)} €
          </div>
        </CardContent>
      </Card>
        <div className="max-w-md mx-auto">
          <Button
            onClick={() => router.push("/checkout/shipping")}
            className="w-full bg-pink-400 text-white hover:bg-pink-500 rounded-full shadow-md hover:shadow-lg transition-all"
          >
            Продължи към доставка
          </Button>
        </div>
      </div>
    </div>
  );
}
