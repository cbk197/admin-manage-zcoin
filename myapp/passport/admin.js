"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Local = require("passport-local");
var LocalStrategy = Local.Strategy;
var User = require("../model/user");
var mongoose = require("mongoose");
var dbConfig = require("../db");
mongoose.connect(dbConfig.url);
var Admin = /** @class */ (function () {
    function Admin() {
        this.adminProcess = function (passport) {
            passport.use('admin', new LocalStrategy({
                passReqToCallback: true
            }, function (req, username, password, done) {
                console.log('++++++++++++++++ admin');
                User.findOne({ 'local.name': username }, function (err, resuilt) {
                    console.log('admin +++++++++++++++++ admin');
                    console.log(resuilt);
                    if (err) {
                        console.log('line 12 in login.js');
                        return done(err);
                    }
                    if (resuilt.local.name == 'admin') {
                        return done(null, resuilt);
                    }
                    else {
                        return done(null, false, req.flash('message', 'user not admin'));
                    }
                });
            }));
        };
    }
    ;
    return Admin;
}());
exports.Admin = Admin;
