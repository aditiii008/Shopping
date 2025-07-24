import { prisma } from "@/lib/prisma";
import { ProductList } from "@/components/product-list";
import type { UiProduct } from "@/types/product";

function toUiProduct(db: any): UiProduct {
  return {
    id: db.id,
    name: db.name,
    description: db.description ?? undefined,
    price: db.price,
    image: db.image || "/placeholder.png",
    stock: db.stock, // Include stock
  };
}

export default async function ProductsPage() {
  const dbProducts = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  const products: UiProduct[] = dbProducts.map(toUiProduct);

  return (
    <div className="bg-[#FFFAF5] min-h-screen px-4 sm:px-6 md:px-10 py-12">
      <h1 className="text-4xl font-bold text-center text-[#444444] mb-10 font-playfair">
        All Products
      </h1>
      <ProductList products={products} />
    </div>
  );
}
