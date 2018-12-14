import { Mongoose } from "mongoose";

import * as mongoose from 'mongoose';
export interface users extends mongoose.Document{
    username : String,
    address : string,
    privatekey: String,
    publickey : String,
    email : String,
    password : String,
    token : String,
    balance : Number,
    listTransaction : [{
        indexBlock : Number,
        indexTransaction : Number
    }]
} 
export let schema = new mongoose.Schema({
    username : String,
    address : String,
    privatekey: String,
    puiblickey : String,
    email : String,
    password : String,
    token : String,
    balance : Number,
    listTransaction : Array ([{
        indexBlock : Number,
        indexTransaction : Number
    }])
})
export const User : mongoose.Model<users> = mongoose.model<users>('user',schema)