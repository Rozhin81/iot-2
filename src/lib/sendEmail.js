const fs=require("fs");
const handlebar=require("handlebars");
const nodemailer = require("nodemailer");
let ejs = require('ejs');

function send_email(path,replacement,email,subject) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    // auth: {
    //   user: "rojanrahmani2002@gmail.com",
    //   pass: "fwgizfclwmdgzlsa",
    // }


    host : "mail.viraelectro.ir",
    port: 465,
    secure: true,
    auth: {
      user: 'virateam@viraelectro.ir	',
      pass: '0KD_d)KY^Iwe',
    }
  });
  
    ejs.renderFile( "./src/views/"+path, replacement, (err, data) => {
      if (err) {
        console.log(err) ;
      } else {
        let message = {
          // from: "twenty@rahavard-systems.ir",
          from: "rojanrahmani2002@gmail.com",
          to: email,
          subject: subject,
          html: data,
        };
        transporter.sendMail(message, (err, info) => {
          if (err) {
            console.log(err);
          } else {
            console.log("email successfully sent");
          }
        });
      }
    });
  }

module.exports = { send_email };
