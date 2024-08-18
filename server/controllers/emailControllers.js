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
            user: "lornajules2@gmail.com",
            pass: "otkfkrwfqlcpfpbi",
        },
    })
);

const sendEmail = expressAsyncHandler(async (req, res) => {
    const { email, message, subject, pseudo } = req.body;

    var mailOptions = {
        from: email,
        to: "lornajules2@gmail.com",
        name: pseudo,
        subject: subject,
        text: `De: ${pseudo}\nEmail: ${email}\nMessage: ${message}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            res.json(info.response);
        }
    });
});

module.exports = { sendEmail };
