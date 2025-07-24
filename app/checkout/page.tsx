"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCartStore } from "@/store/cart-store";

interface Address {
  id?: string;
  fullName: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export default function CheckoutPage() {
  const { items, removeItem, addItem } = useCartStore();
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);

  const [newAddress, setNewAddress] = useState<Address>({
    fullName: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  useEffect(() => {
    if (!(window as any).Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = false;
      document.body.appendChild(script);
    }
  }, []);

  // Fetch user session
  useEffect(() => {
    async function fetchSession() {
      try {
        const res = await fetch("/api/auth/session");
        if (res.ok) {
          const data = await res.json();
          setSessionEmail(data?.email || null);
        }
      } catch (err) {
        console.error("Failed to fetch session", err);
      }
    }
    fetchSession();
  }, []);

  // Fetch addresses (if user is signed in)
  useEffect(() => {
    async function fetchAddresses() {
      try {
        const res = await fetch("/api/addresses");
        if (res.ok) {
          const data = await res.json();
          setAddresses(data);
          if (data.length > 0) setSelectedAddressId(data[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch addresses", err);
      }
    }
    fetchAddresses();
  }, []);

  const handleAddAddress = async () => {
    try {
      const res = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAddress),
      });

      if (res.ok) {
        const data = await res.json();
        setAddresses([data.address, ...addresses]);
        setSelectedAddressId(data.address.id);
        setNewAddress({
          fullName: "",
          street: "",
          city: "",
          state: "",
          postalCode: "",
          country: "",
          phone: "",
        });
      } else {
        alert("Failed to add address");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while adding the address.");
    }
  };

  const handlePayment = async () => {
    if (!selectedAddressId) {
      alert("Please select an address.");
      return;
    }

    const selectedAddress = addresses.find((a) => a.id === selectedAddressId);
    if (!selectedAddress) {
      alert("Invalid address selected.");
      return;
    }

    try {
      const res = await fetch("/api/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total }),
      });

      const order = await res.json();
      if (!order.id) {
        alert("Failed to create Razorpay order.");
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: order.amount,
        currency: order.currency,
        name: "Uncover Skincare",
        description: "Payment for products",
        order_id: order.id,
        handler: async (response: any) => {
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              total,
              items,
              customerName: selectedAddress.fullName,
              customerEmail: sessionEmail || "guest@example.com",
              customerAddress: selectedAddress,
            }),
          });

          if (verifyRes.ok) {
            window.location.href = `/success?payment_id=${response.razorpay_payment_id}`;
          } else {
            alert("Payment verification failed.");
          }
        },
        prefill: {
          name: selectedAddress.fullName,
          email: sessionEmail || "guest@example.com",
          contact: selectedAddress.phone || "9876543210",
        },
        theme: { color: "#B1856D" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Razorpay error:", err);
      alert("Something went wrong with payment.");
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-[#3D3D3D] bg-[#FFF7F2] min-h-screen">
        <h1 className="font-playfair text-3xl font-bold mb-4">
          Your Cart is Empty
        </h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-[#FFF7F2] text-[#3D3D3D] min-h-screen">
      <h1 className="font-playfair text-3xl font-bold mb-8 text-center">
        Checkout
      </h1>

      {/* Address Section */}
      <Card className="max-w-md mx-auto mb-8 bg-[#F7F0EA] shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Select Address</CardTitle>
        </CardHeader>
        <CardContent>
          {sessionEmail ? (
            <>
              {addresses.length > 0 ? (
                <div className="space-y-4 mb-6">
                  {addresses.map((addr) => (
                    <label
                      key={addr.id}
                      className="flex items-start space-x-2 border border-[#D2BAA8] p-3 rounded-lg cursor-pointer hover:bg-[#EADBD2]"
                    >
                      <input
                        type="radio"
                        checked={selectedAddressId === addr.id}
                        onChange={() => setSelectedAddressId(addr.id!)}
                      />
                      <div>
                        <p className="font-medium">{addr.fullName}</p>
                        <p className="text-sm">
                          {addr.street}, {addr.city}, {addr.state},{" "}
                          {addr.postalCode}
                        </p>
                        <p className="text-sm">{addr.country}</p>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="mb-4">No saved addresses. Please add one.</p>
              )}

              {/* Add new address form */}
              <div className="space-y-2">
                {["fullName", "street", "city", "state", "postalCode", "country", "phone"].map(
                  (field) => (
                    <input
                      key={field}
                      type="text"
                      placeholder={field.replace(/([A-Z])/g, " $1")}
                      value={(newAddress as any)[field]}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, [field]: e.target.value })
                      }
                      className="w-full border border-[#D2BAA8] rounded-lg px-3 py-2"
                    />
                  )
                )}
                <Button
                  onClick={handleAddAddress}
                  className="w-full bg-[#B1856D] text-white hover:bg-[#a17360]"
                >
                  Add Address
                </Button>
              </div>
            </>
          ) : (
            <p className="text-center text-sm">
              Please <a href="/sign-in" className="text-[#B1856D] underline">sign in</a> to add an address.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card className="max-w-md mx-auto mb-8 bg-[#F7F0EA] shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex flex-col gap-2 border-b border-[#D2BAA8] pb-2"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-center gap-4">
                    <Image
                      src={(item.imageUrl || "/placeholder.png").trim()}
                      alt={item.name}
                      width={70}
                      height={70}
                      className="rounded-md object-cover"
                    />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="font-semibold">
                        ₹{((item.price * item.quantity) / 100).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[#D2BAA8] text-[#3D3D3D] hover:bg-[#EADBD2]"
                      onClick={() => removeItem(item.id)}
                    >
                      –
                    </Button>
                    <span className="text-lg font-semibold">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[#D2BAA8] text-[#3D3D3D] hover:bg-[#EADBD2]"
                      onClick={() => addItem({ ...item, quantity: 1 })}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 border-t border-[#D2BAA8] pt-2 text-lg font-semibold">
            Total: ₹{(total / 100).toFixed(2)}
          </div>
        </CardContent>
      </Card>

      <div className="max-w-md mx-auto">
        <Button
          onClick={handlePayment}
          className="w-full bg-[#B1856D] text-white hover:bg-[#a17360]"
        >
          Proceed to Payment
        </Button>
      </div>
    </div>
  );
}
