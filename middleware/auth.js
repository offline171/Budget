// Authentication middleware for protecting routes

// Middleware to ensure user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

// Middleware to ensure user is not authenticated (for login/signup pages)
function ensureNotAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

// Middleware to check if user owns the transaction
async function ensureOwnership(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect('/');
  }
  
  const pool = require('../db/pool');
  try {
    const { rows } = await pool.query(
      "SELECT user_id FROM transactions WHERE id = $1", 
      [req.params.id]
    );
    
    if (rows.length === 0) {
      return res.status(404).send('Transaction not found');
    }
    
    if (rows[0].user_id !== req.user.id) {
      return res.status(403).send('Access denied: You do not own this transaction');
    }
    
    return next();
  } catch (error) {
    console.error('Error checking transaction ownership:', error);
    return res.status(500).send('Internal server error');
  }
}

module.exports = {
  ensureAuthenticated,
  ensureNotAuthenticated,
  ensureOwnership
};