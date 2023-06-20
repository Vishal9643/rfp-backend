const express = require("express");

const nodemailer = require("nodemailer");

const mailer = async (otp) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "mishra.vishal2990@gmail.com",
      pass: "vqkslobjgdnbtanc",
    },
  });

  // send mail with defined transport object
  const info = await transporter.sendMail();

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

  return info.messageId;
};

module.exports = mailer;
