const {Router} = require("express");
var moment = require('moment');
const indexRouter = Router();
const pool = require("../db/pool");

indexRouter.get("/", async function(req, res) {
  let transactions = null;
  if(req.user != null){
    transactions = (await fetchTransactions(req.user.id));
  }
  res.render("index", { user: req.user, transactions: transactions, moment: moment});
});

// get items for id
async function fetchTransactions(user_id){
  try{
    const { rows } = await pool.query("SELECT * FROM transactions WHERE user_id = $1 ORDER BY date", [user_id]);
    const items = rows;
    if(items) {
      return items;
    } else {
      console.log('Transaction not found');
    }
  } catch(error) {
    console.error('Error, cannot find transactions.');
  }
}

// get user info for id
async function fetchUser(id){
  try{
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    const user = rows[0];
    if(user) {
      return user;
    } else {
      console.log('User not found');
    }
  } catch(error) {
    console.error('Error, cannot find user.');
  }
}


module.exports = indexRouter;