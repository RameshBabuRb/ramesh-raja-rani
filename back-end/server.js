// app.js
var cors = require('cors')
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());
app.use(cors({
  orgin:["https://ramesh-raja-rani-frontend.vercel.app"],
  method:["POST","GET"],
  credential:true
}));

// Get all users
app.post('/users', (req, res) => {
    const { FinalList, swapMail } = req.body
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "rameshpersonal99@gmail.com",
            pass: process.env.apppassword
        }
    });
    if (swapMail && Object.keys(swapMail).length > 0) {
        const mailOptions = {
            from: "example@gmail.com",
            to: swapMail.email,
            subject: "Raja - Rani Game Title",
            html: `Your Swap Title is ${swapMail.title}`
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log("Email sent: " + info.response);
            }
        });
    } else {
        Object.keys(FinalList).map((email) => {
            const mailOptions = {
                from: "example@gmail.com",
                to: email,
                subject: "Raja - Rani Game Title",
                html: `Your Title is ${FinalList[email]}`
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log("Email sent: " + info.response);
                }
            });
        })
    }
});

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
