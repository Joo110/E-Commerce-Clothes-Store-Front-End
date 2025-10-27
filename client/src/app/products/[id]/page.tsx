"use client";

import { useProductById } from "../../../../hooks/useProducts";
import { useSearchParams, useParams } from "next/navigation";
import Image from "next/image";
import ProductInteraction from "@/components/ProductInteraction";

const ProductPage = () => {
  const { id } = useParams();
  const searchParams = useSearchParams();

  const { data: product, isLoading, isError } = useProductById(id as string);

  const selectedSize = searchParams.get("size") || "";
  const selectedColor = searchParams.get("color") || "";

  if (isLoading) return <p className="p-10 text-gray-500">Loading...</p>;
  if (isError || !product)
    return <p className="p-10 text-red-500">Product not found</p>;

  return (
    <div className="flex flex-col gap-4 lg:flex-row md:gap-12 mt-12">
      {/* 🖼️ IMAGE */}
      <div className="w-full lg:w-5/12 relative aspect-[2/3]">
        <Image
          src={
            typeof product.imageUrl === "object"
              ? product.imageUrl[selectedColor as keyof typeof product.imageUrl] ||
                Object.values(product.imageUrl)[0]
              : product.imageUrl || "/placeholder.png"
          }
          alt={product.name}
          fill
          className="object-contain rounded-md"
        />
      </div>

      {/* 🧾 DETAILS */}
      <div className="w-full lg:w-7/12 flex flex-col gap-4">
        <h1 className="text-2xl font-medium">{product.name}</h1>
        <p className="text-gray-500">{product.description}</p>
        <h2 className="text-2xl font-semibold">${product.price.toFixed(2)}</h2>

        <ProductInteraction
          product={product}
          selectedSize={selectedSize}
          selectedColor={selectedColor}
        />

        {/* 💳 CARD INFO */}
        <div className="flex items-center gap-2 mt-4">
          <Image src="/klarna.png" alt="klarna" width={50} height={25} />
          <Image src="/cards.png" alt="cards" width={50} height={25} />
          <Image src="/stripe.png" alt="stripe" width={50} height={25} />
        </div>

        <p className="text-gray-500 text-xs">
          By clicking Pay Now, you agree to our{" "}
          <span className="underline hover:text-black">Terms & Conditions</span>{" "}
          and <span className="underline hover:text-black">Privacy Policy</span>
          . You authorize us to charge your selected payment method for the
          total amount shown. All sales are subject to our return and{" "}
          <span className="underline hover:text-black">Refund Policies</span>.
        </p>
      </div>
    </div>
  );
};

export default ProductPage;
