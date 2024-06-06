// routes/users.js
const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');


const prisma = new PrismaClient()

router.get("/taskhome", async (req, res) => {
    res.json("Todo route is up");

});


router.post("/create", async (req,res) => {

    // const { title, content, date, userId} = req.body;
    const newPost = await prisma.todo.create({
        data: req.body,
      });
    res.json(newPost)  

    // const user =  await prisma.todo.create({
    //     data : {
    //         title,
    //         content,
    //         date,
    //         userId:hashedPassword
    //     }
    // })


});


router.get("/task/:id", async (req, res, next) => {

    try {
        const {id} = req.params
        const task = await prisma.todo.findUnique({
            where: { id: Number(id) },
        });
        if (task) {
            res.json(task);
        }
        else {
            res.json({ error: 'Post not found.'});
        }
    } catch (error) {
        next(error) 
        }

});


router.get("/tasks", async (req, res, next) => {
    try {
        const task = await prisma.todo.findMany();
        res.json(task)    
    } catch (error) {
        next(error)
    }
    
});




module.exports = router;