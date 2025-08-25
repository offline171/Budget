const {Router} = require("express");
const methodOverride = require('method-override');
const accountRouter = Router();
const pool = require("../db/pool");

accountRouter.use(methodOverride('_method'));

accountRouter.get("/", async function(req, res){
  res.render("account", { user: req.user});
});

accountRouter.put("/money", async (req, res, next) => {
  console.log(`Account balance with id ${req.user.id} and money id ${req.body.money} to be updated`);
  try {
    const convetedMoney = Math.floor(req.body.money * 100);
    await pool.query("UPDATE users SET money = $2 WHERE id = $1", 
      [req.user.id, convetedMoney]);
    res.redirect("/account");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = accountRouter;
