const {Router} = require("express");
const methodOverride = require('method-override');
const transactionRouter = Router();
const pool = require("../db/pool");

transactionRouter.use(methodOverride('_method'));

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

transactionRouter.delete("/delete", async (req, res, next) => {
  console.log(`Transaction with id null to be deleted`);
  res.redirect("/");
});

transactionRouter.delete("/:id/delete", async (req, res, next) => {
  console.log(`Transaction with id ${req.params.id} to be deleted`);
  res.redirect("/");
  /*
  try {
    const convetedMoney = Math.floor(req.body.money * 100);
    await pool.query("DELETE FROM transactions WHERE id = $1", 
      [req.body.id]);
    res.redirect("/");
  } catch (error) {
    console.error(error);
    next(error);
  }
    */
});

module.exports = transactionRouter;
