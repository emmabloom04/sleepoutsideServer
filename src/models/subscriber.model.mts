import mongodb from "../database/index.mts";
import type {Subscriber} from "./types.mts";

async function getSubscriberByEmail(email:string)
{
   const subscriber = await mongodb.getDb().collection<Subscriber>("subscribers").findOne({email: email});
   return subscriber;
}

async function createSubscriber(
  newSubscriber: Omit<Subscriber, "_id">
) {
  const result = await mongodb
    .getDb()
    .collection("subscribers")
    .insertOne(newSubscriber);

  return result;
}
export default {
    getSubscriberByEmail,
    createSubscriber
}