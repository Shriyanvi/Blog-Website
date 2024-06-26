const nodemailer = require("nodemailer");
const bodyParser = require('body-parser');
const crypto = require('crypto');
module.exports.transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'aditi2003goyal@gmail.com', // replace with your Gmail email
      pass: 'quya pyuk vwhd iuxu', // replace with your Gmail password
    },
  });

module.exports.generateToken=()=>{
    return crypto.randomBytes(16).toString('hex');
}