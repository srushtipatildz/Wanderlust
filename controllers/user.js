import { User } from "../models/users.js";
import passport from "passport";

//signup User
const signupUser = async (req, res, next) => {
    try {
        let { email, username, password } = req.body;
        let newUser = new User({ email, username })
        let registeredUser = await User.register(newUser, password)
        console.log(registeredUser)
        // automatic login after signup!
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err)
            }

            req.flash("success", "Welcome!UserRegistered Successfully.");
            res.redirect("/listings")
        })

    } catch (err) {
        req.flash("error", err.message);  // Display actual error message
        res.redirect("/signup");  // Redirect back to the signup page
    }
}
//login user
const loginUser = (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            console.error("Authentication error:", err); // Log the error
            req.flash("error", "Something went wrong. Please try again.");
            return res.redirect("/login");
        }

        if (!user) {
            req.flash("error", "User not found. Please sign up first.");
            return res.redirect("/signup");
        }

        req.logIn(user, (loginErr) => {
            if (loginErr) {
                console.error("Login error:", loginErr);
                req.flash("error", "Login failed. Please try again.");
                return res.redirect("/login");
            }

            req.flash("success", "Welcome! You are logged in.");
            res.redirect("/listings");
        });
    })(req, res, next);
}
//logout user
const logOutUser = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err)
        }
        req.flash("success", "Logged Out")
        res.redirect("/listings")
    })
}

export const usercontroller = {
    signupUser,
    loginUser,
    logOutUser
}