"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ChevronLeft, Trash2, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import CartIcon from "@/components/cart-icon"

interface CartItem {
  id: string
  name: string
  price: number
  weight: number
  quantity: number
  totalPrice: number
  type: string
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [totalAmount, setTotalAmount] = useState(0)
  const { toast } = useToast()

  useEffect(() => {
    // Load cart from localStorage
    const cart = JSON.parse(localStorage.getItem("zionFoodsCart") || "[]")
    setCartItems(cart)

    // Calculate total amount
    const total = cart.reduce((sum: number, item: CartItem) => {
      return sum + (item.price * item.weight * item.quantity) / 100
    }, 0)

    setTotalAmount(total)

    // Set up event listener for cart updates
    const handleStorageChange = () => {
      const updatedCart = JSON.parse(localStorage.getItem("zionFoodsCart") || "[]")
      setCartItems(updatedCart)

      const updatedTotal = updatedCart.reduce((sum: number, item: CartItem) => {
        return sum + (item.price * item.weight * item.quantity) / 100
      }, 0)

      setTotalAmount(updatedTotal)
    }

    document.addEventListener("cart-updated", handleStorageChange)

    return () => {
      document.removeEventListener("cart-updated", handleStorageChange)
    }
  }, [])

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
    const newCart = [...cartItems]
    newCart.splice(index, 1)
    setCartItems(newCart)

    // Save to localStorage
    localStorage.setItem("zionFoodsCart", JSON.stringify(newCart))

    // Recalculate total
    const total = newCart.reduce((sum, item) => {
      return sum + (item.price * item.weight * item.quantity) / 100
    }, 0)

    setTotalAmount(total)

    // Dispatch event to notify other components - do this only once
    document.dispatchEvent(new Event("cart-updated"))

    toast({
      title: "Item removed",
      description: "The item has been removed from your cart.",
      duration: 3000,
    })
  }

  const updateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return

    const newCart = [...cartItems]
    newCart[index].quantity = newQuantity
    setCartItems(newCart)

    // Save to localStorage
    localStorage.setItem("zionFoodsCart", JSON.stringify(newCart))

    // Recalculate total
    const total = newCart.reduce((sum, item) => {
      return sum + (item.price * item.weight * item.quantity) / 100
    }, 0)

    setTotalAmount(total)

    // Dispatch event to notify other components - do this only once
    document.dispatchEvent(new Event("cart-updated"))
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

    // Create WhatsApp message
    let message = "Hello ZION FOODS, I would like to place an order for:\n\n"

    cartItems.forEach((item) => {
      message += `${item.name} - ${item.weight}g x ${item.quantity} = ₹${(item.price * item.weight * item.quantity) / 100}\n`
    })

    message += `\nTotal Amount: ₹${totalAmount.toFixed(2)}`

    // Encode message for WhatsApp URL
    const encodedMessage = encodeURIComponent(message)

    // Open WhatsApp with the message
    window.open(`https://wa.me/918328260091?text=${encodedMessage}`, "_blank")
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
              <Button variant="ghost" size="sm" className="mr-4">
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
            <p className="text-gray-500 mb-8">Looks like you haven't added any items to your cart yet.</p>
            <Link href="/">
              <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                Continue Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div className="lg:col-span-2" variants={containerVariants} initial="hidden" animate="visible">
              {cartItems.map((item, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Card className="mb-4 overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
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
                            ₹{item.price}/100g × {item.weight}g
                          </p>
                        </div>

                        <div className="flex items-center gap-2 mt-2 sm:mt-0">
                          <Button variant="outline" size="sm" onClick={() => updateQuantity(index, item.quantity - 1)}>
                            -
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button variant="outline" size="sm" onClick={() => updateQuantity(index, item.quantity + 1)}>
                            +
                          </Button>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <div className="text-lg font-bold">
                            ₹{((item.price * item.weight * item.quantity) / 100).toFixed(2)}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-0 h-8 w-8"
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
                          {item.name} ({item.weight}g) × {item.quantity}
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

                  <Button
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-lg py-6"
                    onClick={placeOrder}
                  >
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
