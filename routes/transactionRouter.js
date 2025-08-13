const {Router} = require("express");
const transactionRouter = Router();
const bcrypt = require("bcryptjs");
const pool = require("../db/pool");

signUpRouter.get("/", (req, res) => {
    res.render("transaction");
});

signUpRouter.post("/", async (req, res, next) => {
 try {
  await pool.query("insert into transactions (user_id, name_, money, date) values ($1, $2, $3, $4)", [req.body.id, name_, money, date]);
  res.redirect("/");
 } catch (error) {
    console.error(error);
    next(error);
   }
});

module.exports = transactionRouter;
