"use client";

import Image from "next/image";

interface LogoProps {
  white?: boolean;
  onClick?: () => void;
}

export default function Logo({ white = false, onClick }: LogoProps) {
  const fillColor = white ? "#ffffff" : "#c2410c";

  return (
    // <svg
    //   width="40"
    //   height="40"
    //   viewBox="0 0 40 40"
    //   fill="none"
    //   xmlns="http://www.w3.org/2000/svg"
    //   onClick={onClick}
    //   className={onClick ? "cursor-pointer" : ""}
    // >
    //   <circle cx="20" cy="20" r="20" fill={fillColor} />
    //   <path
    //     d="M10 12H30M10 28H30M15 12V28M25 12V28"
    //     stroke={white ? "#fed7aa" : "#7c2d12"}
    //     strokeWidth="3"
    //     strokeLinecap="round"
    //   />
    //   <path d="M20 8V32" stroke={white ? "#fed7aa" : "#7c2d12"} strokeWidth="3" strokeLinecap="round" />
    //   <path d="M12 20H28" stroke={white ? "#fed7aa" : "#7c2d12"} strokeWidth="3" strokeLinecap="round" />
    // </svg>
    <div className="relative h-20 w-20">
      <Image
        src="/zionFoodLogo.jpg"
        alt="Delicious Pickles"
        fill
        className="object-cover"
      />
    </div>
  );
}
