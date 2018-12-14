"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var favicon = require("static-favicon");
var mongoose = require("mongoose");
var flash = require("connect-flash");
var user = require("./routes/users");
var usersRouter = new user();
var initPassport_1 = require("./passport/init");
var initPassport = new initPassport_1();
var dbConfig = require("./db");
var passport = require("passport");
var expressSession = require("express-session");
var index = require("./routes/index.js");
var indexRouter = new index();
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
});
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
// User.find({},function(err, result){
//   if(!err) console.log(result);
// });
var App = /** @class */ (function () {
    function App() {
        this.app = express();
        this.configApp(this.app);
    }
    App.prototype.configApp = function (app) {
        app.set('views', path.join('./', 'views'));
        app.set('view engine', 'ejs');
        app.use(logger('dev'));
        app.use(express.json());
        app.use(express.urlencoded({ extended: false }));
        app.use(cookieParser());
        app.use(express.static(path.join('./', 'public')));
        app.use(favicon());
        app.use(expressSession({ secret: 'mySecretKey',
            resave: true,
            saveUninitialized: true,
        }));
        app.use(passport.initialize());
        app.use(passport.session());
        app.use(flash());
        initPassport.initPassport(passport);
        indexRouter.routerIndex(passport);
        usersRouter.adminRouter(passport);
        app.use('/', indexRouter.router);
        app.use('/admin', usersRouter.router);
        // catch 404 and forward to error handler
        app.use(function (req, res, next) {
            next(createError(404));
        });
        // error handler
        app.use(function (err, req, res, next) {
            // set locals, only providing error in development
            res.locals.message = err.message;
            res.locals.error = req.app.get('env') === 'development' ? err : {};
            // render the error page
            res.status(err.status || 500);
            res.render('error');
        });
    };
    return App;
}());
exports.App = App;
