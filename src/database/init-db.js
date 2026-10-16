// import MongoClient and ServerApiVersion from the mongodb library and import products from the products.js file.
import { MongoClient, ServerApiVersion } from "mongodb";
import { products } from "./products.js";
import * as argon2 from "argon2";

// password hashing function
const hashedPassword = await argon2.hash("password");

// build the uri for our connection string
const uri = process.env.MONGO_URI;
if (!uri) {
  throw new Error("MONGO_URI is not set. Run with --env-file=.env");
}

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// helper: drop a collection, but don't fail if it doesn't exist yet
const dropIfExists = async (db, name) => {
  try {
    await db.collection(name).drop();
    console.log(`Collection '${name}' dropped`);
  } catch (err) {
    if (err.codeName === "NamespaceNotFound") {
      console.log(`Collection '${name}' not found`);
    } else {
      console.error(err.message);
    }
  }
};

const lowerCaseKeys = function (obj) {
  // if it is an object (and not null), but NOT an array, iterate through all of its keys
  if (obj !== null && typeof obj === "object" && !Array.isArray(obj)) {
    for (let key of Object.keys(obj)) {
      // make the first letter of the key lowercase
      let newKey = key[0].toLowerCase() + key.slice(1);
      let value = obj[key];
      // if the value is an object or array, call this function again
      if (value !== null && typeof value === "object") {
        value = lowerCaseKeys(value);
      }
      // only delete the old key if the name actually changed
      if (newKey !== key) {
        delete obj[key];
      }
      obj[newKey] = value;
    }
  } else if (Array.isArray(obj)) {
    // if it is an array, call the function again for each object item
    for (let i = 0; i < obj.length; i++) {
      if (obj[i] !== null && typeof obj[i] === "object") {
        obj[i] = lowerCaseKeys(obj[i]);
      }
    }
  }
  return obj;
};

const seedProducts = async (db) => {
  // change Reviews.ReviewsUrl to match: /products/<productId>/reviews/
  // then convert all keys from PascalCase to camelCase
  const updatedProducts = products.map((product) => {
    product.Reviews.ReviewsUrl = `/products/${product.Id}/reviews/`;
    product = lowerCaseKeys(product);
    return product;
  });

  try {
    // clear out the old records (safe if the collection doesn't exist yet)
    await dropIfExists(db, "products");
    // create a new collection
    await db.createCollection("products");
    console.log("Collection 'products' created successfully");
    // insert all products
    const result = await db.collection("products").insertMany(updatedProducts);
    console.log(
      `${result.insertedCount} new listing(s) created with the following id(s):`
    );
    console.log(result.insertedIds);
  } catch (error) {
    console.error(error.message);
  }
};

// define the init function to connect to our database and create collections
const init = async () => {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    // get a reference to the actual database we will be using
    const db = client.db(process.env.MONGO_DATABASE);

    // drop old collections
    await dropIfExists(db, "users");
    await dropIfExists(db, "alerts");
    await dropIfExists(db, "orders");

    // initialize the Products collection
    await seedProducts(db);

    // insert test user
    await db.collection("users").insertOne({
      name: "Test User",
      email: "test@example.com",
      password_hash: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // indexes for products
    await db.collection("products").createIndex({ name: 1 });
    await db.collection("products").createIndex({ description: 1 });
    await db.collection("products").createIndex({ category: 1 });
    await db.collection("products").createIndex({ id: 1 });

    // indexes for users
    await db.collection("users").createIndex({ name: 1 });
    await db.collection("users").createIndex({ email: 1 }, { unique: true });

    console.log("Seeding complete");
  } catch (error) {
    console.error(error.message);
  } finally {
    await client.close();
  }
};

init();