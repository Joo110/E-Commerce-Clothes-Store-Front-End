"use client";

import { useSearchParams } from "next/navigation";
import ShippingForm from "@/components/ShippingForm";

export default function ShippingPage() {
  const params = useSearchParams();

  const productData = {
    id: params.get("productId"),
    name: params.get("name"),
    price: params.get("price"),
    quantity: params.get("quantity"),
    size: params.get("size"),
    color: params.get("color"),
  };

  console.log("🛒 Product passed to Shipping:", productData);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-semibold mb-6">Shipping Information</h1>
      <ShippingForm setShippingForm={() => {}} />

      <div className="mt-8 p-4 border rounded-lg bg-gray-50">
        <h2 className="text-lg font-medium mb-2">Selected Product:</h2>
        <p><strong>{productData.name}</strong></p>
        <p>Size: {productData.size}</p>
        <p>Color: {productData.color}</p>
        <p>Quantity: {productData.quantity}</p>
        <p>Total: ${Number(productData.price) * Number(productData.quantity)}</p>
      </div>
    </div>
  );
}