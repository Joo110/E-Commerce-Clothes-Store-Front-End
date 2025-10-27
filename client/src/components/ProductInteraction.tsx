"use client";

import { ProductType } from "@/types";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { useAddToCart } from "hooks/useCart";
import Cookies from "js-cookie";

const ProductInteraction = ({
  product,
  selectedSize,
  selectedColor,
}: {
  product: ProductType;
  selectedSize: string;
  selectedColor: string;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [quantity, setQuantity] = useState(1);

  const userId = Cookies.get("userId");

  const addToCartMutation = useAddToCart();
const addToCart = useAddToCart();

  const handleTypeChange = (type: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(type, value);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleQuantityChange = (type: "increment" | "decrement") => {
    if (type === "increment") {
      setQuantity((prev) => prev + 1);
    } else if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

const handleAddToCart = () => {
  const userId = Cookies.get("userId");
  if (!userId) {
    toast.error("⚠️ Please log in first");
    return;
  }

  const cartItem = {
    id: 0,
    userId,
    productId: Number(product.id),
    quantity,
  };

  addToCart.mutate(cartItem, {
    onSuccess: () => {
      toast.success(`✅ Added ${quantity} item(s) to cart successfully!`);
      setQuantity(1);
    },
    onError: (err) => {
      console.error("❌ Error adding to cart:", err);
      toast.error("❌ Failed to add to cart");
    },
  });
};

  return (
    <div className="flex flex-col gap-4 mt-4 px-6">
      {/* SIZE */}
      <div className="flex flex-col gap-2 text-xs">
        <span className="text-gray-500">Size</span>
        <div className="flex items-center gap-2">
          {(Array.isArray(product.sizes)
            ? product.sizes
            : typeof product.sizes === "string"
            ? product.sizes.split(",").map((s: string) => s.trim())
            : []
          ).map((size: string) => (
            <div
              className={`cursor-pointer border-1 p-[2px] ${
                selectedSize === size ? "border-gray-600" : "border-gray-300"
              }`}
              key={size}
              onClick={() => handleTypeChange("size", size)}
            >
              <div
                className={`w-6 h-6 text-center flex items-center justify-center ${
                  selectedSize === size
                    ? "bg-black text-white"
                    : "bg-white text-black"
                }`}
              >
                {size.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* COLOR */}
      <div className="flex flex-col gap-2 text-sm">
        <span className="text-gray-500">Color</span>
        <div className="flex items-center gap-2">
          {(Array.isArray(product.colors)
            ? product.colors
            : typeof product.colors === "string"
            ? product.colors.split(",").map((c: string) => c.trim())
            : []
          ).map((color: string) => (
            <div
              className={`cursor-pointer border-1 p-[2px] ${
                selectedColor === color ? "border-gray-300" : "border-white"
              }`}
              key={color}
              onClick={() => handleTypeChange("color", color)}
            >
              <div className={`w-6 h-6`} style={{ backgroundColor: color }} />
            </div>
          ))}
        </div>
      </div>

      {/* QUANTITY */}
      <div className="flex flex-col gap-2 text-sm">
        <span className="text-gray-500">Quantity</span>
        <div className="flex items-center gap-2">
          <button
            className="cursor-pointer border-1 border-gray-300 p-1"
            onClick={() => handleQuantityChange("decrement")}
          >
            <Minus className="w-4 h-4" />
          </button>
          <span>{quantity}</span>
          <button
            className="cursor-pointer border-1 border-gray-300 p-1"
            onClick={() => handleQuantityChange("increment")}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* BUTTONS */}
      <button
        onClick={handleAddToCart}
        className="bg-gray-800 text-white px-4 py-2 rounded-md shadow-lg flex items-center justify-center gap-2 cursor-pointer text-sm font-medium"
        disabled={addToCartMutation.isPending}
      >
        <Plus className="w-4 h-4" />
        {addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
      </button>

      <button className="ring-1 ring-gray-400 shadow-lg text-gray-800 px-4 py-2 rounded-md flex items-center justify-center cursor-pointer gap-2 text-sm font-medium">
        <ShoppingCart className="w-4 h-4" />
        Buy this Item
      </button>
    </div>
  );
};

export default ProductInteraction;
