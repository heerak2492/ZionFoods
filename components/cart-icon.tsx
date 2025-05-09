"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

export default function CartIcon() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Initialize cart count
    updateCartCount();

    // Set up event listener for cart updates
    const handleStorageChange = () => {
      updateCartCount();
    };

    // Listen for custom events for cart updates
    document.addEventListener("cart-updated", handleStorageChange);

    // Listen for custom events for adding favorites to cart
    document.addEventListener("add-to-cart-favorite", handleAddToCartFavorite);

    return () => {
      document.removeEventListener("cart-updated", handleStorageChange);
      document.removeEventListener(
        "add-to-cart-favorite",
        handleAddToCartFavorite
      );
    };
  }, []);

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("zionFoodsCart") || "[]");
    setCartCount(cart.length);
    // Remove this line that's causing the infinite loop
    // document.dispatchEvent(new Event("cart-updated"))
  };

  const handleAddToCartFavorite = (event: any) => {
    const product = event.detail;

    // Default weight is 100g
    const weight = 100;
    const totalPrice = (product.price * weight) / 100;

    // Get existing cart
    const cart = JSON.parse(localStorage.getItem("zionFoodsCart") || "[]");

    // Check if product already exists in cart with 100g weight
    const existingProductIndex = cart.findIndex(
      (item: any) => item.id === product.id && item.weight === weight
    );

    if (existingProductIndex >= 0) {
      // Update quantity if product already exists
      cart[existingProductIndex].quantity += 1;
    } else {
      // Add new product to cart
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        weight: weight,
        quantity: 1,
        totalPrice,
        type: product.type,
      });
    }

    // Save cart to localStorage
    localStorage.setItem("zionFoodsCart", JSON.stringify(cart));

    // Update cart count
    updateCartCount();

    // Dispatch event to notify other components
    document.dispatchEvent(new Event("cart-updated"));

    // Show toast notification if available
    if (window.showToast) {
      window.showToast({
        title: "Added to cart!",
        description: `${product.name} (${weight}g) has been added to your cart.`,
        duration: 3000,
      });
    }
  };

  return (
    <Link href="/cart">
      <Button variant="ghost" className="relative h-50 w-50">
        <span className="sr-onlyn c-black">Cart</span>
        <ShoppingCart />
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-50 h-50 flex items-center justify-center text-xs">
            {cartCount}
          </span>
        )}
      </Button>
    </Link>
  );
}
