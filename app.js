const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const fileUpload = require('express-fileupload');
const path = require('path');
// const compass = require('node-compass');
const cookieParser = require('cookie-parser');
const logger = require('morgan'); //This outputs the path of requests in console.
const categoryInitializer = require('./src/middleware/category');
const cartItemCount = require('./src/middleware/cart');

const indexRouter = require('./src/routes/index');
const userRouter = require('./src/routes/user');
const adminRouter = require('./src/routes/admin');
const categoryRouter = require('./src/routes/category');
const cartRouter = require('./src/routes/cart');

const config = require('./src/config');

const helpers = require('./src/helpers');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
//initialize an express-handlebar engine.
app.engine('.hbs', exphbs({extname: '.hbs', helpers: helpers}));
app.set('view engine', '.hbs');
//This is how we initialize the express-session library
app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));
//we use this to log the paths being accessed in our application.
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// removing compass, I decided not to use this afterall.
// app.use(compass({ mode: 'expanded' }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload({
  useTempFiles: true,
  preserveExtension: true,
  tempFileDir: config.app.tempFilePath
}));
//Always get the categories on any request.
app.use(categoryInitializer);
app.use(cartItemCount);
app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/admin', adminRouter);
app.use('/category', categoryRouter);
app.use('/cart', cartRouter);

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

module.exports = app;
