// routes/users.js
const { prisma } = require('../../prisma/client');




// TEST ROUTE
async function taskhome(req, res) {
    res.json("Todo route is up");

};



// GET ALL TASK IN THE DATABASE
async function allTasks(req, res, next) {
    try {
        const task = await prisma.todo.findMany();
        res.json(task)    
    } catch (error) {
        next(error)
    }
    
};


// CREATE TASK
async function createTask(req, res, next) {

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
    
};


// GET A TASK BY ID
async function getTask(req, res, next) {
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
};


// GET ALL TASK BY A PARTICULAR USER
async function userTasksId(req, res, next) {
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
};       



// GET ALL TASK BY A PARTICULAR USER USING USERNAME
async function userTasksUsername(req, res, next) {
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
};


// UPDATE A TASK USING ID
async function updateTask(req, res, next) {

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

};


// DELETE TASK USING ID
async function deleteTask(req, res, next) {

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
};




module.exports = {
    taskhome, 
    allTasks, 
    createTask, 
    getTask, 
    userTasksId, 
    userTasksUsername, 
    updateTask, 
    deleteTask};