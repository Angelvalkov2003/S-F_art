"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCartStore } from "@/store/cart-store";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ShippingPage() {
  const { items } = useCartStore();
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    postalCode: "",
    econtOffice: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const total = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "Името е задължително";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Фамилията е задължителна";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Имейлът е задължителен";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Невалиден имейл адрес";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Телефонният номер е задължителен";
    }
    if (!formData.city.trim()) {
      newErrors.city = "Градът е задължителен";
    }
    if (!formData.postalCode.trim()) {
      newErrors.postalCode = "Пощенският код е задължителен";
    }
    if (!formData.econtOffice.trim()) {
      newErrors.econtOffice = "Адресът на офис на еконт е задължителен";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Save shipping data to sessionStorage and proceed to payment
      sessionStorage.setItem("shippingData", JSON.stringify(formData));
      router.push("/checkout/payment");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Вашата количка е празна</h1>
        <Button onClick={() => router.push("/products")}>
          Разгледай продукти
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Данни за доставка
      </h1>
      <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">Поръчка</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {items.map((item, index) => (
                <li key={`${item.id}-${index}-${item.childName || ''}`} className="flex justify-between border-b pb-2">
                  <div className="flex flex-col">
                    <span className="font-medium">{item.name}</span>
                    {item.childName && (
                      <span className="text-sm text-pink-600 font-medium">
                        Име на детето: {item.childName}
                      </span>
                    )}
                  </div>
                  <span className="font-semibold">
                    {item.quantity} x {((item.price * item.quantity) / 100).toFixed(2)} €
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 border-t pt-2 text-lg font-semibold">
              Общо: {(total / 100).toFixed(2)} €
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">
              Лични данни и адрес
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium mb-1"
                >
                  Име <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black ${
                    errors.firstName ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Въведете име"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium mb-1"
                >
                  Фамилия <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black ${
                    errors.lastName ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Въведете фамилия"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-1"
                >
                  Имейл адрес <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="example@email.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium mb-1"
                >
                  Телефонен номер <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="0888123456"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium mb-1">
                  Град <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black ${
                    errors.city ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="София"
                />
                {errors.city && (
                  <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="postalCode"
                  className="block text-sm font-medium mb-1"
                >
                  Пощенски код <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black ${
                    errors.postalCode ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="1000"
                />
                {errors.postalCode && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.postalCode}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="econtOffice"
                  className="block text-sm font-medium mb-1"
                >
                  Адрес на офис на еконт <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="econtOffice"
                  name="econtOffice"
                  value={formData.econtOffice}
                  onChange={handleChange}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black ${
                    errors.econtOffice ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Например: София, ул. Примерна 1, офис 5"
                />
                {errors.econtOffice && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.econtOffice}
                  </p>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="flex-1"
                >
                  Назад
                </Button>
                <Button type="submit" variant="default" className="flex-1">
                  Продължи към плащане
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

