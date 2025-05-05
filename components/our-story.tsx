"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function OurStory() {
  return (
    <section className="my-16">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-orange-800 mb-4">
          Our Story
        </h2>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto">
          From our family kitchen to your dining table - the journey of ZION
          FOODS
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="relative h-[550px] rounded-2xl overflow-hidden">
          <Image
            src="/founderPicCrop.jpeg?height=600&width=800"
            alt="ZION FOODS Family"
            fill
            className="object-cover"
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-orange-700">
            A Tradition of Taste
          </h3>
          <p className="text-gray-700">
            ZION FOODS began as a small family venture in 2010, born from our
            passion for preserving traditional recipes that have been passed
            down through generations. What started as sharing our homemade
            pickles and vadiyalu with friends and neighbors quickly grew into
            something much bigger as word spread about our authentic flavors.
          </p>
          <p className="text-gray-700">
            Our founder, Mrs. Kala, learned these recipes from her mother,
            who was known in her village for making the most delicious pickles.
            Using time-honored techniques and only the freshest ingredients,
            we've stayed true to those original recipes while carefully scaling
            our production to meet growing demand.
          </p>
          <p className="text-gray-700">
            Today, ZION FOODS continues to be a family-run business dedicated to
            bringing the authentic taste of traditional Indian pickles and
            vadiyalu to homes across the country. Every jar is still prepared
            with the same love and attention to detail as when we first began,
            ensuring that you experience the true taste of tradition with every
            bite.
          </p>

          <div className="pt-4">
            <motion.div
              className="text-orange-800 font-bold text-xl italic"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              "Food is not just about sustenance; it's about preserving culture,
              creating memories, and bringing people together."
            </motion.div>
            <p className="text-right text-orange-600 mt-2">
              - Mrs. Kala, Founder
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
