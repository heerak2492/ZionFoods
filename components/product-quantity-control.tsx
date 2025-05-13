"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Minus, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"

interface ProductQuantityControlProps {
  productId: string
  weight?: string
  onAdd: (quantity: number) => void
  buttonText?: string
  showQuantityOnAdd?: boolean
  className?: string
  productName?: string
  weightLabel?: string
  hideAddButton?: boolean
}

export default function ProductQuantityControl({
  productId,
  weight = "100",
  onAdd,
  buttonText = "Add to Cart",
  showQuantityOnAdd = true,
  className = "",
  productName = "",
  weightLabel = "",
  hideAddButton = false,
}: ProductQuantityControlProps) {
  // Create a unique key for this product+weight combination for localStorage
  const storageKey = `quantity_${productId}_${weight}`
  const controlsKey = `controls_${productId}_${weight}`
  const { toast } = useToast()

  // Initialize quantity from localStorage if available
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)
  const [showControls, setShowControls] = useState(false)

  // Check if this item exists in the cart and update UI accordingly
  useEffect(() => {
    const syncWithCart = () => {
      if (typeof window !== "undefined") {
        const cart = JSON.parse(localStorage.getItem("zionFoodsCart") || "[]")
        const itemId = `${productId}_${weight}`
        const cartItem = cart.find((item: any) => item.itemId === itemId)

        if (cartItem) {
          // If item exists in cart, update quantity and show controls
          setQuantity(cartItem.quantity)
          setShowControls(true)
          localStorage.setItem(storageKey, cartItem.quantity.toString())
          localStorage.setItem(controlsKey, "true")
        } else {
          // If item doesn't exist in cart, reset controls
          setQuantity(1)
          setShowControls(false)
          localStorage.removeItem(storageKey)
          localStorage.removeItem(controlsKey)
        }
      }
    }

    // Initial sync
    syncWithCart()

    // Listen for cart updates
    const handleCartUpdated = () => {
      syncWithCart()
    }

    // Listen for item removal
    const handleItemRemoved = (event: CustomEvent) => {
      const { itemId } = event.detail
      const thisItemId = `${productId}_${weight}`

      if (itemId === thisItemId) {
        setQuantity(1)
        setShowControls(false)
        localStorage.removeItem(storageKey)
        localStorage.removeItem(controlsKey)
      }
    }

    // Listen for cart clear
    const handleClearCart = () => {
      setQuantity(1)
      setShowControls(false)
      localStorage.removeItem(storageKey)
      localStorage.removeItem(controlsKey)
    }

    document.addEventListener("cart-updated", handleCartUpdated)
    document.addEventListener("item-removed" as any, handleItemRemoved as EventListener)
    document.addEventListener("cart-cleared", handleClearCart)

    return () => {
      document.removeEventListener("cart-updated", handleCartUpdated)
      document.removeEventListener("item-removed" as any, handleItemRemoved as EventListener)
      document.removeEventListener("cart-cleared", handleClearCart)
    }
  }, [productId, weight, storageKey, controlsKey])

  // Listen for weight change events
  useEffect(() => {
    const handleWeightChanged = (event: CustomEvent) => {
      const { productId: changedProductId } = event.detail
      if (changedProductId === productId) {
        // We don't reset here - each weight has its own state
      }
    }

    document.addEventListener("weight-changed" as any, handleWeightChanged as EventListener)

    return () => {
      document.removeEventListener("weight-changed" as any, handleWeightChanged as EventListener)
    }
  }, [productId])

  // Reset added state after animation
  useEffect(() => {
    if (isAdded) {
      const timer = setTimeout(() => {
        setIsAdded(false)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [isAdded])

  const handleAdd = () => {
    // Add the current quantity to cart
    onAdd(quantity)
    setIsAdded(true)

    if (showQuantityOnAdd) {
      setShowControls(true)
    } else {
      // Reset quantity after adding
      setQuantity(1)
    }

    // Show toast notification
    if (productName && weightLabel) {
      toast({
        title: "Added to cart!",
        description: `${productName} (${weightLabel}) × ${quantity} has been added to your cart.`,
        duration: 3000,
      })
    }
  }

  const incrementQuantity = (e: React.MouseEvent) => {
    e.stopPropagation()
    const newQuantity = quantity + 1
    setQuantity(newQuantity)

    // Add 1 to cart immediately
    onAdd(1)

    // Show toast notification
    if (productName && weightLabel) {
      toast({
        title: "Quantity increased",
        description: `Added 1 ${productName} (${weightLabel}) to your cart.`,
        duration: 2000,
      })
    }
  }

  const decrementQuantity = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (quantity > 1) {
      const newQuantity = quantity - 1
      setQuantity(newQuantity)

      // Remove 1 from cart
      onAdd(-1)

      // Show toast notification
      if (productName && weightLabel) {
        toast({
          title: "Quantity decreased",
          description: `Removed 1 ${productName} (${weightLabel}) from your cart.`,
          duration: 2000,
        })
      }
    } else {
      // If quantity would become 0, remove from cart completely
      onAdd(-1)
      setShowControls(false)
      setQuantity(1)
    }
  }

  return (
    <div className={`relative ${className}`}>
      <AnimatePresence>
        {showControls ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex items-center justify-between w-full bg-white rounded-md shadow-md overflow-hidden"
          >
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-none text-orange-600 hover:text-orange-800 hover:bg-orange-50"
              onClick={decrementQuantity}
            >
              <Minus className="h-4 w-4" />
              <span className="sr-only">Decrease quantity</span>
            </Button>

            <span className="font-medium text-gray-800">{quantity}</span>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-none text-orange-600 hover:text-orange-800 hover:bg-orange-50"
              onClick={incrementQuantity}
            >
              <Plus className="h-4 w-4" />
              <span className="sr-only">Increase quantity</span>
            </Button>

            {!hideAddButton && (
              <Button type="button" className="h-10 px-3 rounded-none gradient-btn" onClick={handleAdd}>
                {isAdded ? <Check className="h-4 w-4" /> : "Add"}
              </Button>
            )}
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full">
            <Button
              type="button"
              className={`w-full gradient-btn ${isAdded ? "bg-green-600 hover:bg-green-700" : ""}`}
              onClick={handleAdd}
            >
              {isAdded ? (
                <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="flex items-center">
                  <Check className="h-4 w-4 mr-2" />
                  Added!
                </motion.div>
              ) : (
                <motion.div className="flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  {buttonText}
                </motion.div>
              )}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
