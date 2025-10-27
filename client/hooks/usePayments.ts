import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";

// 📌 Create Payment
export const useCreatePayment = () => {
  return useMutation({
    mutationFn: async (payment: unknown) => {
      const { data } = await api.post("/api/Payments/create", payment);
      return data;
    },
  });
};

// 📌 Get Payments by OrderId
export const usePaymentsByOrder = (orderId: string) => {
  return useQuery({
    queryKey: ["payments", orderId],
    queryFn: async () => {
      const { data } = await api.get(`/api/Payments/order/${orderId}`);
      return data;
    },
    enabled: !!orderId,
  });
};