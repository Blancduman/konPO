const express = require('express'),
      path = require('path'),
      mongoose = require('mongoose'),
      bodyParser = require('body-parser'),
      cookieParser = require('cookie-parser'),
      config = require('./config');

const flash = require('connect-flash'),
      passport = require('passport'),
      session = require('express-session'),
      MongoStore = require('connect-mongo')(session);

mongoose.Promise = global.Promise;
mongoose.connect(config.database, {useNewUrlParser: true});
require('./models/User');
require('./models/UserToken');

const index = require('./routes/index'),
      tokenReq = require('./routes/usertoken'),
      student = require('./routes/student');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: config.secret,
  key: 'keys',
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: null
  },
  saveUninitialized: false,
  resave: false,
  store: new MongoStore({mongooseConnection: mongoose.connection})
}));
app.use(flash());

require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());

app.use('*', tokenReq);
app.use('/', index);
app.use('/student', student)

app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.listen(3000, () => console.log('Port 3000'));

