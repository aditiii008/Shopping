"use client";

import { Card, CardContent } from "./ui/card";
import { useEffect, useState } from "react";
import Image from "next/image";
import type { UiProduct } from "@/types/product";

interface Props {
  products?: UiProduct[];
}

export const Carousel = ({ products = [] }: Props) => {
  const [current, setCurrent] = useState<number>(0);

  useEffect(() => {
    if (products.length === 0) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % products.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [products.length]);

  if (products.length === 0) return null;

  const currentProduct = products[current];

  return (
    <Card className="relative overflow-hidden rounded-2xl shadow-md border border-[#EDE5DC] bg-[#FFF7F2]">
      {currentProduct.image && (
        <div className="relative h-80 w-full">
          <Image
            src={currentProduct.image}
            alt={currentProduct.name}
            fill
            className="object-cover transition-opacity duration-500 ease-in-out rounded-t-2xl"
            priority
          />
        </div>
      )}
      <CardContent className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-white/70 backdrop-blur-sm rounded-b-2xl text-center">
        <h3 className="text-lg font-semibold text-[#3D3D3D]">
          {currentProduct.name}
        </h3>
        <p className="text-base font-medium text-[#B1856D] mt-1">
          ₹{(currentProduct.price / 100).toFixed(2)}
        </p>
      </CardContent>
    </Card>
  );
};
