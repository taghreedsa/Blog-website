const express = require('express');
const router = express.Router()
const validator = require('express-validator');
const User = require('../models/user.js')
session = require("express-session");
const mongoose = require('mongoose')
const mongoSessisonStore = require('connect-mongo')(session);
bcrypt = require('bcrypt');

// ==================
// Middleware Section
// ===================
// Create new session
router.use(
    session({
      store :new mongoSessisonStore({mongooseConnection: mongoose.connection}),
      saveUninitialized: true,
      resave: true,
      secret: "Alpha Secret Cookie",
      cookie: { maxAge: 30 * 60 * 1000 },
    })
  );

// =============================
// Create New User 
//==============================
router.get('/signup' , (req,res) =>{

    res.render('signup')
})

router.post(
    "/users", validator.body("email").isEmail(),
    validator.body("password").isLength({min:5}),
  
   (req, res)=> {
  
    const validationErrors = validator.validationResult(req);
    if(!validationErrors.isEmpty())
    return res.status(500).send("Valdition Errors");

    console.log(req.body);
    User.createSecure(req.body.name , req.body.blog, req.body.email, req.body.image ,
         req.body.twitter , req.body.password ,   (err, newUser) =>{
           if(err){
            // res.status(400).redirect("/signup");
            let errors = [];
           // req.session.userId = newUser._id;
            errors.push({ msg :"Error: Email already exist!"});
            console.log("abdulrahman password",errors)
            res.render("signup",{
              errors,
            })
            errors = [];
          }
             else{
            console.log(newUser);
            req.session.userId = newUser._id;
            res.redirect("/login");
           }
    });
  });
// ===========================



// ======================
// Create login
// ======================
router.get('/login' , (req,res) =>{

        res.render('login')

})

router.post("/sessions", function (req, res) {
    User.authenticate(
      req.body.email,
      req.body.password,
      
      function (err, loggedInUser) {
        if (err) {
          console.log("authentication error: ", err);
          // send (err)
          res.status(500).send();
        } else {
          console.log("setting sesstion user id ", loggedInUser._id);
         
          req.session.userId = loggedInUser._id;
          // res.redirect to th home page
          res.redirect("/profile");
        }
      }
    );
  });



// the view of home page 
router.get('/home' , (req,res) =>{

    res.render('home')

})

// =================
// User Profile 
// =================

function checkSignIn(req , res , next){
    if(req.session.userId){
      next();
    }else{
      const err = new Error("You are not logged in !")
    next(err);
  
    }
   };

// ================
// Access only for Authorized User
// =================
  router.get("/profile" , 
  checkSignIn,
  (req , res) =>{
    User.findOne({_id:req.session.userId})
    .then((user)=>{
      res.render("profile" , {user: user})
    })
    .catch((err) => console.log(err))
  })



// ====================
// Edit profile page 
// ====================
router.get("/profiles/:id/editprofile",
checkSignIn ,
 (req, res) => {
  const id = req.params.id;

  console.log(id);
  User.findById(id)
      .then(user => {
          res.render("editprofile", { user: user });
      }).catch(err => console.log(err))


});

// update action
router.put("/profiles/:id",
checkSignIn , 
 (req, res) => {
  const id = req.params.id;
  console.log("Taghreed" , id)
  
  let updateProfile = {
      name: req.body.name,
      blog : req.body.blog,
      email : req.body.email,
      twitter : req.body.twitter ,
      image : req.body.image,
      passwordDigest : req.body.password 
  };
  console.log(" hi Abdulrahman",updateProfile.passwordDigest)
  const id1 =req.session.userId;
  if(updateProfile.passwordDigest == ""){
   
      User.findById(id1).then(user=>{
        updateProfile.passwordDigest = user.passwordDigest;
        console.log("after updata : ",updateProfile)

    
     
        User.findByIdAndUpdate(id, updateProfile , {useFindAndModify : true })
            .then(user => {
              bcrypt.compareSync(req.body.password , user.passwordDigest)
                res.redirect(`/profile`);
            }).catch(err => console.log(err))
      })

  



 
  
}
else{

  console.log(updateProfile)
  bcrypt.genSalt(function (err, salt) {
    console.log('salt: ', salt);
    bcrypt.hash(updateProfile.passwordDigest, salt, function (err,hash) {
      updateProfile.passwordDigest = hash ;
      console.log("new pass" ,updateProfile)
    
     
  User.findByIdAndUpdate(id, updateProfile , {useFindAndModify : true })
      .then(user => {
        bcrypt.compareSync(req.body.password , user.passwordDigest)
          res.redirect(`/profile`);
      }).catch(err => console.log(err))
});

  })

}
})
 


// ===============================
// log out user & End the seession
// ===============================

router.get("/logout", function (req, res) {
  // console.log(req.session.userId )
  req.session.userId = null;
  
  res.redirect("/");
});













module.exports = router
