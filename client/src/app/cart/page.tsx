"use client";

import PaymentForm from "@/components/PaymentForm";
import ShippingForm from "@/components/ShippingForm";
import { ArrowRight, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useCart, useRemoveFromCart } from "hooks/useCart";
import api from "lib/api";
import { ShippingFormInputs } from "@/types";
import type { CartItem as HookCartItem, ProductType } from "hooks/useCart";

// 🔹 نعرّف نسخة متوافقة مع hook
interface CartItem extends HookCartItem {
  product?: ProductType;
  name?: string;
  price?: number;
}

const steps = [
  { id: 1, title: "Shopping Cart" },
  { id: 2, title: "Shipping Address" },
  { id: 3, title: "Payment Method" },
];

const CartPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeStep = parseInt(searchParams.get("step") || "1");
  const [shippingForm, setShippingForm] = useState<ShippingFormInputs>();

  const userId = Cookies.get("userId") || "";

  // ✅ نجيب بيانات السلة من السيرفر
  const { data: cartItems, isLoading } = useCart(userId);
  const removeMutation = useRemoveFromCart();

  // ✅ نخزن السلة بعد دمج بيانات المنتج
  const [cartWithProducts, setCartWithProducts] = useState<CartItem[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!cartItems || cartItems.length === 0) {
        setCartWithProducts([]);
        return;
      }

      try {
        const itemsWithProducts: CartItem[] = await Promise.all(
          cartItems.map(async (item) => {
            try {
              // ✅ حدد نوع الـ response
              type ApiResponse = { status: number; data: ProductType } | ProductType;
              
             const response = await api.get<ApiResponse>(
  `/api/Product/${item.productId}`  // 👈 بدون s
);
              
              // ✅ استخرج الـ data الصح - الـ API بيرجع { status: 200, data: {...} }
              const product: ProductType = 
                response.data && 
                typeof response.data === 'object' && 
                'data' in response.data
                  ? (response.data as { status: number; data: ProductType }).data
                  : (response.data as ProductType);

              return {
                ...item,
                product,
                name: product?.name,
                price: product?.price,
              };
            } catch (err) {
              console.warn(`⚠️ فشل في جلب المنتج ${item.productId}`, err);
              return item;
            }
          })
        );

        setCartWithProducts(itemsWithProducts);
      } catch (err) {
        console.error("⚠️ Error fetching product details:", err);
      }
    };

    fetchProducts();
  }, [cartItems]);

  if (isLoading) {
    return <p className="text-center mt-8 text-gray-500">Loading your cart...</p>;
  }

  // ✅ لو السلة فاضية
  if (!cartWithProducts || cartWithProducts.length === 0) {
    return (
      <div className="flex flex-col gap-8 items-center justify-center mt-12">
        <h1 className="text-2xl font-medium">Your Shopping Cart</h1>
        <p className="text-gray-500">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 items-center justify-center mt-12">
      <h1 className="text-2xl font-medium">Your Shopping Cart</h1>

      {/* STEPS HEADER */}
      <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`flex items-center gap-2 border-b-2 pb-4 ${
              step.id === activeStep ? "border-gray-800" : "border-gray-200"
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full text-white p-4 flex items-center justify-center ${
                step.id === activeStep ? "bg-gray-800" : "bg-gray-400"
              }`}
            >
              {step.id}
            </div>
            <p
              className={`text-sm font-medium ${
                step.id === activeStep ? "text-gray-800" : "text-gray-400"
              }`}
            >
              {step.title}
            </p>
          </div>
        ))}
      </div>

      {/* CONTENT */}
      <div className="w-full flex flex-col lg:flex-row gap-16">
        {/* LEFT SIDE - CART ITEMS */}
        <div className="w-full lg:w-7/12 shadow-lg border border-gray-100 p-8 rounded-lg flex flex-col gap-8">
          {activeStep === 1 ? (
            cartWithProducts.map((item) => (
              <div
                key={item.id?.toString()}
                className="flex items-center justify-between border-b border-gray-100 pb-4"
              >
                <div className="flex gap-8">
                  {/* IMAGE */}
                  <div className="relative w-32 h-32 bg-gray-50 rounded-lg overflow-hidden">
    <Image
  src={item.product?.imageUrl || "/placeholder.png"}
  alt={item.product?.name || "Product"}
  fill
  unoptimized
  className="object-contain"
/>


                  </div>

                  {/* DETAILS */}
                  <div className="flex flex-col justify-between">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-medium">
                        {item.product?.name || item.name || "Unknown Product"}
                      </p>
                      <p className="text-xs text-gray-500">Quantity: {item.quantity}</p>
                      {item.selectedSize && (
                        <p className="text-xs text-gray-500">
                          Size: {item.selectedSize}
                        </p>
                      )}
                      {item.selectedColor && (
                        <p className="text-xs text-gray-500">
                          Color: {item.selectedColor}
                        </p>
                      )}
                    </div>
                    <p className="font-medium">
                      ${item.product?.price?.toFixed(2) ?? item.price?.toFixed(2) ?? "0.00"}
                    </p>
                  </div>
                </div>

                {/* REMOVE BUTTON */}
                <button
                  onClick={() =>
                    removeMutation.mutate({
                      userId,
                      cartItemId: item.id?.toString() ?? "",
                    })
                  }
                  className="w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 transition-all duration-300 text-red-400 flex items-center justify-center"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))
          ) : activeStep === 2 ? (
            <ShippingForm setShippingForm={setShippingForm} />
          ) : activeStep === 3 && shippingForm ? (
            <PaymentForm userId={userId} />
          ) : (
            <p className="text-sm text-gray-500">
              Please fill in the shipping form to continue.
            </p>
          )}
        </div>

        {/* RIGHT SIDE - SUMMARY */}
        <div className="w-full lg:w-5/12 shadow-lg border border-gray-100 p-8 rounded-lg flex flex-col gap-8 h-max">
          <h2 className="font-semibold">Cart Details</h2>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between text-sm">
              <p className="text-gray-500">Subtotal</p>
              <p className="font-medium">
                $
                {cartWithProducts
                  .reduce(
                    (acc, item) =>
                      acc + ((item.product?.price || item.price || 0) * (item.quantity || 1)),
                    0
                  )
                  .toFixed(2)}
              </p>
            </div>
            <div className="flex justify-between text-sm">
              <p className="text-gray-500">Shipping Fee</p>
              <p className="font-medium">$10</p>
            </div>
            <hr className="border-gray-200" />
            <div className="flex justify-between">
              <p className="text-gray-800 font-semibold">Total</p>
              <p className="font-medium">
                $
                {(
                  cartWithProducts.reduce(
                    (acc, item) =>
                      acc + ((item.product?.price || item.price || 0) * (item.quantity || 1)),
                    0
                  ) + 10
                ).toFixed(2)}
              </p>
            </div>
          </div>
          {activeStep === 1 && (
            <button
              onClick={() => router.push("/cart?step=2", { scroll: false })}
              className="w-full bg-gray-800 hover:bg-gray-900 transition-all duration-300 text-white p-2 rounded-lg cursor-pointer flex items-center justify-center gap-2"
            >
              Continue
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;