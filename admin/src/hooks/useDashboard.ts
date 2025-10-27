"use client";

import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";

// 📊 Get Monthly Revenue
export const useMonthlyRevenue = () => {
  return useQuery({
    queryKey: ["dashboard", "monthly-revenue"],
    queryFn: async () => {
      const { data } = await api.get("/api/Dashboard/monthly-revenue");
      return data;
    },
  });
};

// 📊 Get Order Stats
export const useOrderStats = () => {
  return useQuery({
    queryKey: ["dashboard", "order-stats"],
    queryFn: async () => {
      const { data } = await api.get("/api/Dashboard/order-stats");
      return data;
    },
  });
};

// 📊 Get Latest Transactions
export const useLatestTransactions = () => {
  return useQuery({
    queryKey: ["dashboard", "latest-transactions"],
    queryFn: async () => {
      const { data } = await api.get("/api/Dashboard/latest-transactions");
      return data;
    },
  });
};

// 📊 Get Top Products
export const useTopProducts = () => {
  return useQuery({
    queryKey: ["dashboard", "top-products"],
    queryFn: async () => {
      const { data } = await api.get("/api/Dashboard/top-products");
      return data;
    },
  });
};