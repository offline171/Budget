const {Router} = require("express");
const indexRouter = Router();
const pool = require("../db/pool");


indexRouter.get("/", async function(req, res) {
  res.render("index", { user: req.user});
});

module.exports = indexRouter;