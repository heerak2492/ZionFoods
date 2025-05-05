"use client";

import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/logo";
import HeroSection from "@/components/hero-section";
import CartIcon from "@/components/cart-icon";
import CustomerTestimonials from "@/components/customer-testimonials";
import OurStory from "@/components/our-story";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        <header className="flex items-center justify-between mb-8">
          <Link href="/">
            <div className="flex items-center gap-2">
              <Logo />
              <h1 className="text-2xl md:text-3xl font-bold text-orange-800">
                ZION FOODS
              </h1>
            </div>
          </Link>
          <CartIcon />
        </header>

        <Suspense fallback={<div>Loading...</div>}>
          <HeroSection />
        </Suspense>

        <section className="my-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-orange-800">
            Our Specialties
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105">
              <div className="relative h-64">
                <Image
                  src="/pickelsAssorted.jpg?height=400&width=600"
                  alt="Delicious Pickles"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-orange-700 mb-2">
                  Authentic Pickles
                </h3>
                <p className="text-gray-700 mb-4">
                  Handcrafted with love, our pickles bring the perfect blend of
                  spice and tang to elevate your meals.
                </p>
                <Link href="/pickles">
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                    Explore Pickles
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105">
              <div className="relative h-64">
                <Image
                  src="/vadiyaluAssorted.png?height=400&width=600"
                  alt="Crispy Vadiyalu"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-orange-700 mb-2">
                  Crispy Vadiyalu
                </h3>
                <p className="text-gray-700 mb-4">
                  Crunchy, flavorful, and irresistible. Our vadiyalu are the
                  perfect accompaniment to any traditional meal.
                </p>
                <Link href="/vadiyalu">
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                    Explore Vadiyalu
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <OurStory />

        <section className="my-16 bg-orange-100 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-orange-800 mb-4">
              Why Choose ZION FOODS?
            </h2>
            <p className="text-lg text-gray-700">
              We bring authentic flavors straight from our kitchen to your
              table.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md transform transition-all duration-300 hover:scale-105">
              <div className="text-orange-600 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-10 w-10 mx-auto"
                >
                  <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
                  <path d="M8.5 8.5v.01" />
                  <path d="M16 12v.01" />
                  <path d="M12 16v.01" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-orange-700 mb-2">
                Authentic Recipes
              </h3>
              <p className="text-gray-600">
                Traditional recipes passed down through generations for
                authentic taste.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md transform transition-all duration-300 hover:scale-105">
              <div className="text-orange-600 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-10 w-10 mx-auto"
                >
                  <path d="M9.5 13.5 11 15l4.5-4.5" />
                  <path d="M5.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                  <path d="M18.5 11a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                  <path d="M5.5 15.5v-1a2 2 0 0 1 2-2h6.5" />
                  <path d="M18.5 6v1a2 2 0 0 1-2 2H8" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-orange-700 mb-2">
                Quality Ingredients
              </h3>
              <p className="text-gray-600">
                We use only the freshest, highest quality ingredients in all our
                products.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md transform transition-all duration-300 hover:scale-105">
              <div className="text-orange-600 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-10 w-10 mx-auto"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-orange-700 mb-2">
                Preservative Free
              </h3>
              <p className="text-gray-600">
                No artificial preservatives, just natural goodness in every
                bite.
              </p>
            </div>
          </div>
        </section>

        <CustomerTestimonials />

        <section className="my-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-orange-800">
            Customer Favorites
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Our most loved products that keep customers coming back for more!
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                id: "mango-pickle",
                name: "Mango Pickle",
                type: "pickle",
                price: 120,
              },
              {
                id: "garlic-pickle",
                name: "Garlic Pickle",
                type: "pickle",
                price: 150,
              },
              {
                id: "urad-dal-vadiyalu",
                name: "Urad Dal Vadiyalu",
                type: "vadiyalu",
                price: 180,
              },
              {
                id: "chilli-vadiyalu",
                name: "Chilli Vadiyalu",
                type: "vadiyalu",
                price: 160,
              },
            ].map((product, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105"
              >
                <div className="relative h-48">
                  <Image
                    src="/placeholder.svg?height=300&width=400"
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-orange-700">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500 capitalize">
                    {product.type}
                  </p>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-lg font-bold">
                      ₹{product.price}/100g
                    </span>
                    <div className="flex gap-2">
                      <Link href={`/${product.type}s`}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-orange-600 border-orange-600 hover:bg-orange-50"
                        >
                          View
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        className="bg-orange-600 hover:bg-orange-700"
                        onClick={() => {
                          // This will be handled by client-side JavaScript
                          const event = new CustomEvent(
                            "add-to-cart-favorite",
                            {
                              detail: {
                                id: product.id,
                                name: product.name,
                                price: product.price,
                                type: product.type,
                              },
                            }
                          );
                          document.dispatchEvent(event);
                        }}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <footer className="bg-orange-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Logo white />
              <h2 className="text-xl font-bold">ZION FOODS</h2>
            </div>
            <div className="text-center md:text-right">
              <p className="mb-2">
                Contact us for delicious homemade pickles and vadiyalu
              </p>
              <p className="font-bold">WhatsApp: +91 83282 60091</p>
            </div>
          </div>
          <div className="mt-6 text-center text-sm text-orange-200">
            <p>© {new Date().getFullYear()} ZION FOODS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
