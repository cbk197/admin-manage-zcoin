import * as mongoose from 'mongoose';

export interface user extends mongoose.Document{
    local            : {
        name         : string,
        email        : string,
        password     : string,
        address : string,
        privatekey : String
    },
    facebook         : {
        id           : string,
        token        : string,
        email        : string,
        name         : string
    },
    google: {
        id : string,
        token : string,
        email : string,
        name : string
    }
}

export let schema = new mongoose.Schema({
    local            : {
        name         : String,
        email        : String,
        password     : String,
        address : String,
        privatekey : String
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    google: {
        id : String,
        token : String,
        email : String,
        name : String
    }
})

export const User : mongoose.Model<user> = mongoose.model<user>('User',schema)