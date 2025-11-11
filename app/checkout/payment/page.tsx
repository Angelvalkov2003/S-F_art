"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCartStore } from "@/store/cart-store";
import { checkoutAction } from "../checkout-action";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ShippingData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  postalCode: string;
  econtOffice: string;
}

export default function PaymentPage() {
  const { items, clearCart } = useCartStore();
  const router = useRouter();
  const [shippingData, setShippingData] = useState<ShippingData | null>(null);
  const [isProcessingCashOnDelivery, setIsProcessingCashOnDelivery] = useState(false);

  useEffect(() => {
    // Get shipping data from sessionStorage
    const stored = sessionStorage.getItem("shippingData");
    if (!stored) {
      router.push("/checkout/shipping");
      return;
    }
    setShippingData(JSON.parse(stored));
  }, [router]);

  const total = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleCashOnDelivery = async () => {
    if (!shippingData || items.length === 0) return;

    setIsProcessingCashOnDelivery(true);

    try {
      const emailPayload = {
        firstName: shippingData.firstName,
        lastName: shippingData.lastName,
        email: shippingData.email,
        phone: shippingData.phone,
        city: shippingData.city,
        postalCode: shippingData.postalCode,
        econtOffice: shippingData.econtOffice,
        items: items,
        total: total,
      };

      const response = await fetch("/api/send-cash-on-delivery-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailPayload),
      });

      // Clear cart and sessionStorage
      clearCart();
      sessionStorage.removeItem("shippingData");
      sessionStorage.removeItem("orderItems");

      // Redirect to success page with cash on delivery flag
      router.push("/success?payment=cash-on-delivery");
    } catch (error) {
      console.error("[Payment Page] Error sending cash on delivery email:", error);
      setIsProcessingCashOnDelivery(false);
      alert("Възникна грешка. Моля, опитайте отново.");
    }
  };

  if (items.length === 0 || !shippingData) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Зареждане...</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Плащане</h1>
      <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">
              Данни за доставка
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              <strong>Име:</strong> {shippingData.firstName}{" "}
              {shippingData.lastName}
            </p>
            <p>
              <strong>Имейл:</strong> {shippingData.email}
            </p>
            <p>
              <strong>Телефон:</strong> {shippingData.phone}
            </p>
            <p>
              <strong>Град:</strong> {shippingData.city}
            </p>
            <p>
              <strong>Пощенски код:</strong> {shippingData.postalCode}
            </p>
            <p>
              <strong>Адрес на еконт:</strong> {shippingData.econtOffice}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">Поръчка</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 mb-4">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between border-b pb-2"
                >
                  <span className="font-medium">{item.name}</span>
                  <span className="font-semibold">
                    {item.quantity} x{" "}
                    {((item.price * item.quantity) / 100).toFixed(2)} лв.
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 border-t pt-2 text-lg font-semibold mb-6">
              Общо: {(total / 100).toFixed(2)} лв.
            </div>
            
            <div className="space-y-4">
              <p className="text-lg font-semibold text-gray-800 mb-4">
                Изберете начин на плащане
              </p>
              
              <form
                action={checkoutAction}
                onSubmit={(e) => {
                  // Save items to sessionStorage before redirecting to Stripe
                  sessionStorage.setItem("orderItems", JSON.stringify(items));
                }}
              >
                <input type="hidden" name="items" value={JSON.stringify(items)} />
                <input
                  type="hidden"
                  name="shippingData"
                  value={JSON.stringify(shippingData)}
                />
                <Button 
                  type="submit" 
                  variant="default"
                  className="w-full"
                >
                  Плащане с карта
                </Button>
              </form>
              
              <Button
                onClick={handleCashOnDelivery}
                disabled={isProcessingCashOnDelivery}
                variant="default"
                className="w-full"
              >
                {isProcessingCashOnDelivery ? "Обработва се..." : "Наложен платеж и капаро по EasyPay"}
              </Button>
              
              <Button
                onClick={() => router.push("/checkout/shipping")}
                variant="outline"
                className="w-full"
              >
                Назад
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
