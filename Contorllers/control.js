import { ObjectId } from "bson"
import { client } from "../db.js"

import jwt from "jsonwebtoken"
import dotevn from "dotenv"

dotevn.config()



export function addUser(userdata) {
    return client
        .db("userData")
        .collection("users")
        .insertOne(userdata)
}

export function getUser(data) {
    return client
        .db("userData")
        .collection("users")
        .findOne(data)
}

export function getUserName(name) {
    return client
        .db("userData")
        .collection("users")
        .findOne({ name: name })
}


export function getuserbyId(id) {
    return client
        .db("userData")
        .collection("users")
        .findOne({ _id: new ObjectId(id) })
}

export function generateToken(id) {
    return jwt.sign(
        { id },
        process.env.SECRET_KEY,
        { expiresIn: "30days" }

    )

}

export function resetPassword(id, data) {
    return client
        .db("userData")
        .collection("users")
        .findOneAndUpdate({ _id: new ObjectId(id) }, { $set: data })
}

export function forgotPassword(email, data) {
    return client
        .db("userData")
        .collection("users")
        .findOneAndUpdate({ email: email }, { $set: data })
}
