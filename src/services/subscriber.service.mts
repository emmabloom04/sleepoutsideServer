
import subscriberModel from "../models/subscriber.model.mts";
import CustomError from "../errors/CustomError.mts"
import { SubscriberSchema } from "../database/json-schema.ts";
import { validator } from "./utils.mts";


async function registerSubscriber(email:string, name:string) {
    const subscriber = await subscriberModel.getSubscriberByEmail(email);
    if (subscriber) throw new CustomError({ message: "Subscriber already exists", statusCode: 409 });
    const newSubscriber = {
        email,
        name,
    }
    validator(SubscriberSchema, newSubscriber);
    
    return subscriberModel.createSubscriber(newSubscriber)
}

export default {
    registerSubscriber
}