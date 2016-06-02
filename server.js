//DEPENDENCIES 
var fs = require('fs');
var express  = require('express');
var passport = require('passport');
var mongoose = require('mongoose');
var flash    = require('connect-flash');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var methodOverride = require('method-override');
var session      = require('express-session');
var models   = require('./models/models');
var app      = express();
var configDB = require('./config/database');
//HEADERS

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database
require('./config/passport')(passport); // pass passport for configuration
app.use(express.static("static")); // sets standard files things. i.e /public/imgs will be /imgs
app.use('/bower_components', express.static("bower_components")); // sets standard files things. i.e /public/imgs will be /imgs

    app.use(morgan('dev')); // log every request to the console
    app.use(cookieParser()); // read cookies (needed for auth)
    app.use(bodyParser.json()); // get information from html forms
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
    app.use(methodOverride());

    app.set('view engine', 'ejs'); // set up ejs for templating

    // required for passport
    app.use(session({ secret: 'w0qkASIDJ9aoskdsad020' })); // session secret
    app.use(passport.initialize());
    app.use(passport.session()); // persistent login sessions
    app.use(flash()); // use connect-flash for flash messages storedn session

// routes ======================================================================
app.get('/', function(req, res){ // index + home page
    models.Notification.find({}, function(err, notifications) {
    var notificationMap = [];
        for (var i = 0; i < notifications.length; i++){
            notificationMap[i] = notifications[i];
        }
    if (req.user){
    res.render('index.ejs', {welcome: req.user.username, notifications: notificationMap});  
    }
    else {
    res.render('index.ejs', {notifications: notificationMap});
    }
    });
});

    // get clues page
app.get('/clues', function(req, res){ // should pull the list of clues for this team
    res.send("clues");
});

app.get('/adminBoard', function(req, res){
    res.render('adminboard.ejs');
});

app.post('/addNotification', function(req, res){
    console.log(req.body);
    var newNotification = new models.Notification();
    newNotification.title = req.body.title;
    newNotification.date = req.body.date;
    newNotification.text = req.body.text;
    newNotification.save(function(err){
        console.log(newNotification);
    });
    res.redirect('/');
});

app.get('/adminLogin', function(req, res){
    res.render('adminLogin.ejs', { message: req.flash('loginMessage') }); 
});

app.get('/login', function(req, res) {
     // render the page and pass in any flash data if it exists
    res.render('login.ejs', { message: req.flash('loginMessage') });
});
    // process the login form
app.post('/loginAdmin', passport.authenticate('adminLogin', {
    successRedirect : '/', // redirect to the secure profilnodee section
    failureRedirect : '/adminLogin', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));
app.post('/loginTeam', passport.authenticate('teamLogin', {
    successRedirect : '/', // redirect to the secure profilnodee section
    failureRedirect : '/login', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));

app.get('/adminRegister', function(req, res) {
     // render the page and pass in any flash data if it exists
    res.render('adminRegister.ejs', { message: req.flash('signupMessage') });
});
app.get('/register', function(req, res) {
     // render the page and pass in any flash data if it exists
    res.render('register.ejs', { message: req.flash('signupMessage') });
});
// process the signup form
app.post('/registerAdmin', passport.authenticate('adminSignup', {
    successRedirect : '/', // redirect to the secure profile section
    failureRedirect : '/adminRegister', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
 }));

app.post('/registerTeam', passport.authenticate('teamSignup', {
    successRedirect : '/', // redirect to the secure profile section
    failureRedirect : '/register', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
 }));

app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
// launch ======================================================================
app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});