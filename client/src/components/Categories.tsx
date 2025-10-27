"use client";

import {
  Footprints,
  Glasses,
  Briefcase,
  Shirt,
  ShoppingBasket,
  Hand,
  Venus,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const categories = [
  { name: "All", icon: <ShoppingBasket className="w-4 h-4" />, slug: "all" },
  { name: "T-shirts", icon: <Shirt className="w-4 h-4" />, slug: "t-shirts" },
  { name: "Shoes", icon: <Footprints className="w-4 h-4" />, slug: "shoes" },
  { name: "Accessories", icon: <Glasses className="w-4 h-4" />, slug: "accessories" },
  { name: "Bags", icon: <Briefcase className="w-4 h-4" />, slug: "bags" },
  { name: "Dresses", icon: <Venus className="w-4 h-4" />, slug: "dresses" },
  { name: "Jackets", icon: <Shirt className="w-4 h-4" />, slug: "jackets" },
  { name: "Gloves", icon: <Hand className="w-4 h-4" />, slug: "gloves" },
];

const Categories = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const selectedCategory = searchParams.get("category");

  const handleChange = (value: string | null) => {
    const params = new URLSearchParams(searchParams);
    params.set("category", value || "all");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="w-full bg-gray-100 py-4 mb-8 text-sm">
      <div className="flex overflow-x-auto no-scrollbar gap-4 px-4 sm:px-8">
        {categories.map((category, idx) => (
          <button
            key={idx}
            onClick={() => handleChange(category.slug)}
            className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg min-w-[120px] text-sm font-medium transition-all duration-300 whitespace-nowrap
              ${
                category.slug === selectedCategory
                  ? "bg-white shadow text-black"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-200"
              }`}
          >
            {category.icon}
            <span>{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Categories;