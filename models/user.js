var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  bcrypt = require('bcrypt');


var UserSchema = new Schema({
  name: String,
  blog: String,
  email: String,
  image: String,
  twitter: String,
  passwordDigest: String,
}, { timestamps: true });
// =======================
// Create new user 
// =======================

UserSchema.statics.createSecure = function (name, blog, email, image, twitter, password, callback) {
  var UserModel = this;
  console.log(email , "email");
  User.findOne({ email }).then((existingUser) => {
    console.log(`User: ${existingUser}`)
    if (existingUser) {
      console.log(`Error: Email ${email} already exist!`);
      callback(new Error(`Error: Email ${email} already exist!`), null)
    } else {

      bcrypt.genSalt(function (err, salt) {
        console.log('salt: ', salt);
        bcrypt.hash(password, salt, function (err, hash) {

          console.log("password:", password);
          console.log("passwordHash:", hash);

          UserModel.create({
            name: name,
            blog: blog,
            email: email,
            image: image,
            twitter: twitter,
            passwordDigest: hash,
          }, callback);
        });
      });

    }
  }
  )
    .catch((err) => { console.log(err); callback(err, null) })

};

// ===================================
// Authinticate user login 
// ===================================

UserSchema.statics.authenticate = function (email, password, callback) {
  this.findOne({ email: email }, function (err, foundUser) {
    console.log(foundUser);


    if (!foundUser) {
      console.log('No user with this email Try again ! ' + email);
      callback("Error: no user found", null);
    } else if (foundUser.checkPassword(password)) {
      callback(null, foundUser);
    } else {
      callback("Error: incorrect password", null);
    }
  });
};

// compare password user enters with hashed password (`passwordDigest`)
UserSchema.methods.checkPassword = function (password) {
  return bcrypt.compareSync(password, this.passwordDigest);
};



var User = mongoose.model('User', UserSchema);

// export user model
module.exports = User;