"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
exports.schema = new mongoose.Schema({
    local: {
        name: String,
        email: String,
        password: String,
        address: String,
        privatekey: String
    },
    facebook: {
        id: String,
        token: String,
        email: String,
        name: String
    },
    google: {
        id: String,
        token: String,
        email: String,
        name: String
    }
});
exports.User = mongoose.model('User', exports.schema);
