const {Router} = require("express");
const methodOverride = require('method-override');
const accountRouter = Router();
const pool = require("../db/pool");

accountRouter.use(methodOverride('_method'));

accountRouter.get("/", async function(req, res){
  res.render("account", { user: req.user});
});

accountRouter.put("/money", async (req, res, next) => {
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

accountRouter.put("/credit", async (req, res, next) => {
  try {
    const convetedMoney = Math.floor(req.body.credit * 100);
    await pool.query("UPDATE users SET credit = $2 WHERE id = $1", 
      [req.user.id, convetedMoney]);
    res.redirect("/account");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = accountRouter;
