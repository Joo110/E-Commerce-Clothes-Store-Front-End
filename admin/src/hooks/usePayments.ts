import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";

// 📌 Server Response Type (من الـ API)
export interface PaymentFromServer {
  id: number;
  paymentProvider: string;
  transactionId: string;
  amount: number;
  paymentDate: string;
  isSuccessful: boolean;
  orderId: number;
}

// 📌 UI Payment Type (للجدول)
export interface Payment {
  id: string;
  amount: number;
  fullName: string;
  userId: string;
  email: string;
  status: "pending" | "processing" | "success" | "failed";
}

// 📌 Mapper Function: من Server Shape → UI Shape
const mapServerPaymentToUI = (serverPayment: PaymentFromServer): Payment => {
  return {
    id: serverPayment.transactionId || String(serverPayment.id),
    amount: serverPayment.amount,
    fullName: "N/A", // السيرفر مش بيرجع fullName، هنحطها N/A
    userId: String(serverPayment.orderId), // نستخدم orderId كـ userId مؤقت
    email: "N/A", // السيرفر مش بيرجع email
    status: serverPayment.isSuccessful ? "success" : "failed",
  };
};

// 📌 Get All Payments
export const useAllPayments = () => {
  return useQuery({
    queryKey: ["allPayments"],
    queryFn: async () => {
      const { data } = await api.get<PaymentFromServer[]>("/api/Payments/all");
      // نحول الداتا من Server Shape → UI Shape
      return data.map(mapServerPaymentToUI);
    },
  });
};

// 📌 Create Payment
export const useCreatePayment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (payment: unknown) => {
      const { data } = await api.post("/api/Payments/create", payment);
      return data;
    },
    onSuccess: () => {
      // لما الـ payment يتعمل بنجاح، نعمل refetch للبيانات
      queryClient.invalidateQueries({ queryKey: ["allPayments"] });
    },
  });
};

// 📌 Delete Payment
export const useDeletePayment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (paymentId: string) => {
      const { data } = await api.delete(`/api/Payments/${paymentId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allPayments"] });
    },
  });
};

// 📌 Get Payments by OrderId
export const usePaymentsByOrder = (orderId: string) => {
  return useQuery({
    queryKey: ["payments", orderId],
    queryFn: async () => {
      const { data } = await api.get<PaymentFromServer[]>(`/api/Payments/order/${orderId}`);
      return data.map(mapServerPaymentToUI);
    },
    enabled: !!orderId,
  });
};