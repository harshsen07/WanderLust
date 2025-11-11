const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport")
const {saveRedirectUrl} = require("../middleware.js");



const userController = require("../controllers/users.js")

router.route("/signup")
.get( userController.renderSignUp)
.post( wrapAsync(userController.signUp))


router.route("/login")
.get(userController.renderLogin)
.post(
    saveRedirectUrl,
     passport.authenticate("local" ,{
     failureRedirect: "/login" ,
     failureFlash:true
    }),
    userController.login
   
 )

// router.post(
//     "/login" ,
//     saveRedirectUrl,
//      passport.authenticate("local" ,{
//      failureRedirect: "/login" ,
//      failureFlash:true
//     }),
//     async(req,res) =>{
//         req.flash("success" , "Welcome back to Wanderlust");
//         let redirectUrl = res.locals.redirectUrl || "/listings";
//         res.redirect(redirectUrl);
//     }
//  )


router.get("/logout" ,userController.logout )

module.exports = router;