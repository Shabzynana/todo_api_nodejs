const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();



const app = express();






app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser())

app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 60 * 60 * 1000} // Use secure: true if using HTTPS
  }));

const userRouter = require('./routes/users');
const todoRouter = require('./routes/todos');

// Use routers with specific paths
app.use('/api', userRouter);
app.use('/api', todoRouter);

// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).json({ error: 'Something went wrong!' });
//   });

app.get('/', (req, res) => {
    res.json("Server is online");
});


app.listen(3000, () => {
    console.log('app is running on port 3000');
});

// module.exports = { session, prisma };

// exports.prisma = prismaa;
// exports.session = sessions



