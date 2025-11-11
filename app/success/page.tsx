"use client";

import { useCartStore, CartItem } from "@/store/cart-store";
import Link from "next/link";
import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";

interface ShippingData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  postalCode: string;
  econtOffice: string;
}

function SuccessPageContent() {
  const { items, clearCart } = useCartStore();
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const hasProcessed = useRef(false);
  const searchParams = useSearchParams();
  const isCashOnDelivery = searchParams.get("payment") === "cash-on-delivery";

  useEffect(() => {
    // If cash on delivery, skip email sending
    if (isCashOnDelivery) {
      return;
    }

    // Prevent multiple executions
    if (hasProcessed.current) {
      return;
    }

    const sendOrderEmail = async () => {
      hasProcessed.current = true;

      try {
        // Get shipping data and order items from sessionStorage
        const shippingDataStr = sessionStorage.getItem("shippingData");
        const orderItemsStr = sessionStorage.getItem("orderItems");

        // Try to get items from sessionStorage first, fallback to cart
        let currentItems: CartItem[] = [];
        if (orderItemsStr) {
          try {
            currentItems = JSON.parse(orderItemsStr) as CartItem[];
          } catch (e) {
            console.warn(
              "[Success Page] Failed to parse orderItems from storage, using cart items"
            );
            currentItems = [...items];
          }
        } else {
          currentItems = [...items];
        }

        if (!shippingDataStr || currentItems.length === 0) {
          sessionStorage.removeItem("orderItems");
          clearCart();
          return;
        }

        const shippingData: ShippingData = JSON.parse(shippingDataStr);
        const total = currentItems.reduce(
          (acc: number, item: CartItem) => acc + item.price * item.quantity,
          0
        );

        const emailPayload = {
          firstName: shippingData.firstName,
          lastName: shippingData.lastName,
          email: shippingData.email,
          phone: shippingData.phone,
          city: shippingData.city,
          postalCode: shippingData.postalCode,
          econtOffice: shippingData.econtOffice,
          items: currentItems,
          total: total,
        };

        // Send email with order information with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        try {
          const response = await fetch("/api/send-order-email", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            signal: controller.signal,
            body: JSON.stringify(emailPayload),
          });

          clearTimeout(timeoutId);

          const responseData = await response.json();

          if (response.ok) {
            setEmailSent(true);
            // Clear shipping data and order items from sessionStorage
            sessionStorage.removeItem("shippingData");
            sessionStorage.removeItem("orderItems");
          } else {
            console.error(
              "[Success Page] Failed to send order email:",
              responseData
            );
            setEmailError(true);
          }
        } catch (fetchError: any) {
          clearTimeout(timeoutId);
          if (fetchError.name === "AbortError") {
            console.error("[Success Page] Request timeout");
            setEmailError(true);
          } else {
            console.error("[Success Page] Fetch error:", fetchError);
            throw fetchError;
          }
        }
      } catch (error) {
        console.error("[Success Page] Error sending order email:", error);
        setEmailError(true);
      } finally {
        // Clear cart and sessionStorage after attempting to send email
        sessionStorage.removeItem("orderItems");
        clearCart();
      }
    };

    sendOrderEmail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCashOnDelivery]); // Run when cash on delivery status changes

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-pink-400 to-orange-300 bg-clip-text text-transparent">
          {isCashOnDelivery
            ? "Нашия екип обработва покупката"
            : "Плащането е успешно!"}
        </h1>
      </div>

      <div className="bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50 p-8 md:p-12 rounded-3xl border-2 border-pink-200 shadow-lg">
        <div className="space-y-6 text-lg text-gray-700 leading-relaxed text-center">
          {isCashOnDelivery ? (
            <>
              <p className="text-2xl font-semibold text-gray-800 mb-6">
                Благодарим ви за покупката.
              </p>
              <p className="text-xl text-gray-800 mb-4">
                Човек ще се свърже с вас за да ви обясни процедурата за плащане.
              </p>
            </>
          ) : (
            <>
              <p className="text-2xl font-semibold text-gray-800 mb-6">
                Благодарим ви за покупката.
              </p>
              <p>В кратък срок ще се свържем с вас.</p>
              <p>
                Ако имате проблеми или забавяне пишете на{" "}
                <a
                  href="mailto:s_fart@abv.bg"
                  className="text-pink-600 hover:text-pink-700 font-medium underline transition-colors"
                >
                  s_fart@abv.bg
                </a>{" "}
                или се обадете на{" "}
                <a
                  href="tel:+359899037420"
                  className="text-pink-600 hover:text-pink-700 font-medium underline transition-colors"
                >
                  0899037420
                </a>
                .
              </p>
            </>
          )}
        </div>
      </div>

      {emailSent && (
        <div className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-2xl text-green-700 text-center">
          Имейл с детайли за поръчката е изпратен успешно.
        </div>
      )}
      {emailError && (
        <div className="mt-6 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-2xl text-yellow-700 text-center">
          Поръчката е успешна, но има проблем с изпращането на имейл. Моля,
          свържете се с нас.
        </div>
      )}

      <div className="mt-8 text-center">
        <Link
          href="/products"
          className="inline-flex items-center justify-center rounded-full px-8 py-4 bg-gradient-to-r from-pink-400 to-orange-300 text-white hover:from-pink-500 hover:to-orange-400 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 text-lg font-semibold"
        >
          Продължи с пазаруването
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-12 max-w-3xl text-center">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-pink-400 to-orange-300 bg-clip-text text-transparent">
            Зареждане...
          </h1>
        </div>
      }
    >
      <SuccessPageContent />
    </Suspense>
  );
}
