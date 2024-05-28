// routes/users.js
const router = require('express').Router();
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

router.get('/all', (req, res) => {
    res.json("helldavadvadvo");
});

router.get('/all', (req, res) => {
    res.json("helldavadvadvo");
});

module.exports = router;
