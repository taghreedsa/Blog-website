const express = require("express");
app = express();
require('dotenv').config()
const mongoose = require('mongoose')
const methodOverride = require("method-override");
const bcrypt = require('bcrypt');
// const expressLayouts = require('express-ejs-layouts');
let PORT = process.env.PORT || 4000


// MiddleWare 
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: false }));


// Routes
const userRouter = require('./routes/user')
app.use(userRouter)
const articleRouter = require('./routes/articles')
app.use("/articles" ,articleRouter)

// CONNICTION WITH 

mongoose.connect(
    process.env.mongodb,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log(`MongoDb connected to ${process.env.mongodb}`)
  );
  





// SET UP THE SERVER
app.listen(PORT , ()=> console.log("Server is running"))