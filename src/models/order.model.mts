import mongodb from "../database/index.mts";

async function createOrder(newOrder: Record<string, any>) {
  const result = await mongodb.getDb().collection("orders").insertOne(newOrder);
  return { ...newOrder, id: result.insertedId.toString() };
}

export default {
  createOrder
}