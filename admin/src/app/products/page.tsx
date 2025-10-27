"use client";

import { useState } from "react";
import { DataTable } from "./data-table";
import { columns as tableColumns } from "./columns";
import { useProducts, useDeleteProduct } from "@/hooks/useProducts";
import { toast } from "react-hot-toast";
import { Trash2 } from "lucide-react";

export type TableProductType = {
  id: string;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  sizes: string[];
  colors: string[];
  images: Record<string, string>;
};

const ProductsPage = () => {
  const { data: productsFromApi = [], isLoading, isError } = useProducts();
  const deleteProduct = useDeleteProduct();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const mappedProducts: TableProductType[] = productsFromApi.map((p) => ({
    id: p.id?.toString() || "",
    name: p.name,
    shortDescription: p.description?.slice(0, 60) || "",
    description: p.description || "",
    price: p.price,
    sizes: p.sizes ? p.sizes.split(",") : [],
    colors: p.colors ? p.colors.split(",") : [],
    images: p.imageUrl
      ? p.colors?.split(",").reduce((acc, color) => {
          acc[color] = p.imageUrl!;
          return acc;
        }, {} as Record<string, string>)
      : {},
  }));

  const handleDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm("Are you sure you want to delete the selected product(s)?")) return;

    try {
      await Promise.all(selectedIds.map((id) => deleteProduct.mutateAsync(id)));
      toast.success("✅ Product(s) deleted successfully!");
      setSelectedIds([]);
    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to delete product(s)!");
    }
  };

  if (isLoading) return <div className="p-4">Loading products...</div>;
  if (isError) return <div className="p-4 text-red-500">Failed to load products.</div>;

  return (
    <div className="p-4">
      <div className="mb-8 px-4 py-2 bg-secondary rounded-md flex justify-between items-center">
        <h1 className="font-semibold text-lg">All Products</h1>
        {selectedIds.length > 0 && (
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-md text-sm"
          >
            <Trash2 className="w-4 h-4" />
            Delete Product(s)
          </button>
        )}
      </div>
      <DataTable<TableProductType, unknown>
      columns={tableColumns}
      data={mappedProducts}
      />
      </div>
  );
};

export default ProductsPage;
