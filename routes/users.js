// routes/users.js
const router = require('express').Router();

const { prisma } = require('../prisma/client');
const { authMiddleware, hashPassword, comparePassword, currentuser} = require('../utils/helpers');
const { signToken, validateToken, JWT_SECRET, RESET_TOKEN_SECRET } = require('../utils/tokens');
const { sendMail } = require('../utils/mails');


router.get('/asd', authMiddleware, currentuser, (req, res) => {
    console.log(currentuser)
    res.json(currentuser);
});



router.get('/asd', (req, res) => {
  res.json("User route is up");
});

router.get('/users', async (req, res) => {

    const allUsers = await prisma.user.findMany()
    res.json(allUsers)
});
 

router.post('/register', async(req, res, next) => {
    const { email, firstname, lastname, username, password, gender } = req.body;

    try {
        const user =  await prisma.user.create({
            data : {
                email,
                firstname,
                lastname,
                username,
                gender,
                password: hashPassword(password) 
            }
        })
        res.json(user);
    } catch (error) {
        next(error)
    }
});


// Login route
router.post('/login', async (req, res, next) => {
    const { email, password } = req.body;
    try {
      const user = await prisma.user.findUnique({
        where: { email }
      });
      if (!user) {
        res.json({"error": "Email is Invalid!"})
      }
      // if (user && (user.password)) {
      if (user && comparePassword(password, user.password)) {
        req.session.user = { id: user.id, 
                             username: user.username };
        res.send({"msg" : "Login successful"});
      } 
        // else if (user || (!user.password)) {
        else if (user || (!comparePassword(password, user.password))) {
        res.json({"error": "Password is Incorrect!"})
      } else  {
        res.status(401).send('Invalid username or password');
      }
    } catch (error) {
        next(error)
    //   res.status(500).send('Error logging in');
    }
  }); 


// Logout route
router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
        return res.status(500).send({"error": "Failed to logout"});
        }
        res.clearCookie('connect.sid');
        res.json('Logout successful');
    });
});  




// Route to get current logged-in user
router.get('/current_user', authMiddleware, async (req, res) => {
    const userId = req.session.user.id;
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, username: true } // Adjust the selected fields as needed
      });
      if (user) {
        res.json(user);
      } else {
        res.status(404).send('User not found');
      }
    } catch (error) {
      res.status(500).send('Error fetching user data');
    }
  });


// GET user by id
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



// Request password reset
router.post('/request-reset', async (req, res, next) => {
  const { email } = req.body;
  // const user = users.find((u) => u.email === email);
  const user = await prisma.user.findUnique({
    where: { email: email },
  });

  if (!user) {
    return res.status(404).json({ message: 'Email not found' });
  }

  const resetToken = signToken({ id: user.id, email: user.email }, RESET_TOKEN_SECRET, '30m');
  // const resetUrl = `http://localhost:3000/api/reset-password?token=${resetToken}`;
  const resetUrl = `http://localhost:3000/api/reset-password/${resetToken}`;


  try {
    await sendMail(user.email, 'Password Reset', `Click the following link to reset your password: ${resetUrl}`);
    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    next(error)
    // res.status(500).json({ message: 'Error sending email', error });
  }
});




// Reset password
// app.post('/reset-password', async (req, res, next) => {
//   const { token, newPassword } = req.body;

router.post('/reset-password/:token', async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;  

  try {
    const decoded = validateToken(token, RESET_TOKEN_SECRET);

    // const user = users.find((u) => u.id === decoded.id);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });
    console.log(user)
    console.log(decoded.id)
    console.log(password, "sad")
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    

    // const updatePassword = await prisma.user.update({
    await prisma.user.update({
 
      where: { id: user.id },
      data: {
        password: hashPassword(password),
      },
    })
    // user.password = hashPassword(newPassword);
    res.json({ message: 'Password reset successful' });
    console.log(password)



  } catch (error) {
    next(error)
    // res.status(400).json({ message: error.message });
  }
});
  















module.exports = router;
