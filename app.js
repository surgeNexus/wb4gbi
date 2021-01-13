const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  passport = require('passport'),
  LocalStrategy = require('passport-local'),
  methodOverride = require('method-override'),
  flash = require('connect-flash'),
  User = require('./models/User'),
  Repeater = require('./models/Repeater'),
  fileUpload = require('express-fileupload');

var dotenv = require('dotenv');
dotenv.config();

//requring routes
const indexRoutes = require('./routes/index');
const repeaterRoutes = require('./routes/repeaters');
const manageRoutes = require('./routes/manage');
const authRoutes = require('./routes/auth');
const articleRoutes = require('./routes/article');
const aupRoutes = require('./routes/aup');
const aboutRoutes = require('./routes/about');
const historyRoutes = require('./routes/history');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.MONGODB);

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());
// PASSPORT CONFIGURATION
app.use(
  require('express-session')({
    secret: 'Once again Star wins cutest dog!',
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(fileUpload());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

app.use(indexRoutes);
app.use('/repeater', repeaterRoutes);
app.use('/manage', manageRoutes);
app.use('/auth', authRoutes);
app.use('/article', articleRoutes);
app.use('/aup', aupRoutes);
app.use('/about', aboutRoutes);
app.use('/history', historyRoutes);

app.listen(process.env.PORT, () => {
  console.log('The WB4GBI server is running on port ' + process.env.PORT);
});
