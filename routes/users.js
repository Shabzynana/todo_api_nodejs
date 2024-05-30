// routes/users.js
const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');


const prisma = new PrismaClient()


router.get('/test', (req, res) => {
    res.json("helldavbsbfbfsddgddggdvo");
});


router.get('/users', async (req, res) => {

    const allUsers = await prisma.user.findMany()
    res.json(allUsers)
});
 

router.post('/register', async(req, res, next) => {
    const { email, firstname, lastname, username, password, gender } = req.body;

    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const user =  await prisma.user.create({
            data : {
                email,
                firstname,
                lastname,
                username,
                gender,
                password:hashedPassword
            }
        })
        res.json(user);
    } catch (error) {
        next(error)
    }
});


router.get('/user/:id', async (req, res, next) => {
try {
    const {id} = req.params
    const user = await prisma.user.findUnique({
        where: { id: parseInt(id) },
    });
    if (user) {
        res.json(user);
    }
    else {
        res.json({ error: 'Post not found.'});
    }
} catch (error) {
    next(error) 
    }
});

  















module.exports = router;
