import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <div className="relative overflow-hidden rounded-3xl">
      <div className="absolute inset-0 bg-gradient-to-r from-orange-600/90 to-red-600/80 z-10" />

      <div className="relative h-[500px]">
        <Image
          src="/zionFoodCover.jpg?height=800&width=1600"
          alt="Delicious Indian Pickles and Vadiyalu"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center p-6">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
          Authentic Homemade Flavors
        </h1>
        <p className="text-xl md:text-2xl text-orange-50 mb-8 max-w-2xl drop-shadow-md">
          Experience the rich, tangy taste of traditional pickles and the crispy
          delight of homemade vadiyalu
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/pickles">
            <Button
              size="lg"
              className="bg-white text-orange-700 hover:bg-orange-100 font-bold px-8 text-lg"
            >
              Explore Pickles
            </Button>
          </Link>
          <Link href="/vadiyalu">
            <Button
              size="lg"
              className="bg-orange-900 text-white hover:bg-orange-950 font-bold px-8 text-lg"
            >
              Explore Vadiyalu
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
