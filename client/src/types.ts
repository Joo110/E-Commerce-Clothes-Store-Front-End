import { z } from "zod";
export type ProductType = {
  id?: string | number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: Record<string, string>;
  image?: string; 
  colors: string | string[];
  sizes: string | string[];
  category?: string | null;
  isActive?: boolean;
};

export type CartItemType = {
  id?: string;
  userId?: string;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
  price: number;
  name?: string;
  product?: ProductType;
};

export type OrderResponse = {
  id: number;
  userId: string;
  status: string;
  totalAmount: number;
  createdAt: string;
};


export type CartItemsType = CartItemType[];

export const shippingFormSchema = z.object({
  name: z.string().min(1, "Name is required!"),
  email: z.email().min(1, "Email is required!"),
  phone: z
    .string()
    .min(7, "Phone number must be between 7 and 10 digits!")
    .max(10, "Phone number must be between 7 and 10 digits!")
    .regex(/^\d+$/, "Phone number must contain only numbers!"),
  address: z.string().min(1, "Address is required!"),
  city: z.string().min(1, "City is required!"),
});

export type ShippingFormInputs = z.infer<typeof shippingFormSchema>;

export const paymentFormSchema = z.object({
  cardHolder: z.string().min(1, "Card holder is required!"),
  cardNumber: z
    .string()
    .min(16, "Card Number is required!")
    .max(16, "Card Number is required!"),
  expirationDate: z
    .string()
    .regex(
      /^(0[1-9]|1[0-2])\/\d{2}$/,
      "Expiration date must be in MM/YY format!"
    ),
  cvv: z.string().min(3, "CVV is required!").max(3, "CVV is required!"),
});

export type PaymentFormInputs = z.infer<typeof paymentFormSchema>;

export type CartStoreStateType = {
  cart: CartItemsType;
  hasHydrated: boolean;
};

export type CartStoreActionsType = {
  addToCart: (product: CartItemType) => void;
  removeFromCart: (product: CartItemType) => void;
  clearCart: () => void;
};
