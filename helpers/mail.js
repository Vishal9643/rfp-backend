const express = require("express");

const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper

const mailer = async (otp) => {
  // const otp = 123456

  // console.log(data)

  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  // let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    // host: "smtp.gmail.com",
    // port: 465,
    // service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "mishra.vishal2990@gmail.com",
      pass: "qujgxcklxmppnqsb",
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: process.env.EMAIL, // sender address
    to: `${otp.email}`, // list of receivers
    subject: "Test OTP ✔", // Subject line
    text: "Hello world?", // plain text body
    html: `<b>Your OTP is : <br> ${otp.OTP}</b>`, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

  return info.messageId;
};

// main().catch(console.error);

module.exports = mailer;
