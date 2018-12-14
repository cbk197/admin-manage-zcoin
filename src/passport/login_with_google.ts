import * as google from 'passport-google-oauth';
let googleStrategy = google.OAuth2Strategy;

import googleAuth = require('../model/google');
import user = require('../model/user');
let User = user.User;
export class LoginGoogle {
    constructor(){};
    public googleProcess = function(passport){
    passport.use('googlelogin', new googleStrategy({
        clientID : googleAuth.clientID,
        clientSecret : googleAuth.clientSecret,
        callbackURL : googleAuth.callbackURL,
        profileFields: ['id','displayName','email','first_name','last_name','middle_name']
    

    },
        function(token, refreshtoken,profile,done){
            process.nextTick(function(){
            User.findOne({'google.id': profile.id}, function(err, result){
                if (err){
                    console.log('err in findOne google user'  + err);
                    return done(err);
                };
                if (result){
                    return done(null, result);
                }else{
                    var newuser = new User();
                    newuser.google.id = profile.id;
                    newuser.google.token = token;
                    newuser.google.name = profile.displayName;
                    newuser.google.email = profile.emails[0].value;

                    newuser.save(function(err){
                        if(err) {
                            console.log('err when save datauser google in login_with_google.js'+ err);
                            return done(err);
                        }
                        return done(null,newuser);
                    })
                }
            })
        });
        }
    
    ))
}
    
}

