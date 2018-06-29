require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
// require session package
const session     = require("express-session");
const MongoStore  = require("connect-mongo")(session);
const passportSetup = require("./passport/setup.js");
const flash = require("connect-flash");


mongoose.Promise = Promise;
mongoose
  .connect('mongodb://localhost/express-users', {useMongoClient: true})
  .then(() => {
    console.log('Connected to Mongo!')
  }).catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup
app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));

//设置partials
hbs.registerPartials(__dirname + "/views/partials");
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// 设置session
app.use(session({
  secret: "secret should be different for every app",
  saveUninitialized: true,
  resave: true,
  store: new MongoStore({ mongooseConnection: mongoose.connection})
}));
//用connect-flash来显示messages
app.use(flash());


//设置passport, this must come after session setup
passportSetup(app);


// default value for title local
app.locals.title = 'Basic authorization';

const index = require('./routes/index');
app.use('/', index);


// Connect auth-router.js here
const authRouter = require("./routes/auth-router.js");
app.use("/", authRouter);

// Connect room-router.js here
const roomRouter = require("./routes/room-router.js");
app.use("/", roomRouter);

// Connect admin-router.js here
const adminRouter = require("./routes/admin-router.js");
app.use("/", adminRouter);

module.exports = app;