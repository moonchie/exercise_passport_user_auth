const express  = require('express');
const router = express.Router();
const passport = require("passport");

//引入bcrypt模块
var bcrypt = require('bcrypt');
const User = require("../models/user-model.js");

router.get("/signup", (req, res, next) => {
    res.render("auth-views/signup-form.hbs")
})

// --------------SING UP and CREAT USER -------------
router.post("/process-signup", (req, res, next) => {
    //res.send(req.body);
    const { fullName, email, originalPassword } = req.body;

    if(originalPassword === "" || originalPassword.match(/[0-9]/) === null) {
        res.redirect("/signup");

        return;
    } else {
        let salt = bcrypt.genSaltSync(10);
        const encryptedPassword = bcrypt.hashSync(originalPassword,salt);
        //res.send(encryptedPassword);

        //用User model来创建新用户
        User.create({ fullName, email, encryptedPassword})
            .then((userDock) => {
                req.flash("success", "User created successfully!")
                res.redirect("/");
            })
            .catch((err) => {
                next(err);
            })
    }
   })



// ------------------Log in -------------------------
router.get("/login", (req, res, next) => {
    res.render("auth-views/login-forms.hbs")
})

router.post("/process-login", (req, res, next) => {
    const email = req.body.email;
    const loginPassword = req.body.loginPassword;

    // Check the email by searching the database
    User.findOne({email})
    .then((userDoc)=> {
        if (!userDoc){
            res.redirect("/login");
            return;             // stop here instead of continuing codes
        } else {
            // Check the password
            const { encryptedPassword } =userDoc;
            if (!bcrypt.compareSync(loginPassword, encryptedPassword)){
                // User password doesn't match with the one saved in database!
                req.flash("error", "Incorrect password!")
                res.redirect("/login");
                return
            } else {
                // we are ready to log them in if we get here (password ok)
                // "req.login()" is a Passport method for logging in a user
                // (behind the scenes it calls our "passport.serialize()" function)
                req.login(userDoc, () => {
                    req.flash("success", "Logged in successfully")
                    res.redirect("/");
                });
            }
        }
    })
    .catch((err) => { next(err)})
})


// -------------- LOG OUT------------------------
router.get("/logout", (req, res, next) => {
    // "req.logout() is q Passport method for logging OUT the user"
    // (behind the scences it calls our "passport.serialize()" function)
    req.logout();
    req.flash("success", "Logged out successfully");
    res.redirect("/");
})


// ---------------------- OAuth Authentification --------------------------------

// Allow Google log in here
router.get("/google/login",
    passport.authenticate("google", {
        scope: [
            "https://www.googleapis.com/auth/plus.login",
            "https://www.googleapis.com/auth/plus.profile.emails.read"
          ]
    }));

router.get("/google/success", passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/login",
    successFlash: "Google log in success!",
    failureFlash: "Google log in failure!."
}) );


// Allow Github log in here
router.get("/github/login", passport.authenticate("github"));
router.get("/github/success", passport.authenticate("github",{
    successRedirect: "/",
    failureRedirect: "/login",
    successFlash: "Github log in success!",
    failureFlash: "Github log in failure!."

}));


module.exports = router;