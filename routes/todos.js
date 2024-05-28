// routes/users.js
const router = require('express').Router();
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()




module.exports = router;