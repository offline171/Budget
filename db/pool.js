const { Pool } = require("pg");
require('dotenv').config();
const POSTGRES_USER = process.env.POSTGRES_USER;
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD;
const POSTGRES_DB = process.env.POSTGRES_DB;
const PORT = process.env.PORT || 5432;

module.exports = new Pool({
  connectionString: "postgresql://" + POSTGRES_USER + ":" + POSTGRES_PASSWORD + "@db:" + PORT + "/" + POSTGRES_DB
});