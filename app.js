/////// app.js
const path = require("node:path");
const { Pool } = require("pg");
const express = require("express");
const session = require("express-session");
const pgSession = require('connect-pg-simple')(session);
const methodOverride = require('method-override');
const bcrypt = require("bcryptjs");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
require('dotenv').config();

// Import database migration
const { runMigrations } = require('./db/migrate');

// Environment validation
const NODE_ENV = process.env.NODE_ENV || 'development';
const isProduction = NODE_ENV === 'production';

// Production environment checks
if (isProduction) {
  if (!process.env.SESSION_SECRET) {
    console.error('ERROR: SESSION_SECRET is required in production');
    process.exit(1);
  }
  if (!process.env.DATABASE_URL) {
    console.error('ERROR: DATABASE_URL is required in production');
    process.exit(1);
  }
  console.log('Running in PRODUCTION mode');
} else {
  console.log('Running in DEVELOPMENT mode');
}

const indexRouter = require("./routes/indexRouter");
const logOutRouter = require("./routes/logOutRouter");
const logInRouter = require("./routes/logInRouter");
const signUpRouter = require("./routes/signUpRouter");
const transactionRouter = require("./routes/transactionRouter");
const accountRouter = require("./routes/accountRouter");
const pool = require("./db/pool");

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Trust proxy for production deployments (Heroku, Replit, etc.)
if (isProduction) {
  app.set('trust proxy', 1);
}

// Configure session with PostgreSQL store for persistence
const sessionConfig = {
  store: new pgSession({
    pool: pool,
    tableName: 'user_sessions',
    createTableIfMissing: true
  }),
  secret: process.env.SESSION_SECRET || 'your-very-secure-secret-key-change-this-in-production',
  resave: false,
  saveUninitialized: false,
  name: 'sessionId', // Don't use default session name
  cookie: {
    secure: isProduction, // Only send over HTTPS in production
    httpOnly: true, // Prevent XSS attacks
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: isProduction ? 'lax' : false // CSRF protection
  }
};

app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

app.use("/log-in", logInRouter);
app.use("/log-out", logOutRouter);
app.use("/sign-up", signUpRouter);
app.use("/transaction", transactionRouter);
app.use("/account", accountRouter);
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

// Run database migrations before starting server
async function startServer() {
  try {
    console.log('Starting Budget Application...');
    
    // Run database migrations
    await runMigrations();
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Budget app listening on port ${PORT}!`);
      console.log(`Environment: ${NODE_ENV}`);
      console.log(`Database connected: ${process.env.DATABASE_URL ? 'Yes' : 'No'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();