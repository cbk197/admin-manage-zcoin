"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Local = require("passport-local");
var LocalStrategy = Local.Strategy;
var user = require("../model/admin");
var User = user.User;
var bCrypt = require("bcrypt-nodejs");
var mongoose = require("mongoose");
var dbConfig = require("../db");
mongoose.connect(dbConfig.url);
var Web3 = require("web3");
var web3 = new Web3("http://localhost:8545");
var Signup = /** @class */ (function () {
    function Signup() {
        this.signupProcess = function (passport) {
            passport.use('signup', new LocalStrategy({
                passReqToCallback: true
            }, function (req, username, password, done) {
                User.findOne({ 'local.name': username }, function (err, resuilt) {
                    if (err) {
                        console.log('error find username');
                        return done(err);
                    }
                    if (resuilt) {
                        console.log('user existed');
                        return done(null, false, req.flash('massage', "user is existed"));
                    }
                    else {
                        var newUser = new User();
                        var account = web3.eth.accounts.create();
                        newUser.username = username;
                        newUser.password = createHash(password);
                        newUser.email = req.body.email;
                        newUser.balance = 0;
                        newUser.privatekey = account.privateKey;
                        newUser.address = account.address;
                        newUser.publickey = account.publicKey;
                        newUser.token = "this is token";
                        newUser.save(function (err) {
                            if (err) {
                                console.log('erro save data');
                                throw err;
                            }
                            console.log('success');
                            return done(null, newUser);
                        });
                    }
                });
                // process.nextTick(findOrCreateUser);
            }));
            var createHash = function (password) {
                return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
            };
        };
    }
    ;
    return Signup;
}());
exports.Signup = Signup;
