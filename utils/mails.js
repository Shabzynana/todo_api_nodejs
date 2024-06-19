const nodemailer = require('nodemailer');

// Configure nodemailer
// const transporter = nodemailer.createTransport({
//   service: 'Gmail',
//   auth: {
//     user: 'your_email@gmail.com',
//     pass: 'your_email_password',
//   },
// });

const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.USER_MAIL,
      pass: process.env.PASSWORD_MAIL
    }
});


// Function to send email
function sendMail(to, subject, text) {
  const mailOptions = {
    from: 'your_email@gmail.com',
    to,
    subject,
    text,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
}

module.exports = {
    sendMail,
};