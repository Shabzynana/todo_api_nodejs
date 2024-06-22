const router = require('express').Router();


const { userhome, allusers, getuser } = require('../controllers/userController');


router.get("/userhome", userhome);

router.get("/users", allusers);

router.get("/user/:id", getuser);


module.exports = router