"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ChevronLeft, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import CartIcon from "@/components/cart-icon"

// Product data - in a real app, this would come from an API or database
const pickleProducts = [
  {
    id: "mango-pickle",
    name: "Mango Pickle",
    description: "A tangy, spicy delight that brings the authentic taste of summer mangoes to your table.",
    tagline: "The King of Pickles - A Royal Treat for Your Taste Buds!",
    price: 120, // price per 100g
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: "lemon-pickle",
    name: "Lemon Pickle",
    description: "Zesty, tangy lemon pickle made with the freshest citrus and aromatic spices.",
    tagline: "Sunshine in a Jar - Brighten Every Meal!",
    price: 110,
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: "garlic-pickle",
    name: "Garlic Pickle",
    description: "Bold, pungent garlic pickle that adds a kick of flavor to any dish.",
    tagline: "Bold Flavor, Unforgettable Taste - The Garlic Lover's Dream!",
    price: 150,
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: "ginger-pickle",
    name: "Ginger Pickle",
    description: "Spicy, warming ginger pickle that adds zing to your meals and aids digestion.",
    tagline: "The Spice of Life - Heat Up Your Meals!",
    price: 140,
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: "mixed-vegetable-pickle",
    name: "Mixed Vegetable Pickle",
    description: "A colorful medley of vegetables in a perfectly balanced spice blend.",
    tagline: "A Symphony of Flavors - Every Bite a New Adventure!",
    price: 130,
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: "tomato-pickle",
    name: "Tomato Pickle",
    description: "Sweet and tangy tomato pickle that complements rice, roti, and more.",
    tagline: "Sweet, Tangy, Irresistible - The Perfect Companion!",
    price: 100,
    image: "/placeholder.svg?height=400&width=600",
  },
]

// Weight options in grams
const weightOptions = [
  { value: "100", label: "100g" },
  { value: "250", label: "250g" },
  { value: "500", label: "500g" },
  { value: "1000", label: "1kg" },
  { value: "2000", label: "2kg" },
  { value: "5000", label: "5kg" },
  { value: "10000", label: "10kg" },
]

export default function PicklesPage() {
  const [selectedWeights, setSelectedWeights] = useState<Record<string, string>>({})
  const { toast } = useToast()

  // Initialize cart from localStorage
  useEffect(() => {
    updateCartCount()

    // Set up event listener for cart updates
    const handleStorageChange = () => {
      updateCartCount()
    }

    document.addEventListener("cart-updated", handleStorageChange)

    return () => {
      document.removeEventListener("cart-updated", handleStorageChange)
    }
  }, [])

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("zionFoodsCart") || "[]")
    const cartCountElement = document.getElementById("cart-count")
    if (cartCountElement) {
      cartCountElement.textContent = cart.length.toString()
      cartCountElement.style.display = cart.length > 0 ? "flex" : "none"
    }

    // Remove this line that's causing the infinite loop
    // document.dispatchEvent(new Event("cart-updated"))
  }

  const handleWeightChange = (productId: string, weight: string) => {
    setSelectedWeights((prev) => ({
      ...prev,
      [productId]: weight,
    }))
  }

  const addToCart = (product: any) => {
    const weight = selectedWeights[product.id] || "100"
    const weightInGrams = Number.parseInt(weight)
    const totalPrice = (product.price * weightInGrams) / 100

    // Get existing cart
    const cart = JSON.parse(localStorage.getItem("zionFoodsCart") || "[]")

    // Check if product already exists in cart
    const existingProductIndex = cart.findIndex((item: any) => item.id === product.id && item.weight === weightInGrams)

    if (existingProductIndex >= 0) {
      // Update quantity if product already exists
      cart[existingProductIndex].quantity += 1
    } else {
      // Add new product to cart
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        weight: weightInGrams,
        quantity: 1,
        totalPrice,
        type: "pickle",
      })
    }

    // Save cart to localStorage
    localStorage.setItem("zionFoodsCart", JSON.stringify(cart))

    // Update cart count
    updateCartCount()

    // Dispatch event to notify other components - do this only once
    document.dispatchEvent(new Event("cart-updated"))

    // Show toast notification
    toast({
      title: "Added to cart!",
      description: `${product.name} (${weightInGrams}g) has been added to your cart.`,
      duration: 3000,
    })

    // Make toast function available globally for other components
    window.showToast = toast
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
            <h1 className="text-3xl md:text-4xl font-bold text-orange-800">Authentic Pickles</h1>
          </div>
          <CartIcon />
        </div>

        <div className="mb-8 bg-orange-100 p-6 rounded-xl">
          <h2 className="text-2xl font-bold text-orange-800 mb-2">Our Pickle Promise</h2>
          <p className="text-gray-700">
            Every jar of our pickle is handcrafted with love using traditional recipes passed down through generations.
            We use only the freshest ingredients, sun-dried spices, and cold-pressed oils to create authentic flavors
            that bring joy to your dining table.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {pickleProducts.map((product) => (
            <motion.div key={product.id} variants={itemVariants}>
              <Card className="overflow-hidden h-full flex flex-col">
                <div className="relative h-64">
                  <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                </div>
                <CardContent className="p-6 flex-grow flex flex-col">
                  <h3 className="text-xl font-bold text-orange-700 mb-1">{product.name}</h3>
                  <p className="text-sm italic text-orange-600 mb-3">"{product.tagline}"</p>
                  <p className="text-gray-600 mb-4 flex-grow">{product.description}</p>

                  <div className="mt-auto">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-lg font-bold">₹{product.price}/100g</div>
                      <Select
                        value={selectedWeights[product.id] || "100"}
                        onValueChange={(value) => handleWeightChange(product.id, value)}
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Weight" />
                        </SelectTrigger>
                        <SelectContent>
                          {weightOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                      onClick={() => addToCart(product)}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
