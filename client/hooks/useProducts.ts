// 📁 src/hooks/useProducts.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";
import { ProductType } from "@/types";

// =======================
// ✅ أنواع البيانات القادمة من الـ API
// =======================
type ProductApiResponse = {
  status: number;
  page?: number;
  pageSize?: number;
  totalCount?: number;
  data: ProductType[];
};

type SingleProductApiResponse = {
  status: number;
  data: ProductType;
};

// =======================
// ✅ إضافة منتج جديد
// =======================
export const useAddProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<ProductType, Error, ProductType>({
    mutationFn: async (product: ProductType) => {
      const { data } = await api.post<SingleProductApiResponse>("/api/Product/add", product);
      
      // ✅ الـ API بيرجع { status: 200, data: {...} }
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

// =======================
// ✅ جلب كل المنتجات
// =======================
export const useProducts = () => {
  return useQuery<ProductType[], Error>({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await api.get<ProductApiResponse | ProductType[]>("/api/Product");

      if (
        typeof data === "object" &&
        data !== null &&
        "data" in data &&
        Array.isArray((data as ProductApiResponse).data)
      ) {
        // ✅ لو مفيش id بالـ API نضيف مؤقتًا
        return (data as ProductApiResponse).data.map((p, index) => ({
          id: p.id ?? `temp-${index}`,
          ...p,
        }));
      }

      if (Array.isArray(data)) {
        return data.map((p, index) => ({
          id: p.id ?? `temp-${index}`,
          ...p,
        })) as ProductType[];
      }

      console.warn("⚠️ Unexpected products data format:", data);
      return [];
    },
  });
};


// =======================
// ✅ جلب منتج واحد عن طريق الـ ID
// =======================
export const useProductById = (id: string) => {
  return useQuery<ProductType, Error>({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data } = await api.get<SingleProductApiResponse>(`/api/Product/${id}`);
      
      // ✅ الـ API بيرجع { status: 200, data: {...} }
      return data.data;
    },
    enabled: !!id,
  });
};

// =======================
// ✅ تعديل منتج
// =======================
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<ProductType, Error, ProductType>({
    mutationFn: async (product: ProductType) => {
      const { data } = await api.put<SingleProductApiResponse>("/api/Product/update", product);
      
      // ✅ الـ API بيرجع { status: 200, data: {...} }
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

// =======================
// ✅ حذف منتج
// =======================
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, Error, string>({
    mutationFn: async (id: string) => {
      const { data } = await api.delete<{ message: string }>(`/api/Product/delete/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};


// =======================
// ✅ جلب المنتجات حسب التصنيف
// =======================
type ProductsByCategoryResponse = {
  status: number;
  data: ProductType[];
};

export const useProductsByCategory = (category: string) => {
  return useQuery<ProductType[], Error>({
    queryKey: ["products", category],
    queryFn: async () => {
      const { data } = await api.get<ProductsByCategoryResponse>(
        `/api/Product/category/${category}`
      );

      if (data && Array.isArray(data.data)) {
        return data.data.map((p: ProductType, index: number) => ({
          id: p.id ?? `temp-${index}`,
          ...p,
        }));
      }

      console.warn("⚠️ Unexpected category data format:", data);
      return [];
    },
    enabled: !!category,
  });
};

