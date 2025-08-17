const {Router} = require("express");
const logInRouter = Router();
const passport = require("passport");

logInRouter.post("/", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/"
  })
);

module.exports = logInRouter;