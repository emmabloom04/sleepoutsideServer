import type { JSONSchema7 } from "json-schema";
// This extends the library's type definition to include your custom keyword
declare module "json-schema" {
  export interface JSONSchema7 {
    instanceof?: string | string[];
  }
}

// Product schema
export interface Product {
  _id: string;
  id: string;
  isClearance: boolean;
  category: "tents" | "backpacks" | "sleeping-bags" | "hammocks";
  isNew: boolean;
  url: string;
  reviews: Review;
  nameWithoutBrand: string;
  name: string;
  images: Images;
  sizesAvailable: SizesAvailable;
  colors: Color[];
  descriptionHtmlSimple: string;
  suggestedRetailPrice: number;
  brand: Brand;
  listPrice: number;
  finalPrice: number;
}

export interface Review {
  reviewsUrl: string;
  reviewCount: number;
  averageRating: number;
}

export interface Images {
  primarySmall: string;
  primaryMedium: string;
  primaryLarge: string;
  primaryExtraLarge: string;
  extraImages: ExtraImage[];
}

export interface ExtraImage {
  title: string;
  src: string;
}

export interface SizesAvailable {
  zipper: string[];
  size: string[];
}

export interface Color {
  colorCode: string;
  colorName: string;
  colorChipImageSrc: string;
  colorPreviewImageSrc: string;
}
export interface Brand {
  id: string;
  url: string;
  productsUrl: string;
  logoSrc: string;
  name: string;
}

// User schema
export interface User {
  _id?: string;
  email: string;
  password: string;
  name: string;
  address?: Address;
  phoneNumbers?: PhoneNumber[];
  cart?: CartItem[];
  createdAt: Date;
  modifiedAt: Date;
}

export interface Address {
  street: string;
  city: string;
  state:
    | "AL"
    | "AK"
    | "AZ"
    | "AR"
    | "CA"
    | "CO"
    | "CT"
    | "DE"
    | "DC"
    | "FL"
    | "GA"
    | "HI"
    | "ID"
    | "IL"
    | "IN"
    | "IA"
    | "KS"
    | "KY"
    | "LA"
    | "ME"
    | "MD"
    | "MA"
    | "MI"
    | "MN"
    | "MS"
    | "MO"
    | "MT"
    | "NE"
    | "NV"
    | "NH"
    | "NJ"
    | "NM"
    | "NY"
    | "NC"
    | "ND"
    | "OH"
    | "OK"
    | "OR"
    | "PA"
    | "RI"
    | "SC"
    | "SD"
    | "TN"
    | "TX"
    | "UT"
    | "VT"
    | "VA"
    | "WA"
    | "WV"
    | "WI"
    | "WY";
  zipCode: string;
  country: string;
}

export interface PhoneNumber {
  type: string;
  number: string;
}

export interface CartItem {
  productId: string;
  productName: string;
  price: number;
  finalPrice: number;
  productImageSrc: string;
  productUrl: string;
  productCategory: string;
  productColor: Color;
  productSize: string;
}

// Order schema
export interface Order {
  _id: string;
  userId: string;
  name: string;
  status: "pending" | "processing" | "shipped" | "delivered";
  cardNumber: string;
  cardExpiration: string;
  cardCode: string;
  shippingAddress: Address;
  orderItems: CartItem[];
  createdAt: Date;
  modifiedAt: Date;
  totalPrice: number;
  shippingCost: number;
  taxAmount: number;
}

// Alert schema
export interface Alert {
  _id: string;
  title: string;
  type: "warning" | "info" | "promotion";
  status: "active" | "inactive";
  createdAt: Date;
  modifiedAt: Date;
}

export const SubscriberSchema: JSONSchema7 = {
  type: "object",
  properties: {
    email: { type: "string", format: "email" },
    name: { type: "string" },
  },
  required: ["email", "name"],
  additionalProperties: false
}

export const UserSchema: JSONSchema7 = {
  type: "object",
  properties: {
    email: { type: "string", format: "email" },
    password: { type: "string" },
    name: { type: "string" },
    createdAt: { instanceof: "Date" },
    modifiedAt: { instanceof: "Date" }
  },
  required: ["email", "password", "name", "createdAt", "modifiedAt"]
};

export const OrderSchema: JSONSchema7 = {
  type: "object",
  properties: {
    name: { type: "string", minLength: 1 },
    cardNumber: { type: "string", pattern: "^\\d{12}$" },
    cardCode: { type: "string", pattern: "^\\d{3}$" },
    cardExpiration: { type: "string", pattern: "^(0[1-9]|1[0-2])/\\d{2}$" },
    shippingAddress: {
      type: "object",
      properties: {
        street: { type: "string", minLength: 10, maxLength: 100 },
        city: { type: "string", minLength: 5, maxLength: 50 },
        state: {
          type: "string",
          enum: [
            "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL",
            "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME",
            "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH",
            "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI",
            "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
          ]
        },
        zipCode: { type: "string", pattern: "^\\d{5}(-\\d{4})?$" },
        country: { type: "string", minLength: 2, maxLength: 30, pattern: "^\\w+$" },
      },
      required: ["street", "city", "state", "zipCode", "country"],
    },
    orderItems: { type: "array", minItems: 1 },
    totalPrice: { type: "number" },
    shippingCost: { type: "number" },
    taxAmount: { type: "number" },
  },
  required: [
    "name",
    "cardNumber",
    "cardCode",
    "cardExpiration",
    "shippingAddress",
    "orderItems",
    "totalPrice",
    "shippingCost",
    "taxAmount",
  ],
};