// routes/users.js

const { prisma } = require('../../prisma/client');
// const { authMiddleware } = require('../middlewares/authMiddleware');
const { hashPassword, comparePassword, currentuser} = require('../services/authService');
const { signToken, validateToken, JWT_SECRET, RESET_TOKEN_SECRET, EMAIL_TOKEN_SECRET } = require('../services/tokenService');
const { sendPasswordResetMail, sendConfirmMail } = require('../services/emailService');


 

// TEST ROUTE
async function authhome(req, res) {
  res.json("auth route is up");

};

async function register(req, res, next)  {
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

        const sendToken = signToken({ id: user.id, email: user.email }, EMAIL_TOKEN_SECRET, '10m');
        const resendUrl = `http://localhost:3000/api/confirm-email/${sendToken}`;

        try {   
          await sendConfirmMail(user.email, 'Email Confirmation', resendUrl, user.username);
          res.json({ message: 'Please chceck your email, An email as been sent to confirm your account', user})
          console.log(user.email, 'after email')
        } catch (error) {
          next(error)
        }


        // res.json(user);
    } catch (error) {
        next(error)
    }
};


// Login route
async function login (req, res, next) {
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
  }; 


// Logout route
async function logout (req, res) {
    req.session.destroy(err => {
        if (err) {
        return res.status(500).send({"error": "Failed to logout"});
        }
        res.clearCookie('connect.sid');
        res.json('Logout successful');
    });
};  


// Route to get current logged-in user
async function current_user (req, res) { 
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
  };





// Request password reset
async function requestPasswordReset(req, res, next) {
  const { email } = req.body;
  // const user = users.find((u) => u.email === email);
  const user = await prisma.user.findUnique({
    where: { email: email },
  });

  if (!user) {
    return res.status(404).json({ message: 'Email not found' });
  }

  const resetToken = signToken({ id: user.id, email: user.email }, RESET_TOKEN_SECRET, '10m');
  // const resetUrl = `http://localhost:3000/api/reset-password?token=${resetToken}`;
  const resetUrl = `http://localhost:3000/api/reset-password/${resetToken}`;


  try {
    await sendPasswordResetMail(user.email, 'Password Reset', `Click the following link to reset your password: ${resetUrl}`);
    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    next(error)
    // res.status(500).json({ message: 'Error sending email', error });
  }
};


// route to reset password??
async function resetPassword(req, res){
  const { token } = req.params;
  const { password } = req.body;  

  try {
    const decoded = validateToken(token, RESET_TOKEN_SECRET);

    // const user = users.find((u) => u.id === decoded.id);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });
    console.log(user)
  
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

  } catch (error) {
    next(error)
    // res.status(400).json({ message: error.message });
  }
};
  

// Resend Confirmation Mail
async function resendConfirmationMail(req, res, next) {

  const userId = req.session.user.id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  console.log(user.email, 'before email')

  const resendToken = signToken({ id: user.id, email: user.email }, EMAIL_TOKEN_SECRET, '10m');
  const resendUrl = `http://localhost:3000/api/confirm-email/${resendToken}`;

  try {   
    await sendConfirmMail(user.email, 'Email Confirmation', resendUrl, user.username);
    res.json({ message: 'Please chceck your email, An email as been sent to confirm your account'})
    console.log(user.email, 'after email')
  } catch (error) {
    next(error)
  }
};



// route to confirm email/account
async function confirmEmail(req, res, next) {
  const { token } = req.params;

  try {
    const decoded = validateToken(token, EMAIL_TOKEN_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });
    console.log(user) 
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const updateUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        confirmed: true,
        confirmedAt: new Date(),
      },
    })
    res.json({ message: 'Your Email as been confirmed', updateUser });

  } catch (error) {
    next(error)
    }
};












module.exports = {
  authhome,
  register,
  login,
  logout,
  current_user,
  requestPasswordReset,
  resetPassword,
  resendConfirmationMail,
  confirmEmail };
