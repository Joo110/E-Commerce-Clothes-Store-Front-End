"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";

interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  unitPrice: number;
}

interface Payment {
  id: number;
  paymentProvider: string;
  transactionId: string;
  amount: number;
  paymentDate: string;
  isSuccessful: boolean;
  orderId: number;
}

interface Order {
  id: number;
  orderDate: string;
  status: string;
  userId: string;
  orderItems: OrderItem[];
  payment: Payment;
}

export const useCreateOrder = () => {
  return useMutation({
    mutationFn: async (orderData: Order) => {
      console.log("🟡 Sending order to backend:", orderData);

      const res = await axios.post(
        "https://localhost:7020/api/Orders/create",
        orderData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return res.data;
    },
  });
};

// ✅ Helper function to build a valid order payload
export const buildOrderPayload = (
  cart: { productId: number; quantity: number; price: number }[],
  totalAmount: number
): Order | null => {
  const userId = Cookies.get("userId");

  if (!userId || userId === "undefined") {
    console.error("❌ userId is missing — please login first!");
    alert("يرجى تسجيل الدخول قبل إتمام الطلب!");
    return null;
  }

  return {
    id: 0,
    orderDate: new Date().toISOString(),
    status: "Pending",
    userId: userId,
    orderItems: cart.map((item) => ({
      id: 0,
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.price,
    })),
    payment: {
      id: 0,
      paymentProvider: "Cash",
      transactionId: "TXN-" + Date.now(),
      amount: totalAmount,
      paymentDate: new Date().toISOString(),
      isSuccessful: true,
      orderId: 0,
    },
  };
};