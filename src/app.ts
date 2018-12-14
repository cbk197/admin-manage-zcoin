import * as createError from 'http-errors';
import * as express from 'express';
import * as path from 'path';
import * as cookieParser from 'cookie-parser';
import * as logger from 'morgan';
import * as favicon from 'static-favicon';
import * as mongoose from 'mongoose';
import * as flash from 'connect-flash';

import user = require('./routes/users');
let usersRouter = new user();
import initPassport_1 = require('./passport/init');
let initPassport = new initPassport_1();
import * as dbConfig from './db';
import * as passport from 'passport';
import * as expressSession from 'express-session';
import  index = require('./routes/index.js');
let indexRouter = new index();


mongoose.connect(dbConfig.url,{
  
  useNewUrlParser: true
});
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

// User.find({},function(err, result){
//   if(!err) console.log(result);
// });

export class App {

public app : express.Application;
constructor(){
  this.app = express();
  this.configApp(this.app);
  
}
 private configApp(app : express.Application){
  app.set('views', path.join('./', 'views'));
  app.set('view engine', 'ejs');
  
  
  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join('./', 'public')));
  app.use(favicon()); 
  
  app.use(expressSession({secret: 'mySecretKey',
      resave: true,
      saveUninitialized: true,
      
    }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());
  initPassport.initPassport(passport);
  indexRouter.routerIndex(passport);
  usersRouter.adminRouter(passport);
  app.use('/',indexRouter.router );
  app.use('/admin', usersRouter.router);
  
  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    next(createError(404));
  });
  
  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });
 }


// view engine setup

}
