// routes/users.js

const { prisma } = require('../../prisma/client');


function userhome (req, res) {
    res.json("User route is up");
}; 


// async function currentuser (req, res) {
//     console.log(currentuser)
//     res.json(currentuser);
// };


async function allusers (req, res) {

    const allUsers = await prisma.user.findMany()
    res.json(allUsers)
};
 

// GET user by id
async function getuser (req, res, next) {
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
};


module.exports = { userhome, allusers, getuser };
