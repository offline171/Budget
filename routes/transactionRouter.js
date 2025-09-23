const {Router} = require("express");
const methodOverride = require('method-override');
const transactionRouter = Router();
const pool = require("../db/pool");

transactionRouter.use(methodOverride('_method'));

transactionRouter.get("/", (req, res) => {
  res.render("transaction");
});

transactionRouter.get("/:id/update", async function(req, res) {
  const item = await fetchTransaction(req.params.id); //more to just make sure that the transaction exists
  console.log('looking for id = $1', [item.id]);
  res.render("updateTransaction", {user: req.user, transaction: item});
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

transactionRouter.post("/closing-date", async (req, res, next) => {
  try {
    await pool.query("insert into transactions (user_id, name, money, date) values ($1, $2, $3, $4)", 
      [req.user.id, "closing-date-official", -1, req.body.date]);
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
    await pool.query("insert into transactions (user_id, name, money, date) values ($1, $2, $3, $4)", 
      [req.user.id, "pay-off-official", convetedMoney, currentDate]);
    await pool.query("UPDATE users SET money = money - $2 WHERE id = $1", 
      [req.user.id, convetedMoney]);
    res.redirect("/");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

transactionRouter.put("/:id/update", async (req, res, next) => {
  try {
    if(!await verifyUser(req.user.id, req.params.id)){
      console.error(error);
      next(error);
    }
    const convetedMoney = Math.floor(req.body.money * 100);
    await pool.query("UPDATE transactions SET name = $2, money = $3, date = $4 WHERE id = $1", 
      [req.params.id, req.body.name_, convetedMoney, req.body.date]);
    res.redirect("/");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

transactionRouter.delete("/:id/delete", async (req, res, next) => {
  try {
    if(!await verifyUser(req.user.id, req.params.id)){
      console.error(error);
      next(error);
    }
    const item = await fetchTransaction(req.params.id);
    if(item.name === "pay-off-official"){
      await pool.query("UPDATE users SET money = money + $2 WHERE id = $1", 
        [req.user.id, item.money]);
    }
    await pool.query("DELETE FROM transactions WHERE id = $1", 
      [req.params.id]);
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
      return 1;
    } else {
      console.log('User_id $1 does not match the transaction user id $2', [user_id, row.user_id]);
      return 0;
    }
  } else {
    console.error('Error, cannot find transaction');
    return 0;
  }
}

module.exports = transactionRouter;
