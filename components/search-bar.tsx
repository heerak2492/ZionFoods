"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Search } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"

interface SearchProduct {
  id: string;
  name: string;
  type: string;
  image?: string;
}

// Update the SearchBarProps interface to make products optional with a default value
interface SearchBarProps {
  placeholder?: string;
  className?: string;
  onSearch?: (query: string) => void;
  products?: SearchProduct[];
  setSearchQuery?: (query: string) => void;
}

// Update the function signature to provide a default empty array for products
export default function SearchBar({ 
  placeholder = "Search...", 
  className = "", 
  onSearch, 
  products = [], 
  setSearchQuery 
}: SearchBarProps) {
  const [searchQuery, setSearchQueryState] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [filteredProducts, setFilteredProducts] = useState<SearchProduct[]>([])
  const searchRef = useRef<HTMLDivElement>(null)

  // Load search history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("zionFoodsSearchHistory")
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory))
    }
  }, [])

  // Handle clicks outside the search component to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Update suggestions and filtered products when search query changes
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSuggestions([])
      setFilteredProducts([])
      return
    }

    // Filter products based on search query
    const matchingProducts = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.type.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    setFilteredProducts(matchingProducts)

    // Generate suggestions from search history and product names
    const querySuggestions = searchHistory.filter((item) => item.toLowerCase().includes(searchQuery.toLowerCase()))

    // Add product names that aren't already in suggestions
    const productNameSuggestions = matchingProducts
      .map((product) => product.name)
      .filter((name) => !querySuggestions.some((suggestion) => suggestion.toLowerCase() === name.toLowerCase()))

    // Combine and limit suggestions
    const combinedSuggestions = [...querySuggestions, ...productNameSuggestions].slice(0, 5)
    setSuggestions(combinedSuggestions)
  }, [searchQuery, searchHistory, products])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQueryState(query)
    if (setSearchQuery) {
      setSearchQuery(query)
    }
    setShowSuggestions(true)
    if (onSearch) {
      onSearch(query)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQueryState(suggestion)
    if (setSearchQuery) {
      setSearchQuery(suggestion)
    }
    setShowSuggestions(false)

    // Add to search history if not already present
    if (!searchHistory.includes(suggestion)) {
      const newHistory = [suggestion, ...searchHistory].slice(0, 10) // Keep only 10 most recent searches
      setSearchHistory(newHistory)
      localStorage.setItem("zionFoodsSearchHistory", JSON.stringify(newHistory))
    }

    if (onSearch) {
      onSearch(suggestion)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (searchQuery.trim() !== "") {
      // Add to search history if not already present
      if (!searchHistory.includes(searchQuery)) {
        const newHistory = [searchQuery, ...searchHistory].slice(0, 10) // Keep only 10 most recent searches
        setSearchHistory(newHistory)
        localStorage.setItem("zionFoodsSearchHistory", JSON.stringify(newHistory))
      }

      setShowSuggestions(false)
      if (onSearch) {
        onSearch(searchQuery)
      }
    }
  }

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder={placeholder}
            className="pl-10 py-6 text-lg bg-white border-orange-200 focus:border-orange-500 rounded-xl shadow-md"
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={() => setShowSuggestions(true)}
          />
        </div>
      </form>

      <AnimatePresence>
        {showSuggestions && (suggestions.length > 0 || filteredProducts.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 mt-2 w-full bg-white rounded-lg shadow-lg border border-orange-100 overflow-hidden"
          >
            {suggestions.length > 0 && (
              <div className="p-2">
                <h3 className="text-xs font-semibold text-gray-500 px-3 py-1">Suggestions</h3>
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="px-3 py-2 hover:bg-orange-50 cursor-pointer rounded-md flex items-center"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <Search className="h-4 w-4 text-gray-400 mr-2" />
                    <span>{suggestion}</span>
                  </div>
                ))}
              </div>
            )}

            {filteredProducts.length > 0 && (
              <div className="p-2 border-t border-orange-100">
                <h3 className="text-xs font-semibold text-gray-500 px-3 py-1">Products</h3>
                {filteredProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/${product.type}s`}
                    className="px-3 py-2 hover:bg-orange-50 cursor-pointer rounded-md flex items-center"
                    onClick={() => setShowSuggestions(false)}
                  >
                    <div className="relative w-8 h-8 rounded-full overflow-hidden mr-3">
                      <Image
                        src={product.image || "/placeholder.svg?height=50&width=50"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-xs text-gray-500 capitalize">{product.type}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
