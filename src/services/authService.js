const bcrypt = require('bcrypt');


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
    hashPassword, comparePassword
};