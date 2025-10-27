"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";

export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  colors: string;
  sizes: string;
  isActive?: boolean;
}

// 📌 Add Product
export const useAddProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: Product) => {
      const { data } = await api.post("/api/Product/add", product);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};


// 📌 Get All Products
interface ProductsResponse {
  status: number;
  data: Product[];
}

export const useProducts = () => {
  return useQuery<Product[], Error>({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await api.get<ProductsResponse>("/api/Product");

      // ✅ ارجع المصفوفة اللي جوه data
      if (data?.data && Array.isArray(data.data)) return data.data;

      console.warn("⚠️ Unexpected products data format:", data);
      return [];
    },
  });
};




// 📌 Update Product
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: Product) => {
      const { data } = await api.put("/api/Product/update", product);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

// 📌 Delete Product
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/api/Product/delete/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};