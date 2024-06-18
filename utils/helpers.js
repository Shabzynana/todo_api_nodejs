const bcrypt = require('bcrypt');

function authMiddleware(req, res, next) {
    if (req.session.user) {
      next();
      console.log('mee');
    } else {
      res.status(401).send('You need to log in first');
    }
}  

// Number of salt rounds for hashing

// Function to hash a password
// async function hashPassword(password) {
//     const saltRounds = 10; 
//     try {
//         // const salt = await bcrypt.genSalt(saltRounds);
//         const hash = await bcrypt.hash(password, saltRounds);
//         return hash;
//     } catch (error) {
//         throw new Error('Error hashing password');
//     }
// }

// // Function to compare a password with a hash
// async function comparePassword(password, hash) {
//     try {
//         const match = await bcrypt.compare(password, hash);
//         return match;
//     } catch (error) {
//         throw new Error('Error comparing password');
//     }
// }
function hashPassword(password) {
    const salt = bcrypt.genSaltSync();
    return bcrypt.hashSync(password, salt);
}
  
function comparePassword(raw, hash) {
    return bcrypt.compareSync(raw, hash);
}  
  
module.exports = {
    authMiddleware, hashPassword, comparePassword
};