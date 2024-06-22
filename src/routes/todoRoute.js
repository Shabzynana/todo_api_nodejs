const router = require('express').Router();


const { taskhome, allTasks, createTask, getTask, userTasksId, userTasksUsername, updateTask, deleteTask } = require('../controllers/todoController');
const { authMiddleware } = require('../middlewares/authMiddleware');



router.get("/taskhome", taskhome);

router.post("/create", authMiddleware, createTask);

router.get("/tasks", allTasks);

router.get("/task/:id", authMiddleware, getTask);

router.get("/user_task/:id", userTasksId);

router.get("/user_tasks/:user", userTasksUsername);

router.put("/task/:id", authMiddleware, updateTask);

router.delete("/task/:id", authMiddleware, deleteTask);



module.exports = router;