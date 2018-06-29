const express = require('express');
const router  = express.Router();
const User = require("../models/user-model.js");
const bcrypt = require('bcrypt');

/* GET home page */
router.get('/', (req, res, next) => {
  // req.session is our session object, print it to have a look
  console.log(req.session);
  // "req.user" is the result of "passport.deserializeUser()"
  console.log(req.user);

  if (req.user){
    console.log("LOGGED IN!");
  } else { console.log("LOGGED OUT!");}

  res.render('index');
});


/// USER SETTING
router.get("/settings",(req, res, next) => {
  if (!req.user){
    res.redirect("/login");
  }
  res.render("../views/settings-page.hbs")
})

router.post("/process-settings", (req, res, next) => {
  if (!req.user) {
    // 使用req.flash来显示信息
    req.flash("error", "You must be logged in");
    // redirect if you are not logged in
    req.redirect("/login");
    return
  }
  const {fullName, oldPassword, newPassword } = req.body;
  let changes = {fullName};

  if (oldPassword && newPassword){
      if(!bcrypt.compareSync(oldPassword, req.user.encryptedPassword)){
          res.redirect("/settings");
          console.log(changes);
          return;
      }

      const encryptedPassword = bcrypt.hashSync(newPassword, 10);
      changes = {fullName, encryptedPassword};
  }

  User.findByIdAndUpdate(
      req.user._id,
      { $set: changes},
      { runValidators: true}
  )
  .then((userDoc) => {
    //再次用connect flash
    req.flash("success", "Settings saved succesfully!")
    res.redirect("/");
  })
  .catch((err) => {
      next(err);
  });
})


module.exports = router;
