// routes/users.js
const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient()


router.get('/test', (req, res) => {
    res.json("helldavbsbfbfsddgddggdvo");
});


router.get('/users', async (req, res) => {

    const allUsers = await prisma.user.findMany()
    res.json(allUsers)
});
 

router.post('/register', async(req, res) => {
    try {
        const user =  await prisma.user.create({
            data : req.body
        })
        res.json(user);
    } catch (error) {
        res.json({ 'error': error });
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
        // res.json({'error': error})
    }
  });















module.exports = router;
