"use client";

import Cookies from "js-cookie";
import { ProductType } from "@/types";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAddToCart } from "hooks/useCart";
import { useCreateOrder } from "hooks/useOrders";

const ProductCard = ({ product }: { product: ProductType }) => {
  const router = useRouter();

  const sizeArray =
    typeof product.sizes === "string"
      ? product.sizes.split(",").map((s) => s.trim())
      : product.sizes || [];

  const colorArray =
    typeof product.colors === "string"
      ? product.colors.split(",").map((c) => c.trim())
      : product.colors || [];

  const [productTypes, setProductTypes] = useState({
    size: sizeArray[0],
    color: colorArray[0],
  });

  const [quantity, setQuantity] = useState(1);

  const addToCart = useAddToCart();
  const createOrder = useCreateOrder();

  const handleProductType = ({
    type,
    value,
  }: {
    type: "size" | "color";
    value: string;
  }) => {
    setProductTypes((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const handleIncreaseQuantity = () => setQuantity((prev) => prev + 1);
  const handleDecreaseQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = () => {
    const userId = Cookies.get("userId");
    if (!userId) {
      toast.error("⚠️ Please log in first");
      return;
    }

    const cartItem = {
      userId,
      productId: product.id ?? "",
      name: product.name,
      price: product.price,
      quantity,
      selectedSize: productTypes.size,
      selectedColor: productTypes.color,
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

  const handleCreateOrder = () => {
    const userId = Cookies.get("userId");
    if (!userId) {
      toast.error("⚠️ Please log in first");
      return;
    }

    const order = {
      id: 0,
      orderDate: new Date().toISOString(),
      status: "Pending",
      userId,
      orderItems: [
        {
          id: 0,
          productId: Number(product.id) || 0,
          quantity,
          unitPrice: product.price,
        },
      ],
      payment: {
        id: 0,
        paymentProvider: "Cash",
        transactionId: `TXN-${Date.now()}`,
        amount: product.price * quantity,
        paymentDate: new Date().toISOString(),
        isSuccessful: true,
        orderId: 0,
      },
    };

    createOrder.mutate(order, {
      onSuccess: (data: any) => {
        console.log("✅ Order Created:", data);
        toast.success("✅ Order created successfully!");
        setTimeout(() => {
          router.push(`/shipping?orderId=${data?.id || Date.now()}`);
        }, 1000);
      },
      onError: (err) => {
        console.error("❌ Failed to create order:", err);
        toast.error("❌ Failed to create order");
      },
    });
  };

  // ✅ هنا الـ return الأساسي (كان المشكلة إنك كنت حاطط } زيادة بعده)
  return (
    <div className="shadow-lg rounded-lg overflow-hidden">
      {/* 🖼️ IMAGE */}
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-[2/3]">
          <Image
            src={
              (typeof product.imageUrl === "object"
                ? product.imageUrl?.[
                    productTypes.color as keyof typeof product.imageUrl
                  ]
                : product.imageUrl) || "/placeholder.png"
            }
            alt={product.name || "Product"}
            fill
            className="object-contain"
          />
        </div>
      </Link>

      {/* 🧾 PRODUCT DETAIL */}
      <div className="flex flex-col gap-4 p-4">
        <h1 className="font-medium">{product.name}</h1>
        <p className="text-sm text-gray-500">
          {product.description || "No description available"}
        </p>

        {/* 🧩 PRODUCT TYPES */}
        <div className="flex items-center gap-4 text-xs">
          {/* SIZE */}
          <div className="flex flex-col gap-1">
            <span className="text-gray-500">Size</span>
            <select
              name="size"
              id="size"
              className="ring ring-gray-300 rounded-md px-2 py-1"
              onChange={(e) =>
                handleProductType({ type: "size", value: e.target.value })
              }
            >
              {sizeArray.map((size) => (
                <option key={size} value={size}>
                  {size.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* COLOR */}
          <div className="flex flex-col gap-1">
            <span className="text-gray-500">Color</span>
            <div className="flex items-center gap-2">
              {colorArray.map((color) => (
                <div
                  className={`cursor-pointer border ${
                    productTypes.color === color
                      ? "border-gray-400"
                      : "border-gray-200"
                  } rounded-full p-[1.2px]`}
                  key={color}
                  onClick={() =>
                    handleProductType({ type: "color", value: color })
                  }
                >
                  <div
                    className="w-[14px] h-[14px] rounded-full"
                    style={{ backgroundColor: color }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 🔢 QUANTITY SELECTOR */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Quantity:</span>
          <div className="flex items-center gap-2 ring-1 ring-gray-300 rounded-md">
            <button
              onClick={handleDecreaseQuantity}
              className="px-2 py-1 hover:bg-gray-100 transition-colors"
              disabled={quantity <= 1}
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="px-3 py-1 text-sm font-medium">{quantity}</span>
            <button
              onClick={handleIncreaseQuantity}
              className="px-2 py-1 hover:bg-gray-100 transition-colors"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* 💵 PRICE & ACTIONS */}
        <div className="flex items-center justify-between gap-2">
          <p className="font-medium">${(product.price * quantity).toFixed(2)}</p>
          <button
            onClick={handleAddToCart}
            className="ring-1 ring-gray-200 shadow-lg rounded-md px-2 py-1 text-sm cursor-pointer hover:text-white hover:bg-black transition-all duration-300 flex items-center gap-2"
            disabled={addToCart.isPending}
          >
            <ShoppingCart className="w-4 h-4" />
            {addToCart.isPending ? "Adding..." : "Add to Cart"}
          </button>
          <button
            onClick={handleCreateOrder}
            className="bg-green-600 text-white shadow-lg rounded-md px-2 py-1 text-sm cursor-pointer hover:bg-green-700 transition-all duration-300"
            disabled={createOrder.isPending}
          >
            {createOrder.isPending ? "Ordering..." : "Buy Now"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
