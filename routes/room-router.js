const express = require("express");
const Room = require("../models/room-model.js")
const router = express.Router();


// ----------------- Create a Room---------------------------
router.get("/room/add", (req, res, next) => {
    // check if user is logged in or not
    if (!req.user){
        req.flash("error", "You must log in first");
        res.redirect("/login");
        return;
      }

    res.render("room-views/room-form.hbs")
})

router.post("/process-room", (req, res, next) => {
    //res.send(req.body);
    if (!req.user){
        req.flash("error", "You must log in first");
        res.redirect("/login");
        return;
      }

    const { name, description, pictureUrl} = req.body;

    const owner = req.user._id;
    Room.create({ owner, name, description, pictureUrl})
      .then((roomDoc) => {
        req.flash("success", "Room created!");
        res.redirect("/")
      })
      .catch((err) => {next(err)})
});


// ------------ Display All Rooms ---------------
router.get("/my-rooms", (req, res, next) => {
    if (!req.user){
        req.flash("error", "You must log in first");
        res.redirect("/login");
        return;
      }
      // filter on the rooms which has logged-in user as owner
      const owner = req.user._id;
      Room.find({owner})
      .then((roomResults) => {
          res.locals.roomArry = roomResults;
          res.render("room-views/room-list.hbs")
      })
      .catch((err) => {next(err)})
})

// Export router
module.exports = router;