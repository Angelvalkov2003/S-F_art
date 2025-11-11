import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getProductsList } from "@/data/products";

export default async function Home() {
  const products = getProductsList(5);

  return (
    <div>
      <section className="rounded bg-neutral-100 py-8 sm:py-12">
        <div className="mx-auto grid grid-cols-1 items-center justify-items-center gap-8 px-8 sm:px-16 md:grid-cols-2">
          <div className="max-w-md space-y-4">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Добре дошли в нашия магазин
            </h2>
            <p className="text-neutral-600">
              Открийте най-новите продукти на най-добрите цени.
            </p>
            <Button
              asChild
              variant="default"
              className="inline-flex items-center justify-center rounded-full px-6 py-3 bg-black text-white"
            >
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-full px-6 py-3"
              >
                Разгледай всички продукти
              </Link>
            </Button>
          </div>
          {products.data && products.data.length > 0 && products.data[0].images && products.data[0].images.length > 0 ? (
            <Image
              alt="Главно изображение"
              src={products.data[0].images[0]}
              className="rounded"
              width={450}
              height={450}
            />
          ) : (
            <div className="flex items-center justify-center w-[450px] h-[450px] bg-neutral-200 rounded">
              <p className="text-neutral-500">Няма налично изображение</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
