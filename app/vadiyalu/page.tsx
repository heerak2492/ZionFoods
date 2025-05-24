"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import CartIcon from "@/components/cart-icon"
import ProductQuantityControl from "@/components/product-quantity-control"
import SearchBar from "@/components/search-bar"

// Product data - in a real app, this would come from an API or database
const vadiyaluProducts = [
  {
    id: "perugu-mirapakayalu",
    name: "Perugu Mirapakayalu",
    description: "Sun-dried chillies soaked in tangy buttermilk, crispy and bold in flavor.",
    tagline: "Crispy, Tangy, Totally Addictive!",
    price: 180,
    image: "/placeholder.svg?height=400&width=600",
    type: "vadiyalu",
  },
  {
    id: "pindi-vadiyalu",
    name: "Pindi Vadiyalu",
    description: "Crispy vadiyalu made with fermented rice flour and light spices.",
    tagline: "Feather-Light Crunch, Packed with Tradition!",
    price: 160,
    image: "/placeholder.svg?height=400&width=600",
    type: "vadiyalu",
  },
  {
    id: "minapa-vadiyalu",
    name: "Minapa Vadiyalu",
    description: "Spicy urad dal vadiyalu with green chilies and bold flavor.",
    tagline: "Bold Heat in Every Bite!",
    price: 170,
    image: "/placeholder.svg?height=400&width=600",
    type: "vadiyalu",
  },
  {
    id: "kurkure-vadiyalu",
    name: "Kurkure Vadiyalu",
    description: "Crispy rice flour vadiyalu with garlic, spices, and a hint of heat.",
    tagline: "Garlic-Spiced Goodness You Can’t Resist!",
    price: 190,
    image: "/placeholder.svg?height=400&width=600",
    type: "vadiyalu",
  },
  {
    id: "pesara-vadiyalu",
    name: "Pesara Vadiyalu",
    description: "Crunchy moong dal vadiyalu, high in protein and full of flavor.",
    tagline: "Wholesome Crunch, Guilt-Free Pleasure!",
    price: 200,
    image: "/placeholder.svg?height=400&width=600",
    type: "vadiyalu",
  },
  {
    id: "gummadi-vadiyalu",
    name: "Gummadi Vadiyalu",
    description: "Pumpkin and coconut-based vadiyalu with a hint of natural sweetness.",
    tagline: "Sweet Meets Savory in Every Crunch!",
    price: 210,
    image: "/placeholder.svg?height=400&width=600",
    type: "vadiyalu",
  }
]


// Weight options in grams with display labels
const weightOptions = [
  { value: "100", label: "100g" },
  { value: "250", label: "250g" },
  { value: "500", label: "500g" },
  { value: "1000", label: "1kg" },
  { value: "2000", label: "2kg" },
  { value: "5000", label: "5kg" },
  { value: "10000", label: "10kg" },
]

export default function VadiyaluPage() {
  const [selectedWeights, setSelectedWeights] = useState<Record<string, string>>({})
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  // Initialize selected weights from localStorage if available
  useEffect(() => {
    const savedWeights: Record<string, string> = {}

    vadiyaluProducts.forEach((product) => {
      const savedWeight = localStorage.getItem(`weight_${product.id}`)
      if (savedWeight) {
        savedWeights[product.id] = savedWeight
      } else {
        savedWeights[product.id] = "100" // Default to 100g
      }
    })

    setSelectedWeights(savedWeights)

    // Initialize cart count
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

  // Save selected weights to localStorage when they change
  useEffect(() => {
    Object.entries(selectedWeights).forEach(([productId, weight]) => {
      localStorage.setItem(`weight_${productId}`, weight)
    })
  }, [selectedWeights])

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("zionFoodsCart") || "[]")
    const cartCountElement = document.getElementById("cart-count")
    if (cartCountElement) {
      cartCountElement.textContent = cart.length.toString()
      cartCountElement.style.display = cart.length > 0 ? "flex" : "none"
    }
  }

  const handleWeightChange = (productId: string, weight: string) => {
    // Update the selected weight
    setSelectedWeights((prev) => ({
      ...prev,
      [productId]: weight,
    }))

    // Notify about weight change
    const weightChangeEvent = new CustomEvent("weight-changed", {
      detail: { productId, weight },
    })
    document.dispatchEvent(weightChangeEvent)
  }

  const getWeightLabel = (weightInGrams: string) => {
    const option = weightOptions.find((opt) => opt.value === weightInGrams)
    return option ? option.label : weightInGrams + "g"
  }

  const addToCart = (product: any, quantity: number) => {
    const weight = selectedWeights[product.id] || "100"
    const weightInGrams = Number.parseInt(weight)
    const weightLabel = getWeightLabel(weight)
    const pricePerUnit = product.price
    const totalPrice = (pricePerUnit * weightInGrams) / 100

    // Get existing cart
    const cart = JSON.parse(localStorage.getItem("zionFoodsCart") || "[]")

    // Create a unique ID for this product+weight combination
    const itemId = `${product.id}_${weight}`

    // Check if product with this specific weight already exists in cart
    const existingProductIndex = cart.findIndex((item: any) => item.itemId === itemId)

    if (existingProductIndex >= 0) {
      // Update quantity if product already exists
      // If quantity is negative, we're removing from cart
      const newQuantity = cart[existingProductIndex].quantity + quantity

      if (newQuantity <= 0) {
        // Remove item if quantity becomes zero or negative
        cart.splice(existingProductIndex, 1)

        // Dispatch event to reset the specific product quantity control
        const itemRemovedEvent = new CustomEvent("item-removed", {
          detail: { itemId },
        })
        document.dispatchEvent(itemRemovedEvent)
      } else {
        // Otherwise update the quantity
        cart[existingProductIndex].quantity = newQuantity
      }
    } else {
      // Only add new product to cart if quantity is positive
      if (quantity > 0) {
        cart.push({
          itemId: itemId,
          id: product.id,
          name: product.name,
          price: pricePerUnit,
          weight: weightInGrams,
          weightLabel: weightLabel,
          quantity: quantity,
          totalPrice,
          type: "vadiyalu",
        })
      }
    }

    // Save cart to localStorage
    localStorage.setItem("zionFoodsCart", JSON.stringify(cart))

    // Update cart count
    updateCartCount()

    // Dispatch event to notify other components
    document.dispatchEvent(new Event("cart-updated"))
  }

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  // Filter products based on search query
  const filteredProducts = vadiyaluProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.tagline.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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

  // Function to scroll to a product by ID
  useEffect(() => {
    // If there's a search query and filtered products, scroll to the first matching product
    if (searchQuery && filteredProducts.length > 0) {
      const firstMatchingProduct = filteredProducts[0]
      const productElement = document.getElementById(`product-${firstMatchingProduct.id}`)
      if (productElement) {
        // Add a small delay to ensure the DOM has updated
        setTimeout(() => {
          productElement.scrollIntoView({ behavior: "smooth", block: "center" })
        }, 100)
      }
    }
  }, [searchQuery, filteredProducts])

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
            <h1 className="text-3xl md:text-4xl font-bold text-orange-800">Crispy Vadiyalu</h1>
          </div>
          <CartIcon />
        </div>

        <div className="mb-8 bg-orange-100 p-6 rounded-xl">
          <h2 className="text-2xl font-bold text-orange-800 mb-2">The Vadiyalu Tradition</h2>
          <p className="text-gray-700">
            Our vadiyalu are sun-dried to perfection, following age-old traditions that bring out the authentic flavors
            and perfect crunch. Made with carefully selected ingredients and traditional recipes, each bite takes you
            back to the comfort of homemade goodness.
          </p>
        </div>

        {/* <SearchBar
          placeholder="Search for vadiyalu..."
          className="mb-8"
          onSearch={handleSearch}
          products={vadiyaluProducts}
          setSearchQuery={setSearchQuery}
        /> */}

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredProducts.map((product) => (
            <motion.div key={product.id} id={`product-${product.id}`} variants={itemVariants}>
              <Card className="overflow-hidden h-full flex flex-col">
                <div className="relative h-64">
                  <Image src={`/products/${product.id}.png`} alt={product.name} fill className="object-cover" />
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

                    <ProductQuantityControl
                      productId={product.id}
                      weight={selectedWeights[product.id] || "100"}
                      onAdd={(quantity) => addToCart(product, quantity)}
                      productName={product.name}
                      weightLabel={getWeightLabel(selectedWeights[product.id] || "100")}
                    />
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
