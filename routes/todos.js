// routes/users.js
const router = require('express').Router();

const { authMiddleware, currentuser } = require('../utils/helpers');
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
router.post("/create", authMiddleware, async (req,res,next) => {

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
router.get("/task/:id", authMiddleware,async (req, res, next) => {
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
        const user_Id = await prisma.user.findUnique({
            where: { id: Number(id) },
        });
        console.log(user_Id)
        if (!user_Id) {
            res.json({'error': 'User Does Notddddd Exist!'})
        }
        const task = await prisma.todo.findMany({
            where: { userId: Number(id) }
            // where: { User: user_Id }
        });
        res.json(task);  
    } catch (error) {
        next(error)
        }
});



// GET ALL TASK BY A PARTICULAR USER
router.get("/user_tasks/:user", async (req ,res, next) => {
    try {
        const {user} = req.params
        const user_Id = await prisma.user.findUnique({
            where: { username: user },
        });
        if (!user_Id) {
            res.json({'error': 'User Does Not Exist!'})
        }
        const task = await prisma.todo.findMany({
            where: { User: user_Id }
        });
        res.json(task);  
    } catch (error) {
        next(error)
        }
});


// UPDATE A TASK USING ID
router.put("/task/:id", authMiddleware, async(req, res, next) => {

    // const { name, email, password } = req.body;
    try {
        const {id} = req.params
        const taskId = await prisma.todo.findUnique({
            where: { id: Number(id) },
   
        });

        if (!taskId) {
            res.json({'error': 'Task Not Found!'})
        } 
        
        else if (taskId.userId !== req.session.user.id) {
            return res.status(403).json({ error: 'You are not the author of this post' });
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
router.delete("/task/:id", authMiddleware, async(req, res, next) => {

    // const { name, email, password } = req.body;
    try {
        const {id} = req.params
        const taskId = await prisma.todo.findUnique({
            where: { id: Number(id) },
        });
        if (!taskId) {
            res.json({'error': 'Task Not Found!'})
        } else if (taskId.userId !== req.session.user.id) {
            return res.status(403).json({ error: 'You are not the author of this post' });
            }  
        else {
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