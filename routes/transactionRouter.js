const {Router} = require("express");
const methodOverride = require('method-override');
const transactionRouter = Router();
const pool = require("../db/pool");
const { ensureAuthenticated, ensureOwnership } = require('../middleware/auth');

transactionRouter.use(methodOverride('_method'));

// Protect all transaction routes - user must be logged in
transactionRouter.use(ensureAuthenticated);

transactionRouter.get("/", (req, res) => {
  res.render("transaction");
});

transactionRouter.get("/:id/update", ensureOwnership, async function(req, res) {
  const item = await fetchTransaction(req.params.id);
  console.log('looking for id = $1', [item.id]);
  res.render("updateTransaction", {user: req.user, transaction: item});
});

transactionRouter.post("/", async (req, res, next) => {
  try {
    const convetedMoney = Math.floor(req.body.money * 100);
    await pool.query("insert into transactions (user_id, name, money, date, paid) values ($1, $2, $3, $4, $5)", 
      [req.user.id, req.body.name_, convetedMoney, req.body.date, false]);
    res.redirect("/");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

transactionRouter.post("/closing-date", async (req, res, next) => {
  try {
    await pool.query("insert into transactions (user_id, name, money, date, paid) values ($1, $2, $3, $4, $5)", 
      [req.user.id, "closing-date-official", -1, req.body.date, true]);
    res.redirect("/");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

transactionRouter.post("/pay-off", async (req, res, next) => {
  try {
    const currentDate = new Date();
    const convetedMoney = Math.floor(req.body.money * 100);
  console.log('paying off money = $1', [req.body.money]);
    await pool.query("insert into transactions (user_id, name, money, date, paid) values ($1, $2, $3, $4, $5)", 
      [req.user.id, "pay-off-official", convetedMoney, currentDate, true]);
    await pool.query("UPDATE users SET money = money - $2 WHERE id = $1", 
      [req.user.id, convetedMoney]);
    res.redirect("/");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

transactionRouter.put("/:id/update", ensureOwnership, async (req, res, next) => {
  try {
    const convetedMoney = Math.floor(req.body.money * 100);
    await pool.query("UPDATE transactions SET name = $2, money = $3, date = $4, paid = $5 WHERE id = $1 AND user_id = $6", 
      [req.params.id, req.body.name_, convetedMoney, req.body.date, false, req.user.id]);
    res.redirect("/");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

transactionRouter.put("/:id/pay", ensureOwnership, async (req, res, next) => {
  try {
    const item = await fetchTransaction(req.params.id);
    await pool.query("UPDATE transactions SET paid = $2 WHERE id = $1 AND user_id = $3", 
      [req.params.id, true, req.user.id]);
    await pool.query("UPDATE users SET money = money - $2 WHERE id = $1", 
      [req.user.id, item.money]);
      res.redirect("/");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

transactionRouter.put("/:id/undo", ensureOwnership, async (req, res, next) => {
  try {
    const item = await fetchTransaction(req.params.id);
    await pool.query("UPDATE transactions SET paid = $2 WHERE id = $1 AND user_id = $3", 
      [req.params.id, false, req.user.id]);
    await pool.query("UPDATE users SET money = money + $2 WHERE id = $1", 
      [req.user.id, item.money]);
      res.redirect("/");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

transactionRouter.delete("/:id/delete", ensureOwnership, async (req, res, next) => {
  try {
    const item = await fetchTransaction(req.params.id);
    if(item.name === "pay-off-official"){
      await pool.query("UPDATE users SET money = money + $2 WHERE id = $1", 
        [req.user.id, item.money]);
    }
    await pool.query("DELETE FROM transactions WHERE id = $1 AND user_id = $2", 
      [req.params.id, req.user.id]);
    res.redirect("/");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//////////////////////////////////////////////////////////////////////////////////////////////////
////                                  Helper Functions                                        ////
//////////////////////////////////////////////////////////////////////////////////////////////////

// get transaction for update
async function fetchTransaction(id){
  try{
    const { rows } = await pool.query("SELECT * FROM transactions WHERE id = $1", [id]);
    const item = rows[0];
    if(item) {
      return item;
    } else {
      console.log('Transaction not found');
    }
  } catch(error) {
    console.error('Error, cannot find transaction with id = $1', [id]);
  }
}

//Add to delete and put functions
async function verifyUser(user_id,transaction_id){
  const rows = await pool.query("SELECT * FROM transaction WHERE id = $1", [transaction_id]);
  const row = rows[0];
  if(row){
    if(row.user_id == user_id){
      console.log()
    } else {
      console.log('User_id $1 does not match the transaction user id $2', [user_id, row.user_id]);
    }
  } else {
    console.error('Error, cannot find transaction');
  }
}

module.exports = transactionRouter;
