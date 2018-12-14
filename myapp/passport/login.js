"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Local = require("passport-local");
var LocalStrategy = Local.Strategy;
var user = require("../model/admin");
var User = user.User;
var Bcrypt = require("bcrypt-nodejs");
var mongoose = require("mongoose");
var dbConfig = require("../db");
mongoose.connect(dbConfig.url);
var Login = /** @class */ (function () {
    function Login() {
        this.loginProcess = function (passport) {
            passport.use('login', new LocalStrategy({
                passReqToCallback: true
            }, function (req, username, password, done) {
                User.findOne({ 'username': username }, function (err, resuilt) {
                    console.log(resuilt);
                    if (err) {
                        console.log('line 12 in login.js');
                        return done(err);
                    }
                    if (!resuilt) {
                        console.log("not found user");
                        return done(null, false, req.flash('message', 'user not found'));
                    }
                    if (!isValidPass(resuilt, password)) {
                        console.log("password invalid");
                        return done(null, false, req.flash('massage', 'pass is invalid'));
                    }
                    return done(null, resuilt);
                });
            }));
            var isValidPass = function (user, pass) {
                return Bcrypt.compareSync(pass, user.password);
            };
        };
    }
    ;
    return Login;
}());
exports.Login = Login;
