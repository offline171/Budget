const {Router} = require("express");
const indexRouter = Router();
const pool = require("../db/pool");


indexRouter.get("/", async function(req, res) {
  const transactions = (await fetchTransactions(req.user.id));
  res.render("index", { user: req.user, transactions: transactions});
});

// get items for index
async function fetchTransactions(user_id){
  try{
    const { rows } = await pool.query("SELECT * FROM transactions WHERE user_id = $1", [user_id]);
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

module.exports = indexRouter;