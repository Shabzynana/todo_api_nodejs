const bcrypt = require('bcrypt');

// login required
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
    authMiddleware, hashPassword, comparePassword
};