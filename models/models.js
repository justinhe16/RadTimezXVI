var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var adminSchema = mongoose.Schema({
      username : String,
      password : String
});

var teamSchema = mongoose.Schema({
      username : String,
      password : String,
      totalPoints : String, 
      members : [String]
});

var clueSchema = mongoose.Schema({
      text : String,
      pointValue : Number,
      type : String, 
      submittable : Boolean,
      successfulTeamsIds : [Number], //ids of the teams that have gained points for this clue
      relatedPhotoIds : [Number]
});

var photoSchema = mongoose.Schema({
      path : [String],
      teamId : Number, //the team that sent the photo in
      caption : String //the team may attach a caption
});

// methods ======================
// generating a hash
teamSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
// checking if password is valid
teamSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};
// generating a hash
adminSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
// checking if password is valid
adminSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

// create the model for users and expose it to our app
module.exports.Admin = mongoose.model('Admin', adminSchema);
module.exports.Team = mongoose.model('Team', teamSchema);
module.exports.Clue = mongoose.model('Clue', clueSchema);
module.exports.Photo = mongoose.model('Photo', photoSchema);
