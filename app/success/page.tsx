"use client";

import { useCartStore, CartItem } from "@/store/cart-store";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";

interface ShippingData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  postalCode: string;
  econtOffice: string;
}

export default function SuccessPage() {
  const { items, clearCart } = useCartStore();
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const hasProcessed = useRef(false);

  useEffect(() => {
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
  }, []); // Empty dependency array - run only once

  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-3xl font-bold mb-4">Плащането е успешно!</h1>
      <p className="mb-4">
        Благодарим за покупката. Вашата поръчка се обработва.
      </p>
      {emailSent && (
        <p className="mb-4 text-green-600">
          Имейл с детайли за поръчката е изпратен успешно.
        </p>
      )}
      {emailError && (
        <p className="mb-4 text-yellow-600">
          Поръчката е успешна, но има проблем с изпращането на имейл. Моля,
          свържете се с нас.
        </p>
      )}
      <Link href="/products" className="text-blue-600 hover:underline">
        Продължи с пазаруването
      </Link>
    </div>
  );
}
