// routes/users.js
const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient()

router.get('/all', (req, res) => {
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
        res.json(user)
    } catch (error) {
        res.json({ 'error': error });
    }
});

// router.get('/:id', async (req, res, next) => {
//     try {
//       const post = await prisma.post.findUnique({
//         where: { id: parseInt(req.params.id) },
//       });
//       if (post) {
//         res.json(post);
//       } else {
//         res.status(404).json({ error: 'Post not found.' });
//       }
//     } catch (error) {
//       next(error);
//     }
//   });















module.exports = router;
