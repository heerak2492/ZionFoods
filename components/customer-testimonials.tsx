"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    location: "Hyderabad",
    rating: 5,
    text: "The mango pickle from ZION FOODS reminds me of my grandmother's recipe. It's the perfect blend of tangy and spicy flavors that takes me back to my childhood. I've tried many brands, but nothing comes close to this authentic taste!",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 2,
    name: "Rajesh Kumar",
    location: "Bangalore",
    rating: 5,
    text: "I ordered the Urad Dal Vadiyalu for a family gathering and everyone was impressed! The crispiness and flavor are unmatched. It's like having homemade vadiyalu without the effort. Will definitely order again!",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 3,
    name: "Ananya Patel",
    location: "Chennai",
    rating: 4,
    text: "The garlic pickle is absolutely divine! It has the perfect balance of flavors and the quality of ingredients is evident in every bite. My family now refuses to eat any other pickle brand!",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 4,
    name: "Vikram Singh",
    location: "Delhi",
    rating: 5,
    text: "I've been buying the chilli vadiyalu for over a year now. The consistency in quality is remarkable. Each batch is as good as the last, and the spice level is perfect for my taste. Highly recommended!",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 5,
    name: "Lakshmi Reddy",
    location: "Vizag",
    rating: 5,
    text: "The lemon pickle from ZION FOODS is a game-changer! It's tangy, spicy, and has the perfect texture. I've gifted it to several friends who now place their own orders. Quality products with authentic taste!",
    image: "/placeholder.svg?height=100&width=100",
  },
]

export default function CustomerTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }

  // Calculate visible testimonials based on screen size
  const visibleCount = 3
  const visibleTestimonials = []

  for (let i = 0; i < visibleCount; i++) {
    const index = (currentIndex + i) % testimonials.length
    visibleTestimonials.push(testimonials[index])
  }

  return (
    <section className="my-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-orange-800 mb-4">What Our Customers Say</h2>
        <p className="text-lg text-gray-700">Don't just take our word for it - hear from our satisfied customers!</p>
      </div>

      <div className="relative">
        <div className="flex justify-between absolute top-1/2 -translate-y-1/2 w-full z-10 px-4">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
            onClick={prevTestimonial}
          >
            <ChevronLeft className="h-6 w-6" />
            <span className="sr-only">Previous</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
            onClick={nextTestimonial}
          >
            <ChevronRight className="h-6 w-6" />
            <span className="sr-only">Next</span>
          </Button>
        </div>

        <div className="overflow-hidden">
          <motion.div
            className="flex gap-6 px-4"
            initial={false}
            animate={{ x: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {visibleTestimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                className="w-full md:w-1/3 flex-shrink-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden">
                        <Image
                          src={testimonial.image || "/placeholder.svg"}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-orange-800">{testimonial.name}</h3>
                        <p className="text-sm text-gray-500">{testimonial.location}</p>
                      </div>
                    </div>

                    <div className="flex mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < testimonial.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>

                    <p className="text-gray-700">{testimonial.text}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
