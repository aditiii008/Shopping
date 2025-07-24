import Link from "next/link";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import type { UiProduct } from "@/types/product";

interface Props {
  product: UiProduct;
}

export const ProductCard = ({ product }: Props) => {
  const isOutOfStock = product.stock <= 0;

  return (
    <Card className="flex flex-col justify-between h-full bg-[#FFF7F2] border border-[#EDE5DC] rounded-2xl shadow-sm group transition duration-300 hover:shadow-md">
      <Link href={`/products/${product.id}`} className="block relative">
        <CardHeader>
          <CardTitle className="font-playfair text-lg font-medium text-[#444444] group-hover:text-[#B1856D] transition">
            {product.name}
          </CardTitle>
        </CardHeader>

        <CardContent className="relative">
          {/* Product Image */}
          <div className="aspect-[4/3] w-full relative overflow-hidden rounded-xl bg-white border border-[#F1E7DF]">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain p-4 transition-transform duration-300 ease-out group-hover:scale-[1.75]"
            />
            {isOutOfStock && (
              <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md">
                Out of Stock
              </span>
            )}
          </div>

          {/* Price */}
          <p className="text-xl font-semibold mt-4 text-center text-[#3D3D3D]">
            ₹{(product.price / 100).toFixed(2)}
          </p>
        </CardContent>
      </Link>

      {/* Button */}
      <div className="p-4 pt-0">
        {isOutOfStock ? (
          <Button
            disabled
            className="w-full bg-gray-400 text-white cursor-not-allowed rounded-full"
          >
            Out of Stock
          </Button>
        ) : (
          <Button
            asChild
            className="w-full bg-[#D2BAA8] text-white hover:bg-[#C9B4A2] transition rounded-full"
          >
            <Link href={`/products/${product.id}`}>View Details</Link>
          </Button>
        )}
      </div>
    </Card>
  );
};
