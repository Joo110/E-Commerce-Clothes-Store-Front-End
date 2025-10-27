"use client";

import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";

import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { ScrollArea } from "./ui/scroll-area";
import { useAddProduct } from "@/hooks/useProducts";
import { toast } from "sonner";
import { useState } from "react";

const categories = [
  "T-shirts",
  "Shoes",
  "Accessories",
  "Bags",
  "Dresses",
  "Jackets",
  "Gloves",
] as const;

const colors = [
  "blue",
  "green",
  "red",
  "yellow",
  "purple",
  "orange",
  "pink",
  "brown",
  "gray",
  "black",
  "white",
] as const;

const sizes = [
  "xs",
  "s",
  "m",
  "l",
  "xl",
  "xxl",
  "34",
  "35",
  "36",
  "37",
  "38",
  "39",
  "40",
  "41",
  "42",
  "43",
  "44",
  "45",
  "46",
  "47",
  "48",
] as const;

const formSchema = z.object({
  name: z.string().min(1, { message: "Product name is required!" }),
  shortDescription: z
    .string()
    .min(1, { message: "Short description is required!" })
    .max(60),
  description: z.string().min(1, { message: "Description is required!" }),
  price: z.coerce.number().min(1, { message: "Price is required!" }),
  category: z.enum(categories),
  sizes: z.array(z.enum(sizes)),
  colors: z.array(z.enum(colors)),
  images: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

const AddProduct = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      shortDescription: "",
      description: "",
      price: 0,
      category: "T-shirts",
      sizes: [],
      colors: [],
      images: [],
    },
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { mutate: addProduct, isPending } = useAddProduct();

 const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (event) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // ✅ تحديد حجم الصورة الجديد (مثلاً 300px عرض)
      const MAX_WIDTH = 300;
      const scaleSize = MAX_WIDTH / img.width;
      canvas.width = MAX_WIDTH;
      canvas.height = img.height * scaleSize;

      // ✅ رسم الصورة بالحجم الجديد
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

      // ✅ تحويل الصورة إلى Base64 مع جودة مضغوطة (0.7 = 70%)
      const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);

      // ✅ حفظها في الفورم والمعاينة
      form.setValue("images", [compressedBase64]);
      setPreviewImage(compressedBase64);
    };

    img.src = event.target?.result as string;
  };

  reader.readAsDataURL(file);
};


  const onSubmit = (values: FormValues) => {
    const formattedProduct = {
  name: values.name,
  description: values.description || values.shortDescription || "",
  price: values.price,
  imageUrl: values.images?.[0] || "",
  colors: values.colors.join(","),
  sizes: values.sizes.join(","),
  category: values.category, // 👈 مهم جدًا (مش ID)
  isActive: true,
};


    addProduct(formattedProduct, {
      onSuccess: () => {
        toast.success("✅ Product added successfully!");
        form.reset();
        setPreviewImage(null);
      },
      onError: (err) => {
        toast.error("❌ Failed to add product!");
        console.error(err);
      },
    });
  };

  return (
    <SheetContent>
      <ScrollArea className="h-screen">
        <SheetHeader>
          <SheetTitle className="mb-4">Add Product</SheetTitle>
          <SheetDescription asChild>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter the name of the product.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Short Description */}
                <FormField
                  control={form.control}
                  name="shortDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Short Description</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter the short description of the product.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter the description of the product.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Price */}
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter the price of the product.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Category */}
                <FormField
  control={form.control}
  name="category"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Category</FormLabel>
      <FormControl>
        <Input
          placeholder="Enter or create a category"
          {...field}
        />
      </FormControl>
      <FormDescription>
        Type a new category name or use an existing one.
      </FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>

               

                {/* Sizes */}
                <FormField
                  control={form.control}
                  name="sizes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sizes</FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-3 gap-4 my-2">
                          {sizes.map((size) => (
                            <div className="flex items-center gap-2" key={size}>
                              <Checkbox
                                checked={field.value?.includes(size)}
                                onCheckedChange={(checked) => {
                                  const currentValues = field.value || [];
                                  if (checked) {
                                    field.onChange([...currentValues, size]);
                                  } else {
                                    field.onChange(
                                      currentValues.filter((v) => v !== size)
                                    );
                                  }
                                }}
                              />
                              <label className="text-xs">{size}</label>
                            </div>
                          ))}
                        </div>
                      </FormControl>
                      <FormDescription>
                        Select the available sizes for the product.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Colors */}
                <FormField
                  control={form.control}
                  name="colors"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Colors</FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          <div className="grid grid-cols-3 gap-4 my-2">
                            {colors.map((color) => (
                              <div className="flex items-center gap-2" key={color}>
                                <Checkbox
                                  checked={field.value?.includes(color)}
                                  onCheckedChange={(checked) => {
                                    const currentValues = field.value || [];
                                    if (checked) {
                                      field.onChange([...currentValues, color]);
                                    } else {
                                      field.onChange(
                                        currentValues.filter((v) => v !== color)
                                      );
                                    }
                                  }}
                                />
                                <label className="text-xs flex items-center gap-2">
                                  <div
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: color }}
                                  />
                                  {color}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Select the available colors for the product.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* ✅ Upload Product Image */}
                <FormItem>
                  <FormLabel>Product Image</FormLabel>
                  <FormControl>
                    <div className="space-y-3">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      {previewImage && (
                        <div className="border rounded-md p-2 flex justify-center">
                          <img
                            src={previewImage}
                            alt="Preview"
                            className="w-32 h-32 object-cover rounded-md"
                          />
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    Upload an image of the product.
                  </FormDescription>
                  <FormMessage />
                </FormItem>

                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending ? "Adding..." : "Submit"}
                </Button>
              </form>
            </Form>
          </SheetDescription>
        </SheetHeader>
      </ScrollArea>
    </SheetContent>
  );
};

export default AddProduct;