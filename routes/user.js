import express from "express";
const router = express.Router()
import { User } from "../models/users.js";
import passport from "passport";
//import controllers
import { usercontroller } from "../controllers/user.js";
//signup
router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs")
})
router.post("/signup",usercontroller.signupUser)
    
//login
router.get("/login",(req,res)=>{
    res.render("users/login.ejs")
})

//chatgpt
router.post("/login",usercontroller.loginUser);

// logout
router.get("/logout",usercontroller.logOutUser)
export default router;