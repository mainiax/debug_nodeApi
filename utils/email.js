const nodemailer = require('nodemailer');
const sendEmail = async (options) => {
  //1 create a trnsporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  //2 define the email options
  const mailOptions = {
    from: 'Mainiax Mainiax <hell@jonas.io>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};
module.exports = sendEmail;
