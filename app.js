const express = require('express');
const bodyParser = require('body-parser');
// const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');s


app = express();


app.use(bodyParser.json());
app.use(cors());


const userRouter = require('./routes/users');
const todoRouter = require('./routes/todos');

// Use routers with specific paths
app.use('/api', userRouter);
app.use('/api', todoRouter);



app.get('/', (req, res) => {
    res.json("hello");
});


app.listen(3000, () => {
    console.log('app is running on port 3000');
});