
import * as passportFacebook_1 from 'passport-facebook';
let passportFacebook = passportFacebook_1.Strategy;
import faceAuth = require('../model/face');
import user = require('../model/user');
let User = user.User;
export class FaceLogin {
     constructor(){};
    public faceProcess = function(passport){
        passport.use('facelogin', new passportFacebook({
            clientID : faceAuth.clientID,
            clientSecret : faceAuth.clientSecret,
            callbackURL : faceAuth.callbackURL,
            profileFields: ['id','displayName','email','first_name','last_name','middle_name']
        },function(token, refreshToken, profile,done){
            process.nextTick(function(){
                User.findOne({'facebook.id': profile.id}, function(err, result){
                    if (err){
                        console.log('err when get data in login_with_face.js'+err);
                        return done(err);
                    };
                    if (result){
                        return done(null, result)
                    }else{
                        var user = new User();
                        user.facebook.id = profile.id;
                        user.facebook.token = token;
                        user.facebook.email = profile.email;
                        user.facebook.name = profile.displayName;
    
                        user.save(function(err){
                            if (err){
                                console.log('save data error in login_with_face.js'+err);
                                return done(err);
                            };
                            return done(null, user);
                        }); 
                    }
    
                })
            })
    
        }
        
        ))
    }
    
        
}

