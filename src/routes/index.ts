import * as express from 'express';
import * as  passport from 'passport';



 export = class {
  public router = express.Router();
  constructor(){};
  public routerIndex = function(passport : passport.PassportStatic){
    
this.router.get('/', function(req, res, next) {
  res.render('index', {});
});



this.router.get('/login', function(req, res){
  res.render('login',{});
});

this.router.get('/logingoogle', passport.authenticate('googlelogin',{
  scope: ['profile', 'email'],
  
}));
this.router.get('/logingoogle/callback', passport.authenticate('googlelogin',{
  
    successRedirect: '/home',
		failureRedirect: '/login',
    failureFlash : true
}));


this.router.get('/loginface',passport.authenticate('facelogin',{
  successRedirect: '/home',
		failureRedirect: '/login',
    failureFlash : true
}))


this.router.post('/login',passport.authenticate('login',{
    successRedirect: '/home',
		failureRedirect: '/login',
    failureFlash : true
} ))

this.router.get('/signup', function(req, res){
  res.render('register',{});
});

// router.post('/signup', function(req,res,next){
//   console.log(req.body);
//    res.redirect('/home');
// })

this.router.post('/signup', passport.authenticate('signup', {
  
  successRedirect: '/home',
  failureRedirect: '/signup',
  failureFlash : true
}));

this.router.get('/signout', function(req, res) {
  req.logout();
  res.redirect('/');
});

this.router.get('/home', this.isAuthenticated, function(req, res){
  res.render('home',{});
});






  }
  public isAuthenticated = function( req, res, next){
    if (req.isAuthenticated()){
      return next();
    }
     res.redirect('/');
  }

}

