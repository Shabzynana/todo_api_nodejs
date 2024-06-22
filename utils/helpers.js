const bcrypt = require('bcrypt');
const { prisma } = require('../prisma/client');


// login required
function authMiddleware(req, res, next) {
    if (req.session.user) {
      next();
      // console.log('mee');
    } else {
      res.status(401).send('You need to log in first');
    }
}  



// aaa
async function ConfirmedUserMiddleware (req, res, next) {

  userId = req.session.user.id
  console.log(userId)

  user = await prisma.user.findUnique({
    where: { id: userId },
  })
  console.log(user)
  console.log(user.confirmed)
  if (user.confirmed === false) {
    res.status(401).send('You need to confirm your email first');
  } else {
    next();
  }
}  



async function currentuser (req, res, next) {

  const userId = req.session.user.id;
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true} // Adjust the selected fields as needed
      });
      if (user) {
        return res.json(user);
      } else {
        res.status(404).send('User not found');
      }
    } catch (error) {
      next(error)
      // res.status(500).send('Error fetching user data');
    }

} 




// Number of salt rounds for hashing
// Function to hash a password
// function hashPassword(password) {
//     const saltRounds = 10; 
//     // const salt = bcrypt.genSalt(saltRounds);
//     const hash = bcrypt.hash(password, saltRounds);
//     return (hash)
// }


// // Function to compare a password with a hash
// async function comparePassword(password, hash) {
//     try {
//         // const match = await bcrypt.compare(password, hash);
//         return await bcrypt.compare(password, hash);
//     } catch (error) {
//         throw new Error('Error comparing password');
//     }
// }


// // Function to hash a password
function hashPassword(password) {
    const salt = bcrypt.genSaltSync();
    return bcrypt.hashSync(password, salt);
}

// // Function to compare a password with a hash  
function comparePassword(raw, hash) {
    return bcrypt.compareSync(raw, hash);
}  
  
module.exports = {
    authMiddleware, hashPassword, comparePassword, currentuser, ConfirmedUserMiddleware
};