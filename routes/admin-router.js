const express = require("express");
const User = require("../models/user-model.js")
const router = express.Router();

router.get("/admin/get", (req, res, next) =>{
    if (!req.user || req.user.role !== "admin"){
        req.flash("error", "You must log in first");
        res.redirect("/login");
        return;
      }

    User.find()
        .then((userResult) => {
            res.locals.userArray = userResult;
            res.render("admin-views/user_list.hbs")
        })
        .catch((err) => {next(err)})
})


// Export router
module.exports = router;