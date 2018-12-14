"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
exports.schema = new mongoose.Schema({
    username: String,
    address: String,
    privatekey: String,
    puiblickey: String,
    email: String,
    password: String,
    token: String,
    balance: Number,
    listTransaction: Array([{
            indexBlock: Number,
            indexTransaction: Number
        }])
});
exports.User = mongoose.model('user', exports.schema);
