"use strict";
var login = require("./login");
var loginregular = new login.Login();
var Signup = require("./signup");
var signup = new Signup.Signup();
var loginface = require("./login_with_face");
var logingoogle = require("./login_with_google");
var user = require("../model/user");
var User = user.User;
module.exports = /** @class */ (function () {
    function class_1() {
        this.initPassport = function (passport) {
            console.log(passport.session.arguments);
            passport.serializeUser(function (user, done) {
                console.log('serializing user: ');
                console.log(user);
                done(null, user._id);
            });
            passport.deserializeUser(function (id, done) {
                User.findById(id, function (err, user) {
                    console.log('deserializing user:', user);
                    done(err, user);
                });
            });
            loginregular.loginProcess(passport);
            var loginface_1 = new loginface.FaceLogin();
            loginface_1.faceProcess(passport);
            var logingoogle_1 = new logingoogle.LoginGoogle();
            logingoogle_1.googleProcess(passport);
            signup.signupProcess(passport);
        };
    }
    return class_1;
}());
