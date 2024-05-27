// routes/users.js
const express = require('express');
const user = express.Router();

user.get('/all', (req, res) => {
    res.json("helldavadvadvo");
});

module.exports = user;
