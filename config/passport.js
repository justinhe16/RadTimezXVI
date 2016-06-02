// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;
var configAdminKey = require('./adminKey');

// load up the models
var models            = require('../models/models');

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
       models.Team.findById(id, function(err, user) {
            if(err) done(err);
             if(user){
         done(null, user);
       } else{
          models.Admin.findById(id, function(err, user){
          if(err) done(err);
          done(null, user);
       });
            }
        });
    });

    // =========================================================================
    // ADMIN SIGNUP ============================================================
    // =========================================================================

    passport.use('adminSignup', new LocalStrategy({
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) {

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'username' :  username }, function(err, user) {
            // if there are any errors, return the error
            if (err)
                return done(err);
            // check to see if the person signing up has the admin key
            if (req.body.adminKey !== configAdminKey.key) {
                return done(null, false, req.flash('signupMessage', 'Wrong admin key.'));
            }
            // check to see if theres already a user with that email
            if (user) {
                return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
            } else {

                // if there is no user with that email
                // create the user
                var newUser            = new models.Admin();

                // set the user's local credentials
                newUser.username = username;
                newUser.password = newUser.generateHash(password);

                // save the user
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }

        });

    }));

    // =========================================================================
    // TEAM SIGNUP  ============================================================
    // =========================================================================

    passport.use('teamSignup', new LocalStrategy({
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) {

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'username' :  username }, function(err, user) {
            // if there are any errors, return the error
            if (err)
                return done(err);

            // check to see if theres already a user with that email
            if (user) {
                return done(null, false, req.flash('signupMessage', 'That teamName is already taken.'));
            } else {

                // if there is no user with that email
                // create the user
                var newUser            = new models.Team();

                // set the user's local credentials
                newUser.username = username;
                newUser.password = newUser.generateHash(password);
                newUser.members = members;

                // save the user
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }

        });

    }));

    // =========================================================================
    // ADMIN LOGIN =============================================================
    // =========================================================================

    passport.use('adminLogin', new LocalStrategy({
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) { // callback with email and password from our form

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'username' :  username }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

            // if the user is found but the password is wrong
            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            return done(null, user);
        });

    }));

    // =========================================================================
    // TEAM LOGIN  =============================================================
    // =========================================================================

    passport.use('teamLogin', new LocalStrategy({
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) { // callback with email and password from our form

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'username' :  username }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No team found.')); // req.flash is the way to set flashdata using connect-flash

            // if the user is found but the password is wrong
            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            return done(null, user);
        });

    }));

};
