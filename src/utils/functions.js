const { prisma } = require('../../prisma/client');


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