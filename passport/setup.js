const passport = require("passport");
const User = require("../models/user-model.js");
require("./google-strategy.js");
require("./github-strategy.js")

// serialize: saving user data in the session
// (happens when you log in)
passport.serializeUser((userDoc, done) => {
    console.log("SERIALIZE (save to session");
    // null let passport know there is no error occurred
    done(null, userDoc._id)
});

//deserialize: retreving the rest of the user ata from the database
// (happens automatically on every request After you log in)
passport.deserializeUser((idFromSession, done) =>{
    console.log("deSERIALIZE (detials from the database)");

    User.findById(idFromSession)
        .then((userDoc) => {
            done(null, userDoc);
        })
        .catch((err) => {
            done(err);
        });

})

function passportSetup (app) {
// add Passport properties & methods to the req obkect in our routes
    app.use(passport.initialize());
    app.use(passport.session());

    app.use((req, res, next) => {
        // make "req.user" accessible inside hbs files as "blahUser"
        res.locals.blahUser = req.user;

        // make flash messages accessible inside hbs files as "messages"
        res.locals.messages = req.flash();

        next();
    })
}


module.exports = passportSetup;