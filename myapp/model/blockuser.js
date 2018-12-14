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
    listTransaction: [{
            indexBlock: Number,
            indexTransaction: Number
        }]
});
exports.blockUser = mongoose.model('blockUser', exports.schema);
