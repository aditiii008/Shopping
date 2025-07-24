"use client";

import { useState } from "react";
import { ProductCard } from "./product-card";
import type { UiProduct } from "@/types/product";

interface Props {
  products: UiProduct[];
}

export const ProductList = ({ products }: Props) => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredProduct = products.filter((product) => {
    const term = searchTerm.toLowerCase();
    const nameMatch = product.name.toLowerCase().includes(term);
    const descriptionMatch = product.description
      ? product.description.toLowerCase().includes(term)
      : false;

    return nameMatch || descriptionMatch;
  });

  return (
    <div>
      {/* Search Input */}
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search products..."
          className="w-full max-w-md rounded-full border border-[#EDE5DC] bg-[#FFF7F2] px-4 py-2 text-[#434343] placeholder:text-[#413a36] focus:outline-none focus:ring-2 focus:ring-[#D2BAA8]"
        />
      </div>

      {/* Product Grid */}
      <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProduct.map((product) => (
          <li key={product.id}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </div>
  );
};
