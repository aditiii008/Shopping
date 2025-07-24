import { prisma } from "@/lib/prisma";
import { ProductDetail } from "@/components/product-detail";
import type { UiProduct } from "@/types/product";

function toUiProduct(db: any): UiProduct {
  return {
    id: db.id,
    name: db.name,
    description: db.description ?? undefined,
    price: db.price,
    image: db.image || "/placeholder.png",
    stock: db.stock, 
  };
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const dbProduct = await prisma.product.findUnique({
    where: { id: params.id },
  });

  if (!dbProduct) {
    return (
      <div className="bg-[#FFFAF5] min-h-screen flex items-center justify-center text-[#444444]">
        <h1 className="text-2xl font-bold">Product not found</h1>
      </div>
    );
  }

  const product: UiProduct = toUiProduct(dbProduct);
  return <ProductDetail product={product} />;
}