import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";

// 👇 نوع بيانات المنتج
export interface ProductType {
  id: string | number;
  name: string;
  price: number;
  description?: string;
  images?: Record<string, string>;
  imageUrl?: string;
}

// 👇 نوع بيانات السلة
export interface CartItem {
  id?: string | number;
  userId: string;
  productId: string | number;
  quantity: number;
  price?: number;
  selectedColor?: string;
  selectedSize?: string;
  name?: string;

  // ✅ أضف كائن المنتج المرتبط
  product?: ProductType;
}

// 📌 جلب السلة للمستخدم
export const useCart = (userId: string) => {
  return useQuery<CartItem[]>({
    queryKey: ["cart", userId],
    queryFn: async () => {
      const response = await api.get(`/api/Cart/${userId}`);

      // 👇 عرّف النوع لتفادي الخطأ
      const result = response.data as { status?: number; data?: CartItem[] } | CartItem[];

      if (Array.isArray(result)) return result;
if (
  typeof result === "object" &&
  result !== null &&
  "data" in result &&
  Array.isArray((result as { data?: CartItem[] }).data)
) {
  return (result as { data: CartItem[] }).data;
}

      console.warn("⚠️ Unexpected cart data format:", result);
      return [];
    },
    enabled: !!userId,
  });
};

// 📌 إضافة للسلة
export const useAddToCart = () => {
  const queryClient = useQueryClient();
  return useMutation<CartItem, Error, Omit<CartItem, "id">>({
    mutationFn: async (cartItem) => {
      if (!cartItem.userId) throw new Error("Missing userId in cartItem");
      const { data } = await api.post("/api/Cart/add", cartItem);
      return data as CartItem;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["cart", variables.userId] });
    },
  });
};

// 📌 تحديث السلة
export const useUpdateCart = () => {
  const queryClient = useQueryClient();
  return useMutation<CartItem, Error, CartItem>({
    mutationFn: async (cartItem) => {
      const { data } = await api.put("/api/Cart/update", cartItem);
      return data as CartItem;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cart", data.userId] });
    },
  });
};

// 📌 إزالة عنصر من السلة
export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();
  return useMutation<{ success: boolean }, Error, { userId: string; cartItemId: string }>(
    {
      mutationFn: async ({ cartItemId }) => {
        const { data } = await api.delete(`/api/Cart/remove/${cartItemId}`);
        return data as { success: boolean };
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ["cart", variables.userId] });
      },
    }
  );
};