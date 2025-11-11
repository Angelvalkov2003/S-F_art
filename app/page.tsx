import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getProductsList } from "@/data/products";

export default async function Home() {
  const products = getProductsList(5);

  return (
    <div>
      <section className="rounded-3xl bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50 py-12 sm:py-16 shadow-lg border border-pink-100">
        <div className="mx-auto grid grid-cols-1 items-center justify-items-center gap-8 px-8 sm:px-16 md:grid-cols-2">
          <div className="max-w-md space-y-6">
            <h2 className="text-4xl font-bold tracking-tight md:text-5xl bg-gradient-to-r from-pink-400 to-orange-300 bg-clip-text text-transparent">
              Добре дошли в мястото, където светлината оживява.
            </h2>
            <div className="text-gray-700 text-lg leading-relaxed space-y-4">
              <p>
                Всяка лампа тук е създадена с любов — персонализирана, уникална
                и вдъхновена от теб.
              </p>
              <p>
                За малките чудеса в живота, за миговете, които искаме да запазим
                завинаги.
              </p>
              <p className="text-xl">
                🌙 Нека твоят свят заблести по твой начин.
              </p>
            </div>
            <Button
              asChild
              variant="default"
              className="inline-flex items-center justify-center rounded-full px-12 py-6 bg-pink-400 text-white hover:bg-pink-500 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 text-xl font-semibold"
            >
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-full px-12 py-6"
              >
                Разгледай всички продукти
              </Link>
            </Button>
          </div>
          <div className="flex items-center justify-center">
            <Image
              alt="S&F Art Logo"
              src="/sf_art_logo.webp"
              className="rounded-3xl shadow-2xl border-4 border-pink-200 bg-white p-4"
              width={450}
              height={450}
              priority
              unoptimized
            />
          </div>
        </div>
      </section>
    </div>
  );
}
