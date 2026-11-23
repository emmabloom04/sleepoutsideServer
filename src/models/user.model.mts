import mongodb from "../database/index.mts";
import { ObjectId } from "mongodb";
import type {User} from "./types.mts";

async function getUserByEmail(email:string)
{
   const user = await mongodb.getDb().collection<User>("users").findOne({email: email});
   return user;
}

async function getUserById(id: string)
{
   const user = await mongodb.getDb().collection("users").findOne({ _id: new ObjectId(id) });
   return user;
}

async function createUser(newUser:{email:string, password:string, name:string})
{
   const result = await mongodb.getDb().collection("users").insertOne(newUser);
   return result;
}

// Only sets the address if the user has none. `address: null` matches
// a missing field AND a null one, so the "only if empty" rule is part of the query.
async function saveAddressIfMissing(id: string, address: Record<string, any>)
{
   const result = await mongodb.getDb().collection("users").updateOne(
      { _id: new ObjectId(id), address: null },
      { $set: { address, modifiedAt: new Date() } }
   );
   return result.modifiedCount === 1;
}

export default {
   getUserByEmail,
   getUserById,
   createUser,
   saveAddressIfMissing
}