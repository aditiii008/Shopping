"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    setLoading(false);

    if (res.ok) {
      window.dispatchEvent(new Event("session-changed")); // Refresh Navbar
      router.push("/"); // Redirect to homepage
    } else {
      alert("Signup failed. Email might already be registered.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF7F2] text-[#3D3D3D]">
      <Card className="w-full max-w-md bg-[#F7F0EA] shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Sign Up
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-[#D2BAA8] rounded-lg px-3 py-2"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-[#D2BAA8] rounded-lg px-3 py-2"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-[#D2BAA8] rounded-lg px-3 py-2"
            />
            <Button
              type="submit"
              className="w-full bg-[#B1856D] text-white hover:bg-[#a17360]"
              disabled={loading}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </Button>
          </form>
          <p className="text-sm text-center mt-4">
            Already have an account?{" "}
            <a href="/sign-in" className="text-[#B1856D] hover:underline">
              Sign In
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
