const { Pool } = require("pg");
require('dotenv').config();
const POSTGRES_USER = process.env.POSTGRES_USER;
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD;
const POSTGRES_DB = process.env.POSTGRES_DB;

module.exports = new Pool({
  connectionString: "postgresql://" + POSTGRES_USER + ":" + POSTGRES_PASSWORD + "@db:5432/" + POSTGRES_DB
});