import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getProductsList } from "@/data/products";

export default async function Home() {
  const products = getProductsList(5);

  return (
    <div>
      <section className="rounded-3xl bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 py-12 sm:py-16 shadow-lg border border-pink-100">
        <div className="mx-auto grid grid-cols-1 items-center justify-items-center gap-8 px-8 sm:px-16 md:grid-cols-2">
          <div className="max-w-md space-y-6">
            <h2 className="text-4xl font-bold tracking-tight md:text-5xl bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              Добре дошли в S&F Art
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              Открийте най-новите продукти на най-добрите цени.
            </p>
            <Button
              asChild
              variant="default"
              className="inline-flex items-center justify-center rounded-full px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 text-lg font-semibold"
            >
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-full px-8 py-4"
              >
                Разгледай всички продукти
              </Link>
            </Button>
          </div>
          {products.data && products.data.length > 0 && products.data[0].images && products.data[0].images.length > 0 ? (
            <Image
              alt="Главно изображение"
              src={products.data[0].images[0]}
              className="rounded-3xl shadow-2xl border-4 border-pink-200"
              width={450}
              height={450}
            />
          ) : (
            <div className="flex items-center justify-center w-[450px] h-[450px] bg-gradient-to-br from-pink-100 to-purple-100 rounded-3xl border-4 border-pink-200">
              <p className="text-gray-500 text-lg">Няма налично изображение</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
