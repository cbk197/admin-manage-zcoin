"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var google = require("passport-google-oauth");
var googleStrategy = google.OAuth2Strategy;
var googleAuth = require("../model/google");
var user = require("../model/user");
var User = user.User;
var LoginGoogle = /** @class */ (function () {
    function LoginGoogle() {
        this.googleProcess = function (passport) {
            passport.use('googlelogin', new googleStrategy({
                clientID: googleAuth.clientID,
                clientSecret: googleAuth.clientSecret,
                callbackURL: googleAuth.callbackURL,
                profileFields: ['id', 'displayName', 'email', 'first_name', 'last_name', 'middle_name']
            }, function (token, refreshtoken, profile, done) {
                process.nextTick(function () {
                    User.findOne({ 'google.id': profile.id }, function (err, result) {
                        if (err) {
                            console.log('err in findOne google user' + err);
                            return done(err);
                        }
                        ;
                        if (result) {
                            return done(null, result);
                        }
                        else {
                            var newuser = new User();
                            newuser.google.id = profile.id;
                            newuser.google.token = token;
                            newuser.google.name = profile.displayName;
                            newuser.google.email = profile.emails[0].value;
                            newuser.save(function (err) {
                                if (err) {
                                    console.log('err when save datauser google in login_with_google.js' + err);
                                    return done(err);
                                }
                                return done(null, newuser);
                            });
                        }
                    });
                });
            }));
        };
    }
    ;
    return LoginGoogle;
}());
exports.LoginGoogle = LoginGoogle;
