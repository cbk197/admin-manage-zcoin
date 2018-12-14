import * as Local from 'passport-local';
let LocalStrategy= Local.Strategy;
import user = require('../model/admin');
var User = user.User;
import * as Bcrypt from 'bcrypt-nodejs';
import * as mongoose from 'mongoose';
import dbConfig = require('../db');

mongoose.connect(dbConfig.url);

export class Login{
    constructor(){};
    public loginProcess = function(passport){
    passport.use('login',new LocalStrategy({
        passReqToCallback : true
    },
    function(req, username, password, done){
        
        User.findOne({'username': username },function(err, resuilt){
            console.log(resuilt);
            if (err) {
                console.log('line 12 in login.js');
                return done(err) ;
            }
            if (!resuilt) {
                console.log("not found user");
                return done(null, false, req.flash('message', 'user not found'));
            }
            if (!isValidPass(resuilt, password)) {
                console.log("password invalid");
                return done(null, false, req.flash('massage','pass is invalid'));
            }

            return done(null, resuilt);

        })
    }
    ));

    let isValidPass =  function(user,pass){
        return Bcrypt.compareSync(pass, user.password);
    }
}
}