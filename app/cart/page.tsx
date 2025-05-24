"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ChevronLeft, Trash2, ShoppingBag, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import CartIcon from "@/components/cart-icon"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface CartItem {
  itemId: string
  id: string
  name: string
  price: number
  weight: number
  weightLabel: string
  quantity: number
  totalPrice: number
  type: string
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [totalAmount, setTotalAmount] = useState(0)
  const [isOrderPlaced, setIsOrderPlaced] = useState(false)
  const { toast } = useToast()
  const [customizations, setCustomizations] = useState("")
  const [deliveryAddress, setDeliveryAddress] = useState("")

  // Load cart from localStorage and set up event listeners
  useEffect(() => {
    loadCartFromStorage()

    // Set up event listener for cart updates
    const handleStorageChange = () => {
      loadCartFromStorage()
    }

    document.addEventListener("cart-updated", handleStorageChange)

    return () => {
      document.removeEventListener("cart-updated", handleStorageChange)
    }
  }, [])

  // Load cart from localStorage and calculate total
  const loadCartFromStorage = () => {
    const cart = JSON.parse(localStorage.getItem("zionFoodsCart") || "[]")
    setCartItems(cart)

    // Calculate total amount
    const total = cart.reduce((sum: number, item: CartItem) => {
      return sum + (item.price * item.weight * item.quantity) / 100
    }, 0)

    setTotalAmount(total)
  }

  const updateCartCount = () => {
    const cartCountElement = document.getElementById("cart-count")
    if (cartCountElement) {
      cartCountElement.textContent = cartItems.length.toString()
      cartCountElement.style.display = cartItems.length > 0 ? "flex" : "none"
    }
  }

  useEffect(() => {
    updateCartCount()
  }, [cartItems])

  const removeFromCart = (index: number) => {
    const itemToRemove = cartItems[index]
    const newCart = [...cartItems]
    newCart.splice(index, 1)

    // Save to localStorage
    localStorage.setItem("zionFoodsCart", JSON.stringify(newCart))

    // Update state
    setCartItems(newCart)

    // Recalculate total
    const total = newCart.reduce((sum, item) => {
      return sum + (item.price * item.weight * item.quantity) / 100
    }, 0)

    setTotalAmount(total)

    // Dispatch event to notify other components
    document.dispatchEvent(new Event("cart-updated"))

    // Dispatch event to reset the specific product quantity control
    const itemRemovedEvent = new CustomEvent("item-removed", {
      detail: { itemId: itemToRemove.itemId },
    })
    document.dispatchEvent(itemRemovedEvent)

    toast({
      title: "Item removed",
      description: "The item has been removed from your cart.",
      duration: 3000,
    })
  }

  const clearCart = () => {
    // Clear cart state
    setCartItems([])
    setTotalAmount(0)

    // Get all localStorage keys
    const allKeys = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key) {
        allKeys.push(key)
      }
    }

    // Remove all quantity and control related items from localStorage
    allKeys.forEach((key) => {
      if (key.startsWith("quantity_") || key.startsWith("controls_") || key === "zionFoodsCart") {
        localStorage.removeItem(key)
      }
    })

    // Ensure cart is completely cleared
    localStorage.removeItem("zionFoodsCart")

    // Set empty array as fallback
    localStorage.setItem("zionFoodsCart", "[]")

    // Dispatch event to notify other components
    document.dispatchEvent(new Event("cart-updated"))

    // Dispatch event to reset all quantity controls
    const clearCartEvent = new CustomEvent("cart-cleared")
    document.dispatchEvent(clearCartEvent)

    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
      duration: 3000,
    })
  }

  const updateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 1) {
      // If quantity becomes less than 1, remove the item
      removeFromCart(index)
      return
    }

    const newCart = [...cartItems]
    newCart[index].quantity = newQuantity

    // Save to localStorage
    localStorage.setItem("zionFoodsCart", JSON.stringify(newCart))

    // Update state
    setCartItems(newCart)

    // Recalculate total
    const total = newCart.reduce((sum, item) => {
      return sum + (item.price * item.weight * item.quantity) / 100
    }, 0)

    setTotalAmount(total)

    // Dispatch event to notify other components
    document.dispatchEvent(new Event("cart-updated"))

    // Show toast notification
    const item = newCart[index]
    toast({
      title: newQuantity > cartItems[index].quantity ? "Quantity increased" : "Quantity decreased",
      description: `${item.name} (${item.weightLabel}) quantity updated to ${newQuantity}.`,
      duration: 2000,
    })
  }

  const placeOrder = () => {
    if (cartItems.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before placing an order.",
        variant: "destructive",
        duration: 3000,
      })
      return
    }

    if (!deliveryAddress.trim()) {
      toast({
        title: "Address required",
        description: "Please enter your delivery address before placing an order.",
        variant: "destructive",
        duration: 3000,
      })
      return
    }

    // Create WhatsApp message
    let message = "Hello ZION FOODS, I would like to place an order for:\n\n"

    cartItems.forEach((item) => {
      message += `${item.name} - ${item.weightLabel} × ${item.quantity} = ₹${(item.price * item.weight * item.quantity) / 100}\n`
    })

    message += `\nTotal Amount: ₹${totalAmount.toFixed(2)}\n\n`

    // Add customizations if provided
    if (customizations.trim()) {
      message += `🎨 CUSTOMIZATIONS:\n${customizations.trim()}\n\n`
    }

    // Add delivery address
    message += `📍 DELIVERY ADDRESS:\n${deliveryAddress.trim()}\n\n`

    message += "Thank you!"

    // Encode message for WhatsApp URL
    const encodedMessage = encodeURIComponent(message)

    // Set order placed flag
    setIsOrderPlaced(true)

    // Open WhatsApp with the message
    window.open(`https://wa.me/918328260091?text=${encodedMessage}`, "_blank")

    // Clear cart after order is placed
    clearCart()
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link href="/">
              <Button variant="ghost" size="sm" className="mr-4 btn-click-feedback">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-orange-800">Your Cart</h1>
          </div>
          <CartIcon />
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="h-16 w-16 mx-auto text-orange-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">
              {isOrderPlaced
                ? "Thank you for your order! We'll process it soon."
                : "Looks like you haven't added any items to your cart yet."}
            </p>
            <Link href="/">
              <Button className="gradient-btn">Continue Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div className="lg:col-span-2" variants={containerVariants} initial="hidden" animate="visible">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-orange-800">Cart Items ({cartItems.length})</h2>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-red-500 border-red-500 hover:bg-red-50">
                      <X className="h-4 w-4 mr-2" />
                      Clear Cart
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Clear your cart?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will remove all items from your cart. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={clearCart} className="bg-red-500 hover:bg-red-600">
                        Clear Cart
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              {cartItems.map((item, index) => (
                <motion.div key={item.itemId} variants={itemVariants}>
                  <Card className="mb-4 overflow-hidden">
                    <CardContent className="p-6">
                      <div className="cart-item-mobile">
                        <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                          <Image
                            src="/placeholder.svg?height=200&width=200"
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="flex-grow">
                          <h3 className="text-lg font-bold text-orange-700">{item.name}</h3>
                          <p className="text-sm text-gray-500 capitalize">{item.type}</p>
                          <p className="text-sm text-gray-700 mt-1">
                            ₹{item.price}/100g × {item.weightLabel}
                          </p>
                        </div>

                        <div className="cart-item-controls">
                          <div className="cart-item-quantity">
                            <Button
                              variant="outline"
                              size="sm"
                              className="btn-click-feedback"
                              onClick={() => updateQuantity(index, item.quantity - 1)}
                            >
                              -
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              className="btn-click-feedback"
                              onClick={() => updateQuantity(index, item.quantity + 1)}
                            >
                              +
                            </Button>
                          </div>

                          <div className="cart-item-price">
                            ₹{((item.price * item.weight * item.quantity) / 100).toFixed(2)}
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="cart-item-remove"
                            onClick={() => removeFromCart(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-orange-800 mb-4">Order Summary</h2>

                  <div className="space-y-4">
                    {cartItems.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>
                          {item.name} ({item.weightLabel}) × {item.quantity}
                        </span>
                        <span>₹{((item.price * item.weight * item.quantity) / 100).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  <div className="flex justify-between font-bold text-lg mb-6">
                    <span>Total</span>
                    <span>₹{totalAmount.toFixed(2)}</span>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <label htmlFor="customizations" className="block text-sm font-medium text-gray-700 mb-2">
                        Special Customizations (Optional)
                      </label>
                      <textarea
                        id="customizations"
                        rows={3}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                        placeholder="Tell us your preferences: spice level, extra ingredients, less salt, etc."
                        value={customizations}
                        onChange={(e) => setCustomizations(e.target.value)}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Example: "Make it extra spicy", "Less salt in mango pickle", "Add extra garlic"
                      </p>
                    </div>

                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                        Delivery Address <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="address"
                        rows={3}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                        placeholder="Enter your complete delivery address with pincode"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <Button className="w-full gradient-btn py-6 text-lg" onClick={placeOrder}>
                    Place Order via WhatsApp
                  </Button>

                  <p className="text-xs text-gray-500 text-center mt-4">
                    By placing your order, you'll be redirected to WhatsApp to confirm your purchase with ZION FOODS.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
