const express = require('express'),
      path = require('path'),
      mongoose = require('mongoose'),
      bodyParser = require('body-parser'),
      cookieParser = require('cookie-parser'),
      config = require('./config'),
      expressValidator = require('express-validator');

const flash = require('connect-flash'),
      passport = require('passport'),
      session = require('express-session'),
      MongoStore = require('connect-mongo')(session);

mongoose.Promise = global.Promise;
mongoose.connect(config.database, {useNewUrlParser: true});
require('./models/User');
require('./models/UserToken');
require('./models/Repository');
require('./models/Section');
require('./models/Task');
require('./models/Message');

const index = require('./routes/index'),
      tokenReq = require('./routes/usertoken'),
      student = require('./routes/student'),
      teacher = require('./routes/teacher'),
      admin = require('./routes/admin');

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
    maxAge: 1000
  },
  saveUninitialized: false,
  resave: false,
  store: new MongoStore({mongooseConnection: mongoose.connection})
}));
app.use(flash());

require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

app.use('*', tokenReq);
app.use('/', index);
app.use('/student', student);
app.use('/teacher', teacher);
app.use('/admin', admin);

app.listen(3000, () => console.log('Port 3000'));

