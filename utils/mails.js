const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path'); 

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
function sendPasswordResetMail(to, subject, text) {
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



// / Function to send mail to confirm email
function sendConfirmMail(to, subject, resendUrl, username) {
  // Read the HTML template
  const templatePath = path.join(__dirname, '../templates/confirm_email.html');
  let htmlContent = fs.readFileSync(templatePath, 'utf8');

  // Replace the placeholder with the actual reset URL
  htmlContent = htmlContent.replace('{{resendUrl}}', resendUrl);
  htmlContent = htmlContent.replace('{{username}}', username);

  const mailOptions = {
    from: 'your_email@gmail.com',
    to,
    subject,
    html: htmlContent,
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
  sendPasswordResetMail,sendConfirmMail
};
