"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function CartIcon() {
  const [cartCount, setCartCount] = useState(0)
  const [isAdded, setIsAdded] = useState(false)

  useEffect(() => {
    // Initialize cart count
    updateCartCount()

    // Set up event listener for cart updates
    const handleStorageChange = () => {
      updateCartCount()
      setIsAdded(true)
      setTimeout(() => setIsAdded(false), 1000)
    }

    // Listen for custom events for cart updates
    document.addEventListener("cart-updated", handleStorageChange)

    // Listen for custom events for adding favorites to cart
    document.addEventListener("add-to-cart-favorite", handleAddToCartFavorite)

    return () => {
      document.removeEventListener("cart-updated", handleStorageChange)
      document.removeEventListener("add-to-cart-favorite", handleAddToCartFavorite)
    }
  }, [])

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("zionFoodsCart") || "[]")
    setCartCount(cart.length)
  }

  const handleAddToCartFavorite = (event: any) => {
    const product = event.detail

    // Default weight is 100g
    const weight = 100
    const totalPrice = (product.price * weight) / 100
    const quantity = product.quantity || 1

    // Get existing cart
    const cart = JSON.parse(localStorage.getItem("zionFoodsCart") || "[]")

    // Check if product already exists in cart with 100g weight
    const existingProductIndex = cart.findIndex((item: any) => item.id === product.id && item.weight === weight)

    if (existingProductIndex >= 0) {
      // Update quantity if product already exists
      cart[existingProductIndex].quantity += quantity
    } else {
      // Add new product to cart
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        weight: weight,
        quantity: quantity,
        totalPrice,
        type: product.type,
      })
    }

    // Save cart to localStorage
    localStorage.setItem("zionFoodsCart", JSON.stringify(cart))

    // Update cart count
    updateCartCount()

    // Animate the cart icon
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 1000)

    // Dispatch event to notify other components
    document.dispatchEvent(new Event("cart-updated"))

    // Show toast notification if available
    if (window.showToast) {
      window.showToast({
        title: "Added to cart!",
        description: `${product.name} (${weight}g) × ${quantity} has been added to your cart.`,
        duration: 3000,
      })
    }
  }

  return (
    <Link href="/cart">
      <Button variant="ghost" className="relative flex items-center gap-2 px-4 py-2 h-auto text-base">
        <motion.div animate={isAdded ? { scale: [1, 1.2, 1] } : {}} transition={{ duration: 0.5 }}>
          <ShoppingCart className="h-6 w-6" />
        </motion.div>
        <span className="font-medium hidden sm:inline">Cart</span>
        <AnimatePresence>
          {cartCount > 0 && (
            <motion.span
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="absolute -top-2 -right-2 sm:right-0 bg-red-500 text-white rounded-full min-w-5 h-5 flex items-center justify-center text-xs font-bold px-1 shadow-md"
            >
              {cartCount}
            </motion.span>
          )}
        </AnimatePresence>
      </Button>
    </Link>
  )
}
