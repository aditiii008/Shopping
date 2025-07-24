"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useCartStore } from "@/store/cart-store";
import Link from "next/link";

export const dynamic = "force-dynamic";

function SuccessContent() {
  const params = useSearchParams();
  const paymentId = params.get("payment_id");
  const orderId = params.get("order_id");
  const { clearCart } = useCartStore();

  useEffect(() => {
    if (paymentId) clearCart();
  }, [paymentId, clearCart]);

  return (
    <div className="container mx-auto px-4 py-20 text-center bg-[#FFFAF5] text-[#3D3D3D]">
      <h1 className="font-playfair text-4xl font-bold mb-4">Payment Successful 🎉</h1>
      <p className="mb-4">Your order has been placed.</p>
      {orderId && (
        <p className="text-sm mb-2">
          <span className="font-semibold">Order ID:</span> {orderId}
        </p>
      )}
      {paymentId && (
        <p className="text-sm mb-6">
          <span className="font-semibold">Payment ID:</span> {paymentId}
        </p>
      )}
      <Link
        href="/orders"
        className="inline-block bg-[#B1856D] text-white px-6 py-2 rounded-full hover:bg-[#a17360]"
      >
        View My Orders
      </Link>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="container mx-auto px-4 py-20 text-center bg-[#FFFAF5] text-[#3D3D3D]">
      <h1 className="font-playfair text-4xl font-bold mb-4">Processing...</h1>
      <p className="mb-4">Confirming your payment...</p>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SuccessContent />
    </Suspense>
  );
}