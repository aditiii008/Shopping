import { db } from "@/lib/db";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

interface ProductItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export default async function OrdersPage() {
  const session = await getSession();
  if (!session || !session.email) {
    redirect("/sign-in");
  }

  const orders = await db.order.findMany({
    where: {
      customerEmail: session.email,
    },
    orderBy: { createdAt: "desc" },
  });

  if (orders.length === 0) {
    return (
      <div className="text-center mt-16">
        <p className="mb-4">You have no orders yet.</p>
        <a href="/products" className="text-[#B1856D] underline">
          Start Shopping
        </a>
      </div>
    );
  }

  const toUiProduct = (item: any): ProductItem => ({
    id: item.id || "unknown",
    name: item.name?.trim() || "Unnamed Product",
    price: item.price || 0,
    quantity: item.quantity || 1,
    imageUrl: (item.image || "/placeholder.png").trim(),
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-playfair text-3xl mb-8 text-center">My Orders</h1>
      <ul className="space-y-6 max-w-4xl mx-auto">
        {orders.map((o) => {
          let products: ProductItem[] = [];
          try {
            const parsed =
              typeof o.products === "string"
                ? JSON.parse(o.products)
                : o.products;
            products = Array.isArray(parsed) ? parsed.map(toUiProduct) : [];
          } catch (err) {
            console.error("Failed to parse products:", err);
            products = [];
          }

          return (
            <li
              key={o.id}
              className="border border-[#D2BAA8] rounded-lg p-6 bg-[#FFF7F2] grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden"
            >
              <div className="space-y-2">
                <p className="font-semibold">Order ID: {o.id}</p>

                <div className="flex items-center gap-2">
                  <p>Status: {o.status}</p>
                  {o.status === "SHIPPED" && o.trackingUrl && (
                    <a
                      href={o.trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 inline-block px-3 py-1 bg-[#B1856D] text-white text-xs rounded hover:bg-[#9d6d54] transition"
                    >
                      Track Your Order
                    </a>
                  )}
                </div>

                <p>Total: ₹{(o.total / 100).toFixed(2)}</p>

                {o.customerAddress &&
                  (() => {
                    let addr: any = o.customerAddress;
                    try {
                      if (typeof o.customerAddress === "string") {
                        addr = JSON.parse(o.customerAddress);
                      }
                    } catch {
                      return (
                        <p className="text-sm break-words whitespace-pre-wrap leading-relaxed">
                          {o.customerAddress}
                        </p>
                      );
                    }

                    return (
                      <div className="text-sm break-words whitespace-pre-wrap leading-relaxed">
                        {addr.fullName && <p>{addr.fullName}</p>}
                        {addr.street && <p>{addr.street}</p>}
                        <p>
                          {addr.city && addr.city}, {addr.state && addr.state}{" "}
                          {addr.postalCode && addr.postalCode}
                        </p>
                        {addr.country && <p>{addr.country}</p>}
                        {addr.phone && <p>{addr.phone}</p>}
                      </div>
                    );
                  })()}

                <p className="text-xs text-gray-600">
                  Placed on {new Date(o.createdAt).toLocaleString()}
                </p>

                {products.length > 0 && (
                  <div className="space-y-4 mt-4">
                    {products.map((item) => (
                      <div
                        key={item.id}
                        className="border-b border-[#D2BAA8] pb-3"
                      >
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-700">
                          Qty: {item.quantity}
                        </p>
                        <p className="font-semibold text-[#B1856D]">
                          ₹{((item.price * item.quantity) / 100).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {products[0] && (
                <div className="flex justify-center items-center">
                  <Image
                    src={(products[0].imageUrl || "/placeholder.png").trim()}
                    alt={products[0].name}
                    width={300}
                    height={300}
                    sizes="(max-width: 768px) 100vw, 300px"
                    className="rounded-lg shadow-md object-cover max-h-[300px]"
                  />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
