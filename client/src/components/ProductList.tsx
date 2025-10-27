"use client";

import { useState } from "react";
import { ProductType } from "@/types";
import Categories from "./Categories";
import ProductCard from "./ProductCard";
import Link from "next/link";
import Filter from "./Filter";
import SearchBar from "./SearchBar";
import { useSearchParams } from "next/navigation";
import { useProducts, useProductsByCategory } from "hooks/useProducts";

const ProductList = ({
  category,
  params,
}: {
  category: string;
  params: "homepage" | "products";
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category") || "all";

  const {
    data: allProducts = [],
    isLoading: isAllLoading,
    isError: isAllError,
  } = useProducts();

  const {
    data: categoryProducts = [],
    isLoading: isCatLoading,
    isError: isCatError,
  } = useProductsByCategory(selectedCategory !== "all" ? selectedCategory : "");

  const productsToShow =
    selectedCategory === "all" ? allProducts : categoryProducts;

  const filteredProducts = productsToShow.filter((product: ProductType) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isLoading = isAllLoading || isCatLoading;
  const isError = isAllError || isCatError;

  if (isLoading)
    return (
      <div className="w-full flex justify-center items-center py-20">
        <p className="text-gray-600 animate-pulse">Loading products...</p>
      </div>
    );

  if (isError)
    return (
      <div className="w-full flex justify-center items-center py-20">
        <p className="text-red-500">Failed to load products. Please try again.</p>
      </div>
    );

  return (
    <>
      {/* 🏷️ الفئات */}
      <Categories />

      {/* 🔍 البحث */}
      <div className="w-full flex justify-center my-9">
        <div className="w-[80%] sm:w-[60%] md:w-[50%] lg:w-[40%]">
          <SearchBar onSearch={setSearchTerm} />
        </div>
      </div>

      {/* 🛍️ المنتجات */}
      <div className="w-full px-4 md:px-8 lg:px-12">
        {params === "products" && <Filter />}

        {filteredProducts.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            No products found.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredProducts
              .filter((p) => p && p.id)
              .map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
          </div>
        )}

        <Link
          href={category ? `/products/?category=${category}` : "/products"}
          className="flex mt-4 underline text-sm text-gray-500 justify-center"
        >
          View all products
        </Link>
      </div>
    </>
  );
};

export default ProductList;