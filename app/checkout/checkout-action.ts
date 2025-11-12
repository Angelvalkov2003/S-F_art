"use server";

import { stripe } from "@/lib/stripe";
import { CartItem } from "@/store/cart-store";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export const checkoutAction = async (formData: FormData): Promise<void> => {
  const itemsJson = formData.get("items") as string;
  const shippingDataJson = formData.get("shippingData") as string;
  const items = JSON.parse(itemsJson);
  const shippingData = shippingDataJson ? JSON.parse(shippingDataJson) : null;

  const line_items = items.map((item: CartItem) => ({
    price_data: {
      currency: "eur",
      product_data: { name: item.name },
      unit_amount: item.price,
    },
    quantity: item.quantity,
  }));

  // Get base URL from environment or construct from headers
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items,
    mode: "payment",
    success_url: `${baseUrl}/success`,
    cancel_url: `${baseUrl}/cancel`,
  });

  redirect(session.url!);
};
