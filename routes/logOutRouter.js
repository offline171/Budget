const {Router} = require("express");
const logOutRouter = Router();

logOutRouter.get("/", (req, res) => {
  console.log("logout being attempted");
  if(req.session){
    req.session = null;
    res.redirect("/");
  } else {
    return next(err);
  }
});

module.exports = logOutRouter;