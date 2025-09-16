const {Router} = require("express");
const signUpRouter = Router();
const bcrypt = require("bcryptjs");
const pool = require("../db/pool");
const { ensureNotAuthenticated } = require('../middleware/auth');

// Only allow signup if user is not already logged in
signUpRouter.use(ensureNotAuthenticated);

signUpRouter.get("/", (req, res) => {
    res.render("sign-up-form");
});

signUpRouter.post("/", async (req, res, next) => {
 try {
  // Basic validation
  if (!req.body.username || !req.body.password) {
    return res.status(400).send('Username and password are required');
  }
  
  if (req.body.password.length < 6) {
    return res.status(400).send('Password must be at least 6 characters long');
  }
  
  // Check if username already exists
  const existingUser = await pool.query("SELECT id FROM users WHERE username = $1", [req.body.username]);
  if (existingUser.rows.length > 0) {
    return res.status(400).send('Username already exists');
  }
  
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  await pool.query("insert into users (username, password, money, credit) values ($1, $2, $3, $4)", 
    [req.body.username, hashedPassword, 0, 0]);
  res.redirect("/");
 } catch (error) {
    console.error(error);
    next(error);
   }
});

module.exports = signUpRouter;