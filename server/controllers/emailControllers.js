const expressAsyncHandler = require("express-async-handler");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
dotenv.config();

var smtpTransport = require("nodemailer-smtp-transport");

var transporter = nodemailer.createTransport(
    smtpTransport({
        service: "gmail",
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: "cjmafia29@gmail.com",
            pass: "garkflvsnpfabmbe",
        },
    })
);

const sendEmail = expressAsyncHandler(async (req, res) => {
    const { email, message, subject, pseudo } = req.body;
    console.log(email, subject, message, pseudo);

    var mailOptions = {
        from: email,
        to: "cjmafia29@gmail.com",
        name: pseudo,
        subject: subject,
        text: `De: ${pseudo}\nEmail: ${email}\nMessage: ${message}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log("Email sent: " + info.response);
        }
    });
});

module.exports = { sendEmail };
