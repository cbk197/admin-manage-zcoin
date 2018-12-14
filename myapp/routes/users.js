"use strict";
var express = require("express");
var user_1 = require("../model/user");
var User1 = user_1.User;
var user_2 = require("../model/admin");
var User = user_2.User;
var blockuser = require("../model/blockuser");
var blockUser = blockuser.blockUser;
var bCrypt = require("bcrypt-nodejs");
var Web3 = require("web3");
var web3 = new Web3("http://localhost:8545");
var web32 = new Web3(new Web3.providers.WebsocketProvider("ws:127.0.0.1:8546"));
var Tx = require("ethereumjs-tx");
//encryptor password
var createHash = function (password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};
module.exports = /** @class */ (function () {
    function class_1() {
        this.count = 0;
        this.router = express.Router();
        this.deleteUser = function (id, usr, asyn) {
            var thiz = this;
            usr.findById({ _id: id }, function (err, result) {
                if (err) {
                    console.log("error occured when deleteuser : ", err);
                }
                else {
                    console.log("user delete : ", result);
                    var balance_1;
                    web3.eth.getBalance(result.address, function (err, res) {
                        if (!err) {
                            balance_1 = parseInt(res);
                            if (balance_1 > 0) {
                                web3.eth.getTransactionCount(result.address).then(function (txCount) {
                                    // construct the transaction data
                                    var txData = {
                                        nonce: web3.utils.toHex(txCount),
                                        gasLimit: web3.utils.toHex(25000),
                                        gasPrice: web3.utils.toHex(1),
                                        to: "0xd01ef7428FbfCce1f3c8FC8bE9031205ab961eAa",
                                        from: result.address,
                                        value: balance_1 - 25000
                                    };
                                    // send transaction signed
                                    thiz.sendSigned(txData, result.privatekey, function (err, result) {
                                        if (err)
                                            return console.log("error", err);
                                        asyn++;
                                        console.log("sent transaction signed ", result);
                                    });
                                });
                            }
                            else {
                                asyn++;
                            }
                        }
                        else {
                            console.log("error occured : ", err);
                        }
                    });
                }
            });
        };
        //sign transaction
        this.sendSigned = function (txData, privatekey, cb) {
            var privateKey = new Buffer(privatekey.substring(2, 66), "hex");
            var transaction = new Tx(txData);
            transaction.sign(privateKey);
            var serializedTx = transaction.serialize().toString("hex");
            web3.eth.sendSignedTransaction("0x" + serializedTx, cb);
        };
        this.getInfor = function () {
            web32.eth.subscribe("newBlockHeaders", function (error, result) {
                if (!error) {
                    web3.eth.getBlock(result.number, true, function (err, result1) {
                        if (err) {
                            console.log("error occured when getblock with blocknumber get from subscribe function : ", err);
                        }
                        else {
                            for (var i = 0; i < result1.transactions.length; i++) {
                                User.updateMany({
                                    address: {
                                        $in: [
                                            result1.transactions[i].from,
                                            result1.transactions[i].to
                                        ]
                                    }
                                }, {
                                    $push: {
                                        listTransaction: {
                                            indexBlock: result.number,
                                            indexTransaction: i
                                        }
                                    }
                                }, function (err, result2) {
                                    if (err) {
                                        console.log("error occeured when save history transaction from block :  ", result.number, err);
                                    }
                                    else {
                                        console.log("history transaction save success : ", result2);
                                    }
                                });
                                blockUser.updateMany({
                                    address: {
                                        $in: [
                                            result1.transactions[i].from,
                                            result1.transactions[i].to
                                        ]
                                    }
                                }, {
                                    $push: {
                                        listTransaction: {
                                            indexBlock: result.number,
                                            indexTransaction: i
                                        }
                                    }
                                }, function (err, result2) {
                                    if (err) {
                                        console.log("error occeured when save history transaction from block :  ", result.number, err);
                                    }
                                    else {
                                        console.log("history transaction save success : ", result2);
                                    }
                                });
                            }
                        }
                    });
                }
                else {
                    console.error("subs error ++++++++", error);
                }
            });
        };
        this.getInfor();
    }
    class_1.prototype.adminRouter = function (passport) {
        var thiz = this;
        this.router.get("/", function (req, res, next) {
            if (req.isAuthenticated(req, res, next)) {
                User.findOne({ _id: req.user.id }, function (err, doc) {
                    if (err) {
                        res.render("login_admin", {});
                    }
                    else {
                        if (doc.username == "admin") {
                            res.redirect("admin/admin2");
                        }
                        else {
                            res.render("login_admin", {});
                        }
                    }
                });
            }
            else {
                res.render("login_admin", {});
            }
        });
        //send list transaction of latest block
        this.router.get("/latestblock", function (req, res, next) {
            web3.eth.getBlock(214, true, function (err, result) {
                if (err) {
                    console.log("error get block data", err);
                    res.sendStatus(400);
                }
                else {
                    console.log(result);
                    res.send(result.transactions);
                }
            });
        });
        this.router.post("/login", passport.authenticate("login", {
            successRedirect: "/admin/admin2",
            failureRedirect: "/admin",
            failureFlash: true
        }));
        this.router.get("/admin2", this.isAuthenticated, function (req, res) {
            res.render("adminhome", {});
        });
        this.router.get("/lognout", function (req, res) {
            req.logout();
            res.redirect("/");
        });
        this.router.get("/user", this.isAuthenticated, function (req, res) {
            res.render("manage_user", {});
        });
        this.router.post("/listuser", this.isAuthenticated, function (req, res) {
            console.log("req body : ", req.body.index);
            User.find({}, function (err, result) {
                if (err) {
                    res.sendStatus(500);
                }
                else {
                    var result_1 = [];
                    if (result.length < req.body.index + 10) {
                        for (var i = req.body.index; i < result.length; i++) {
                            result_1.push(result[i]);
                        }
                    }
                    else {
                        for (var i = 0; i < 10; i++) {
                            result_1.push(result[req.body.index + i]);
                        }
                    }
                    res.send(result_1);
                }
            });
        });
        //get list blockuser
        this.router.post("/listblockuser", this.isAuthenticated, function (req, res) {
            console.log("req body : ", req.body.index);
            blockUser.find({}, function (err, result) {
                if (err) {
                    res.sendStatus(500);
                }
                else {
                    var result_1 = [];
                    if (result.length < req.body.index + 10) {
                        for (var i = req.body.index; i < result.length; i++) {
                            result_1.push(result[i]);
                        }
                    }
                    else {
                        for (var i = 0; i < 10; i++) {
                            result_1.push(result[req.body.index + i]);
                        }
                    }
                    res.send(result_1);
                }
            });
        });
        // update infor one user
        this.router.put("/update", this.isAuthenticated, function (req, res) {
            if (req.query.password.length >= 6) {
                var pass = createHash(req.query.password);
                User.findByIdAndUpdate({ _id: req.query.ID }, {
                    username: req.query.username,
                    password: pass
                }, function (err, doc) {
                    if (err) {
                        console.log("update data error ");
                        res.sendStatus(400);
                    }
                    else {
                        console.log("update sucess", doc);
                        res.sendStatus(200);
                    }
                });
            }
            else {
                User.findByIdAndUpdate({ _id: req.query.ID }, {
                    $set: {
                        username: req.query.username
                    }
                }, function (err, doc) {
                    if (err) {
                        console.log("update data error ");
                        res.sendStatus(400);
                    }
                    else {
                        console.log("update sucess not with pass");
                        res.sendStatus(200);
                    }
                });
            }
        });
        // delete user
        this.router.put("/user/delete", this.isAuthenticated, function (req, res) {
            User.findById({ _id: req.query.ID }, function (err, doc) {
                if (err) {
                    console.log("error occured when delete user : ", err);
                }
                else {
                    if (doc != null) {
                        var asyn = 0;
                        thiz.deleteUser(req.query.ID, User, asyn);
                        User.findById({ _id: req.query.ID }, function (err, doc) {
                            if (err) {
                                console.log("delete error");
                                res.sendStatus(500);
                            }
                            else {
                                console.log("delete sucess", doc);
                                res.sendStatus(200);
                            }
                        });
                    }
                    else {
                        var asyn = 0;
                        thiz.deleteUser(req.query.ID, blockUser, asyn);
                        blockUser.findById({ _id: req.query.ID }, function (err, doc1) {
                            if (err) {
                                console.log("delete error");
                                res.sendStatus(500);
                            }
                            else {
                                console.log("deleted  user : ", doc1);
                                res.sendStatus(200);
                            }
                        });
                    }
                }
            });
        });
        //block one user
        this.router.put("/user/block", this.isAuthenticated, function (req, res) {
            User.findOneAndRemove({ _id: req.query.ID }, function (err, result) {
                if (err) {
                    console.log("error occured when block user : ", err);
                    res.sendStatus(500);
                }
                else {
                    var acc = new blockUser();
                    acc.username = result.username;
                    acc.address = result.address;
                    acc.balance = result.balance;
                    acc.email = result.email;
                    acc.password = result.password;
                    acc.privatekey = result.privatekey;
                    acc.token = result.token;
                    acc.listTransaction = result.listTransaction;
                    acc._id = result._id;
                    acc.save(function (err) {
                        if (err) {
                            console.log("error occured when sava blockUser : ", err);
                            res.sendStatus(500);
                        }
                        else {
                            res.sendStatus(200);
                        }
                    });
                }
            });
        });
        this.router.put("/user/unlock", this.isAuthenticated, function (req, res) {
            blockUser.findByIdAndDelete({ _id: req.query.ID }, function (err, result) {
                if (err) {
                    console.log("error occured when finduser for unlock : ", err);
                    res.sendStatus(500);
                }
                else {
                    var acc = new User();
                    acc.username = result.username;
                    acc.address = result.address;
                    acc.balance = result.balance;
                    acc.email = result.email;
                    acc.password = result.password;
                    acc.privatekey = result.privatekey;
                    acc.token = result.token;
                    acc.listTransaction = result.listTransaction;
                    acc._id = result._id;
                    acc.save(function (err) {
                        if (err) {
                            console.log("error occured when sava blockUser : ", err);
                            res.sendStatus(500);
                        }
                        else {
                            res.sendStatus(200);
                        }
                    });
                }
            });
        });
        //get page send coin base
        this.router.get("/sendcoinbase", this.isAuthenticated, function (req, res) {
            res.render("sendcoinbase", {});
        });
        this.router.post("/sendcoinbase", this.isAuthenticated, function (req, res) {
            thiz.sendCoinBase(req.body.address, req.body.amount, res);
        });
        //logout
        this.router.get("/signout", function (req, res) {
            req.logout();
            res.redirect("/admin");
        });
        //get history transaction
        this.router.get("/history", this.isAuthenticated, function (req, res) {
            res.render("history", { address: req.query.address });
        });
        this.router.post("/history", this.isAuthenticated, function (req, res) {
            var asyn = 0;
            console.log("req body index and address of history, asyn  : ", req.body.index, req.body.address, asyn);
            User.findOne({ address: req.body.address }, function (err, result) {
                if (err) {
                    res.sendStatus(500);
                }
                else {
                    var result_1 = [];
                    console.log("result is : ", result);
                    if (result.listTransaction.length < req.body.index + 10) {
                        var asyn1_1 = 0;
                        if (req.body.index == result.listTransaction.length) {
                            res.send(result_1);
                        }
                        for (var i = req.body.index; i < result.listTransaction.length; i++) {
                            console.log("index : i ", i);
                            web3.eth.getTransactionFromBlock(result.listTransaction[i][0].indexBlock, result.listTransaction[i][0].indexTransaction, function (err, result2) {
                                asyn1_1++;
                                if (!err) {
                                    console.log("transaction of block history :", result2);
                                    result_1.push(result2);
                                    if (asyn1_1 ==
                                        result.listTransaction.length - req.body.index) {
                                        res.send(result_1);
                                    }
                                }
                                else {
                                    console.log("gettransactionfromblock error : ", err);
                                    if (asyn1_1 ==
                                        result.listTransaction.length - req.body.index) {
                                        res.send(result_1);
                                    }
                                }
                            });
                        }
                    }
                    else {
                        var asyn1_2 = 0;
                        for (var i = req.body.index; i < req.body.index + 10; i++) {
                            web3.eth.getTransactionFromBlock(result.listTransaction[i][0].indexBlock, result.listTransaction[i][0].indexTransaction, function (err, result2) {
                                asyn1_2++;
                                if (!err) {
                                    console.log("transaction of block history :", result2);
                                    result_1.push(result2);
                                    if (asyn1_2 == 10) {
                                        res.send(result_1);
                                    }
                                }
                                else {
                                    console.log("gettransactionfromblock error : ", err);
                                    if (asyn1_2 == 10) {
                                        res.send(result_1);
                                    }
                                }
                            });
                        }
                    }
                }
            });
        });
    };
    class_1.prototype.isAuthenticated = function (req, res, next) {
        if (req.user == undefined) {
            res.redirect("/admin");
            return;
        }
        if (req.isAuthenticated()) {
            User.findOne({ _id: req.user.id }, function (err, doc) {
                if (err) {
                    res.redirect("/admin");
                    return;
                }
                if (doc.username == "admin") {
                    return next();
                }
                else {
                    res.redirect("/admin");
                }
            });
        }
    };
    // send coinnbase
    class_1.prototype.sendCoinBase = function (address, amount, res) {
        var thiz = this;
        if (address.length == 42) {
            web3.eth
                .getTransactionCount("0xd01ef7428FbfCce1f3c8FC8bE9031205ab961eAa")
                .then(function (txCount) {
                // construct the transaction data
                var txData = {
                    nonce: web3.utils.toHex(txCount),
                    gasLimit: web3.utils.toHex(25000),
                    gasPrice: web3.utils.toHex(20e9),
                    to: address,
                    from: "0xd01ef7428FbfCce1f3c8FC8bE9031205ab961eAa",
                    value: amount
                };
                User.findOne({ address: "0xd01ef7428FbfCce1f3c8FC8bE9031205ab961eAa" }, function (err, result) {
                    if (err) {
                        console.log("error read data from database ", err);
                        res.sendStatus(400);
                    }
                    else {
                        thiz.sendSigned(txData, result.privatekey, function (err, result) {
                            if (err) {
                                console.log("error in send singed transaction ", err);
                                res.sendStatus(400);
                            }
                            else {
                                console.log("sent transaction signed ", result);
                                res.sendStatus(200);
                            }
                        });
                    }
                });
            });
        }
        else {
            res.sendStatus(400);
        }
    };
    return class_1;
}());
// function called when delete user. transfer user's balance to coinbase address
