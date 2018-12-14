import * as Local from 'passport-local';
import LocalStrategy = Local.Strategy;
import user = require('../model/admin');
let User = user.User;
import bCrypt = require('bcrypt-nodejs');
import * as passport from 'passport';
import mongoose = require('mongoose');
import dbConfig = require('../db');
mongoose.connect(dbConfig.url); 
const Web3 = require("web3");

const web3 = new Web3("http://localhost:8545");


export class Signup{
    constructor(){};
    public signupProcess = function(passport){
    
    passport.use('signup',new LocalStrategy({
        passReqToCallback : true
    },
    function(req,username, password, done){
        
        User.findOne({'local.name':username}, function(err, resuilt){
            if (err)  {
                console.log('error find username');
                return done(err);
            }
            if(resuilt){
                console.log('user existed');
                return done(null, false, req.flash('massage',"user is existed"));
            }else{
                var newUser = new User();
                var account = web3.eth.accounts.create();
                
                newUser.username = username;
                newUser.password = createHash(password);
                newUser.email = req.body.email;
                newUser.balance = 0;
                
                newUser.privatekey= account.privateKey;
                newUser.address = account.address;
                newUser.publickey = account.publicKey;
                newUser.token = "this is token";
                
                

                newUser.save(function(err){
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
    }
    ));
    let createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }
}
}