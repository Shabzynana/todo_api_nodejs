// routes/users.js
const router = require('express').Router();

const { authMiddleware} = require('../utils/helpers');
const { prisma } = require('../prisma/client');




// TEST ROUTE
router.get("/taskhome", async (req, res) => {
    res.json("Todo route is up");

});



// GET ALL TASK IN THE DATABASE
router.get("/tasks", async (req, res, next) => {
    try {
        const task = await prisma.todo.findMany();
        res.json(task)    
    } catch (error) {
        next(error)
    }
    
});


// CREATE TASK
router.post("/create",  authMiddleware, async (req,res,next) => {

    const { title, content, date, userId} = req.body;
    try{
        const newPost = await prisma.todo.create({
            // data: req.body,
            data : {
                title,
                content,
                date,
                userId : req.session.user.id,
            }
          });
        res.json(newPost)  
    } catch (error) {
        next(error)
    }
    
});


// GET A TASK BY ID
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
            res.json({ error: 'Task not found.'});
        }
    } catch (error) {
        next(error) 
        }
});


// GET ALL TASK BY A PARTICULAR USER
router.get("/user_task/:id", async (req ,res, next) => {
    try {
        const {id} = req.params
        const userId = await prisma.user.findUnique({
            where: { id: Number(id) },
        });
        if (!userId) {
            res.json({'error': 'User Does Not Exist!'})
        }
        const task = await prisma.todo.findMany({
            where: { userId: Number(id) }
        });
        console.log(task);
        res.json(task);  
    } catch (error) {
        next(error)
        }
});


// UPDATE A TASK USING ID
router.put("/task/:id", async(req, res, next) => {

    // const { name, email, password } = req.body;
    try {
        const {id} = req.params
        const taskId = await prisma.todo.findUnique({
            where: { id: Number(id) },
        });
        if (!taskId) {
            res.json({'error': 'Task Not Found!'})
        } else {
            const task = await prisma.todo.update({
                where : {id : Number(id)},
                data: req.body,
            });
            res.json(task)
        }
    } catch (error) {
        next(error)
    }    

});


// DELETE TASK USING ID
router.delete("/task/:id", async(req, res, next) => {

    // const { name, email, password } = req.body;
    try {
        const {id} = req.params
        const taskId = await prisma.todo.findUnique({
            where: { id: Number(id) },
        });
        if (!taskId) {
            res.json({'error': 'Task Not Found!'})
        } else {
            const task = await prisma.todo.delete({
                where : {id : Number(id)},
            });
            res.json({'msg': 'Task Deleted', task})
        }
    } catch (error) {
        next(error)
    }    
});




module.exports = router;