import { OrderSchema } from "../database/json-schema.ts";
import EntityNotFoundError from "../errors/EntityNotFoundError.mts";
import {
  validator,
  sanitize,
  isExpirationValid,
  isCardAccepted,
  calculateTotal,
} from "./utils.mts";
import productModel from "../models/product.model.mts";
import orderModel from "../models/order.model.mts";
import userModel from "../models/user.model.mts";

// CONFIRM: these must match the frontend checkout math exactly
const TAX_RATE = 0.06;
const SHIPPING_FIRST_ITEM = 10;
const SHIPPING_EXTRA_ITEM = 2;

async function createOrder(userId: string, body: Record<string, any>) {
  // 1. strip any keys that start with $
  const data = sanitize(body);

  // 2. check the shape against the schema (throws a 400 on failure)
  validator(OrderSchema, data);

  // 3. payment checks
  if (!isCardAccepted(data.cardNumber)) {
    throw new EntityNotFoundError({ message: "Card not accepted", statusCode: 400 });
  }
  if (!isExpirationValid(data.cardExpiration)) {
    throw new EntityNotFoundError({ message: "Card is expired", statusCode: 400 });
  }

  // 4. look up the REAL price of each item, never trust the client's
  const prices: number[] = [];
  for (const item of data.orderItems) {
    const product = await productModel.getProductById(item.productId);
    if (!product) {
      throw new EntityNotFoundError({ message: "Product not found", statusCode: 400 });
    }
    prices.push(product.finalPrice);
  }

  // 5. recompute the totals on the server
  const itemsTotal = calculateTotal(prices);
  const expectedShipping = calculateTotal([
    SHIPPING_FIRST_ITEM,
    SHIPPING_EXTRA_ITEM * (prices.length - 1),
  ]);
  const expectedTax = calculateTotal([itemsTotal * TAX_RATE]);
  const expectedTotal = calculateTotal([itemsTotal, expectedShipping, expectedTax]);

  if (
    calculateTotal([data.shippingCost]) !== expectedShipping ||
    calculateTotal([data.taxAmount]) !== expectedTax ||
    calculateTotal([data.totalPrice]) !== expectedTotal
  ) {
    throw new EntityNotFoundError({ message: "Totals do not match", statusCode: 400 });
  }

  // 6. keep only the known address fields (the schema allows extra keys)
  const { street, city, state, zipCode, country } = data.shippingAddress;
  const address = { street, city, state, zipCode, country };

  // 7. build the order from known fields only (userId comes from the token)
  const newOrder = {
    userId,
    name: data.name,
    status: "pending",
    cardNumber: data.cardNumber,
    cardExpiration: data.cardExpiration,
    cardCode: data.cardCode,
    shippingAddress: address,
    orderItems: data.orderItems,
    totalPrice: expectedTotal,
    shippingCost: expectedShipping,
    taxAmount: expectedTax,
    createdAt: new Date(),
    modifiedAt: new Date(),
  };

  const order = await orderModel.createOrder(newOrder);

  // 8. save the address to the profile only if there isn't one yet.
  // the order already succeeded, so a failure here shouldn't fail it
  try {
    await userModel.saveAddressIfMissing(userId, address);
  } catch (err) {
    console.error("Could not save address to profile:", err);
  }

  return order;
}

export default { createOrder };