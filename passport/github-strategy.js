const passport = require("passport");
// Passport's middleware Strategy is the main tool for 3rd party auth process
const GithubStrategy = require("passport-github").Strategy;

const User = require("../models/user-model.js");


passport.use(new GithubStrategy({
    // settings for the strategy
    clientID: process.env.github_id,
    clientSecret: process.env.github_secret,
    callbackURL: "/github/success",
    proxy: true  // need this for production version to work 🤷
  }, (accessToken, refreshToken, profile, done) => {
    // what will happen every time a user logs in with GitHub
    console.log("GITHUB profile ^^^^^^^^^^^^^^^^^^^^^^^^^^", profile);

    const { id, username, displayName, emails } = profile;

    // Check if user email exists
    User.findOne({
        $or: [{githubID: id }, { email}]})
    .then((userDoc) => {
      if (userDoc) {
        // if we found a user, they already signed up so just log them in.
        done(null, userDoc);
        return;
      }

      let fullName = username;
      let email = `${username}@github.com`;

      // otherwise create a new user account for them before loggin in
      if (displayName) {
        fullName = displayName;
      }
      if (emails) {
        email = emails[0].value;
      }

      User.create({ githubID: id, fullName, email })
        .then((userDoc) => {
          // log in the newly created user account
          done(null, userDoc);
        })
    })
    .catch((err) => {
      done(err);
    });
}));