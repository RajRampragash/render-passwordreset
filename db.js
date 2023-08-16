import { MongoClient } from "mongodb";
// import dotevn from "dotenv"

import Obj from "mongodb"

// dotevn.config()
//connect mongodb
const mongoConnectString = 'mongodb+srv://Mathew:mathew@cluster0.d1ilp3c.mongodb.net/?retryWrites=true&w=majority'

export async function dbConnection() {
    const client = new MongoClient(mongoConnectString);
    await client.connect();
    console.log("Mongo DB connected succesfully");
    return client;
}

export var ObjectId = Obj.ObjectId;
export const client = await dbConnection();
