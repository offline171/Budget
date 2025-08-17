/////// app.js
const path = require("node:path");
const { Pool } = require("pg");
const express = require("express");
const session = require("cookie-session");
const methodOverride = require('method-override');
const bcrypt = require("bcryptjs");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;

const indexRouter = require("./routes/indexRouter");
const logOutRouter = require("./routes/logOutRouter");
const logInRouter = require("./routes/logInRouter");
const signUpRouter = require("./routes/signUpRouter");
const transactionRouter = require("./routes/transactionRouter");
const pool = require("./db/pool");

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

app.use("/log-in", logInRouter);
app.use("/log-out", logOutRouter);
app.use("/sign-up", signUpRouter);
app.use("/transaction", transactionRouter);
app.use("/", indexRouter);

// 3 functions below are important to create and maintain sessions
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
      const user = rows[0];

      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        // passwords do not match!
        return done(null, false, { message: "Incorrect password" })
      }
      return done(null, user);
    } catch(err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    const user = rows[0];

    done(null, user);
  } catch(err) {
    done(err);
  }
});

app.listen(3000, () => console.log("app listening on port 3000!"));