"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useCart } from "hooks/useCart";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { toast } from "react-toastify";

const ShoppingCartIcon = () => {
  const userId = Cookies.get("userId");
  const { data: cartItems, isLoading, isError, error } = useCart(userId || "");

  // 🔍 عرض الأخطاء
  useEffect(() => {
    if (isError) {
      console.error("❌ Error fetching cart:", error);
      toast.error("❌ Failed to load your cart");
    }
  }, [isError, error]);

  if (isLoading || !userId) return null;

  const items = Array.isArray(cartItems) ? cartItems : [];

  // 🧮 إجمالي العناصر والسعر
 const totalItems = items.reduce((acc, item) => acc + (item.quantity || 0), 0);

const totalPrice = items.reduce(
  (acc, item) => acc + ((item.price ?? 0) * (item.quantity || 1)),
  0
);

  return (
    <div className="relative group">
      <Link
        href="/cart"
        className="relative hover:text-black text-gray-600 flex items-center"
      >
        {/* 🛒 أيقونة السلة */}
        <ShoppingCart className="w-6 h-6" />

        {/* 🔢 عدد العناصر */}
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-[#ffc400] text-white text-xs rounded-full px-[5px] py-[1px] font-bold">
            {totalItems}
          </span>
        )}
      </Link>

      {/* 💬 Tooltip / Preview */}
      <div className="absolute hidden group-hover:block bg-white shadow-lg rounded-lg p-3 w-64 top-8 right-0 z-10 border border-gray-100">
        <h4 className="text-sm font-semibold mb-2 text-gray-800">🛒 Cart Preview</h4>

        {items.length > 0 ? (
          <ul className="space-y-1 max-h-40 overflow-y-auto">
            {items.slice(0, 3).map((item) => (
              <li
                key={item.productId}
                className="flex justify-between text-xs text-gray-700"
              >
                <span className="truncate max-w-[120px]">
                  {item.name || `Product ${item.productId}`}
                </span>
                <span>
                 {item.quantity} × ${(item.price ?? 0).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-gray-500">Your cart is empty</p>
        )}

        {items.length > 0 && (
          <div className="text-xs font-semibold text-gray-800 mt-2 text-right">
            Total: ${totalPrice.toFixed(2)}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingCartIcon;
