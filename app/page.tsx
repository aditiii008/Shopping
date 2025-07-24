import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Carousel } from "@/components/Carousel";
import { prisma } from "@/lib/prisma";
import type { UiProduct } from "@/types/product";

function toUiProduct(db: any): UiProduct {
  return {
    id: db.id,
    name: db.name,
    description: db.description ?? undefined,
    price: db.price,
    image: db.image || "/placeholder.png",
    stock: db.stock, // Add this missing property
  };
}

export default async function Home() {
  const dbProducts = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const products: UiProduct[] = dbProducts.map(toUiProduct);

  return (
    <div className="bg-[#FFFAF5] text-[#313131]">
      {/* Hero Section */}
      <section className="py-12 bg-[#E8D8C3]">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 px-6 sm:px-10 items-center">
          {/* Text Content */}
          <div className="max-w-md space-y-5">
            <h2 className="text-3xl font-bold leading-tight tracking-tight font-playfair">
              Uncover your skin&apos;s true story
            </h2>
            <p className="text-[#5a5a5a] text-base">
              Reveal the real you and say bye to your skin problems by discovering
              the best skin clearing yet gentle skincare products!
            </p>
            <Button
              asChild
              className="bg-[#D2BAA8] text-white hover:bg-[#C9B4A2] px-6 py-3 rounded-full transition"
            >
              <Link href="/products">Browse All Products</Link>
            </Button>
          </div>

          {/* Hero Image */}
          {products[0] && (
            <Image
              alt={products[0].name}
              src={products[0].image}
              className="rounded-2xl shadow-lg object-cover"
              width={450}
              height={450}
            />
          )}
        </div>
      </section>

      {/* Carousel Section */}
      {products.length > 0 && (
        <section className="py-12 bg-[#FFFAF5]">
          <Carousel products={products} />
        </section>
      )}
    </div>
  );
}