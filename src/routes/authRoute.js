const router = require('express').Router();


const { authhome, 
    register,
    login,
    logout,
    current_user,
    requestPasswordReset,
    resetPassword,
    resendConfirmationMail,
    confirmEmail } = require('../controllers/authController');

const { authMiddleware } = require('../middlewares/authMiddleware');


router.get("/authhome", authhome);

router.post("/register", register);

router.post("/login", login);

router.get("/logout", authMiddleware, logout);

router.get("/current_user", authMiddleware, current_user);

router.post("/request-reset", requestPasswordReset);

router.post("/reset-password/:token", resetPassword);

router.post("/resendConfirmationMail", authMiddleware, resendConfirmationMail);

router.get("/confirm-email/:token", confirmEmail);





module.exports = router;