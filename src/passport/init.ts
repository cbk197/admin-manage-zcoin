import login = require('./login');
let loginregular = new login.Login();

import Signup= require('./signup');
let signup = new Signup.Signup(); 
import loginface = require('./login_with_face');
import * as Passport from 'passport/index'
import logingoogle = require('./login_with_google');
import user = require('../model/user');
let User = user.User;
export = class {
    constructor() {}
    public Id;
    public initPassport= function(passport : Passport.PassportStatic){
        console.log(passport.session.arguments);
        passport.serializeUser(function(user: any, done) {
            console.log('serializing user: ');
            console.log(user);
            
            done(null, user._id);
        });
    

        passport.deserializeUser(function(id, done) {
            
            User.findById(id, function(err, user) {
                console.log('deserializing user:',user); 
                done(err, user);
            });
        });
        
        loginregular.loginProcess(passport);
        
        let loginface_1 = new loginface.FaceLogin();
        loginface_1.faceProcess(passport);
        let logingoogle_1 = new logingoogle.LoginGoogle();
        logingoogle_1.googleProcess(passport);
        signup.signupProcess(passport);
    }
    
}