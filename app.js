const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const auth = require('./auth');
const nunjucks  = require('nunjucks');
const mongoose = require('mongoose');
var xssFilter = require('x-xss-protection');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);


var indexRouter = require('./routes/index');
var api = require('./routes/api');
var todo = require('./routes/Todo');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));

nunjucks.configure('views', {
    autoescape: true,
    cache: false,
    express   : app
});

// mongoose setup
let mongoDBUrl = process.env.OPENSHIFT_MONGODB_DB_URL + process.env.OPENSHIFT_APP_NAME;
console.log(process.env.MONGODB_USER);
console.log("Ahoj jak se mas?");
mongoose.connect(mongoDBUrl);
mongoose.Promise = global.Promise;

let db = mongoose.connection;

// use sessions for tracking logins
app.use(session({
    secret: 'hard working student',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: db
    })
}));

// register session in templates
app.use(function(req,res,next){
    res.locals.session = req.session;
    next();
});

// middleware from generator
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(xssFilter());

app.all('/todo/*',auth.requiresLogin);
// plug the routes
app.use('/', indexRouter);
app.use('/todo', todo);
app.use('/api', api);


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
    //res.redirect('/');
    res.render('error.html');
});

module.exports = app;
