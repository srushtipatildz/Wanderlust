import express from "express";
const app=express();
const port =3000;
const url=process.env.ATLAS_DB_URL
//DB connection
import mongoose, { Schema } from "mongoose";
async function main() {
  await mongoose.connect(url); 
}
main().then(()=>{console.log("Successful Connection !")})
.catch(err => console.log(err));

//import sub-files
import { Listing } from "./models/listings.js";
import ExpressError from "./utils/ExpressErrors.js";
import { Review } from "./models/review.js";

//path things!
import path from "path"; 
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = dirname(fileURLToPath(import.meta.url));
//static files
app.use(express.static("public"))
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "/views"))//for setting ejs engine 
//parsing wali cheez
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
import methodOverride from "method-override"
app.use(methodOverride('_method'))
//Validation import
import { listingSchema } from "./schemaValidation.js";
import { reviewSchema } from "./schemaValidation.js";
//session imports
import cookieParser from "cookie-parser";
import session from "express-session";
import flash from "connect-flash";
//Passport import
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { User } from "./models/users.js";//user model


app.use(cookieParser())
app.use(session(
    {secret:process.env.SECRET,
    resave:false,
    saveUninitialized:false,
   cookie:{
    expires:Date.now()+7*24*3600*1000,
    maxAge:7*24*3600*1000,
    httpOnly:true
}
}))
import MongoStore from "connect-mongo";
app.use(session({
  secret:process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
      mongoUrl: process.env.ATLAS_DB_URL,  
      collectionName: "sessions",
      
  }),
  cookie: {
    maxAge: 7 * 24 * 3600 * 1000,  // 1 week
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",  // Secure cookies only in production
    sameSite: "strict" 
}
}));
app.use(flash()); 

//passport middlewares
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
// passport.serializeUser((user, done) => {
//   console.log("Serializing User:", user); 
//   done(null, user._id);
// });
passport.deserializeUser(User.deserializeUser());
// passport.deserializeUser(async (id, done) => {
//   try {
//       const user = await User.findById(id);
//       console.log("Deserialized User:", user); 
//       done(null, user);
//   } catch (err) {
//       console.log("Error in deserializing user:", err);
//       done(err, null);
//   }
// });
//middleware for flash
app.use((req, res, next) => {
  res.locals.error = req.flash("error");  // Flash for login failures
  res.locals.success = req.flash("success");// Flash for success messages
  res.locals.currUser=req.user 
  next();
});
//Fake user Route
// app.get("/fakeUser",async(req,res)=>{
//   let fakeUser=new User({
//     email:"fake@gmail.com",
//     username:"fake"
//   })
//   let newUser=await User.register(fakeUser,"fake123")
//   res.send(newUser)
// })

//import routes
import listings from "./routes/listing.js"
import reviews from "./routes/review.js"
import signup from "./routes/user.js"
import login from "./routes/user.js"
app.use("/",listings)//listing!
app.use("/",reviews)//reviews!
app.use("/",signup)
app.use("/",login)
//(I didnt write entire path here to avoid confusions at actual routes!)

//function to delete purane reviews!!
const deleteReviews=async ()=>{
  await Listing.findByIdAndUpdate(
    "679a68b0e0f19b9d1f54426d",
    { $set: { reviews: [] } }, 
    { new: true } //ChatGPT ki meherbaani!!
);
}
// deleteReviews()
//Error Handling!
app.use((req,res,next)=>{
  res.send("Page Not Found")
  next()
})
app.use((err,req,res,next)=>{
  let{status=400,message="Ajeebo Gareeeb Error"}=err
    message=err.message
  console.log(status,message)
 res.render("error.ejs",{message})
 })
//Listen
app.listen(port,()=>{
    console.log("Server Started")
})