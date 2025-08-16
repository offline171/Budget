const {Router} = require("express");
const transactionRouter = Router();
const pool = require("../db/pool");

transactionRouter.get("/", (req, res) => {
  res.render("transaction");
});

transactionRouter.post("/", async (req, res, next) => {
  try {
    const convetedMoney = Math.floor(req.body.money * 100);
    await pool.query("insert into transactions (user_id, name, money, date) values ($1, $2, $3, $4)", 
      [req.user.id, req.body.name_, convetedMoney, req.body.date]);
    res.redirect("/");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = transactionRouter;
