"use client";

import Image from "next/image";
import { Button } from "./ui/button";
import { useCartStore } from "@/store/cart-store";
import type { UiProduct } from "@/types/product";

interface Props {
  product: UiProduct;
}

export const ProductDetail = ({ product }: Props) => {
  const { items, addItem, removeItem } = useCartStore();
  const cartItem = items.find((item) => item.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const onAddItem = () => {
    if (product.stock > 0) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.image,
        quantity: 1,
      });
    }
  };

  return (
    <div className="bg-[#FFFAF5] text-[#3D3D3D] min-h-screen">
      <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row gap-12 items-center">
        {/* Product Image */}
        <div className="relative h-96 w-full md:w-1/2 rounded-xl overflow-hidden bg-white border border-[#EDE5DC] shadow-sm">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-4"
          />
        </div>

        {/* Product Info */}
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-4xl font-bold text-[#444444]">{product.name}</h1>

          {product.description && (
            <p className="text-base text-[#6B5E55]">{product.description}</p>
          )}

          <p className="text-2xl font-semibold text-[#3D3D3D]">
            ₹{(product.price / 100).toFixed(2)}
          </p>

          {product.stock > 0 ? (
            <div className="flex items-center gap-4 pt-2">
              <Button
                variant="outline"
                className="rounded-full border-[#D2BAA8] text-[#3D3D3D] hover:bg-[#F1E7DF]"
                onClick={() => removeItem(product.id)}
              >
                –
              </Button>
              <span className="text-lg font-medium">{quantity}</span>
              <Button
                variant="outline"
                className="rounded-full border-[#D2BAA8] text-[#3D3D3D] hover:bg-[#F1E7DF]"
                onClick={onAddItem}
              >
                +
              </Button>
            </div>
          ) : (
            <p className="text-red-600 font-medium mt-4">Out of Stock</p>
          )}
        </div>
      </div>
    </div>
  );
};
