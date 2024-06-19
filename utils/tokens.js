const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const RESET_TOKEN_SECRET = process.env.RESET_TOKEN_SECRET;

// Function to sign a token
function signToken(payload, secret, expiresIn) {
  return jwt.sign(payload, secret, { expiresIn });
}

// Function to validate a token
function validateToken(token, secret) {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

module.exports = {
  signToken,
  validateToken,
  RESET_TOKEN_SECRET,
  JWT_SECRET
};