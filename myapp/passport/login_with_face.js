"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var passportFacebook_1 = require("passport-facebook");
var passportFacebook = passportFacebook_1.Strategy;
var faceAuth = require("../model/face");
var user = require("../model/user");
var User = user.User;
var FaceLogin = /** @class */ (function () {
    function FaceLogin() {
        this.faceProcess = function (passport) {
            passport.use('facelogin', new passportFacebook({
                clientID: faceAuth.clientID,
                clientSecret: faceAuth.clientSecret,
                callbackURL: faceAuth.callbackURL,
                profileFields: ['id', 'displayName', 'email', 'first_name', 'last_name', 'middle_name']
            }, function (token, refreshToken, profile, done) {
                process.nextTick(function () {
                    User.findOne({ 'facebook.id': profile.id }, function (err, result) {
                        if (err) {
                            console.log('err when get data in login_with_face.js' + err);
                            return done(err);
                        }
                        ;
                        if (result) {
                            return done(null, result);
                        }
                        else {
                            var user = new User();
                            user.facebook.id = profile.id;
                            user.facebook.token = token;
                            user.facebook.email = profile.email;
                            user.facebook.name = profile.displayName;
                            user.save(function (err) {
                                if (err) {
                                    console.log('save data error in login_with_face.js' + err);
                                    return done(err);
                                }
                                ;
                                return done(null, user);
                            });
                        }
                    });
                });
            }));
        };
    }
    ;
    return FaceLogin;
}());
exports.FaceLogin = FaceLogin;
