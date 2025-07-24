// next.config.js
require('dotenv').config();

module.exports = {
  env: {
    PLAID_CLIENT_ID: process.env.PLAID_CLIENT_ID,
    PLAID_SECRET: process.env.PLAID_SECRET,
  },
};
