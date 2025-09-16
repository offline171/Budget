const { Pool } = require("pg");
require('dotenv').config();

// Use Replit's DATABASE_URL if available, otherwise fall back to individual env vars
const connectionString = process.env.DATABASE_URL || 
  `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.PGHOST || 'db'}:${process.env.PGPORT || 5432}/${process.env.POSTGRES_DB}`;

// Production-ready configuration with SSL support
const poolConfig = {
  connectionString: connectionString,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false // For Replit/Heroku style deployments
  } : false,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close clients after 30 seconds of inactivity
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
};

module.exports = new Pool(poolConfig);