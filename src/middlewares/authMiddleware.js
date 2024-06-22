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


module.exports = { authMiddleware, ConfirmedUserMiddleware};

