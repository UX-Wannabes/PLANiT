const mjmlUtils = require("mjml-utils");
const transporter = require("./transporterGmail");
const path = require("path");
const pathToHtmlEmailTemplate = path.join(
  __dirname,
  "./mail_templates/welcome_mail.html"
);

const sendAwesomeMail = (to, variables, from = "PLANiT") => {
  return mjmlUtils
    .inject(pathToHtmlEmailTemplate, variables)
    .then(finalTemplate => {
      return transporter
        .sendMail({
          from: `"testingemailnano@gmail.com <${from}>`,
          to,
          subject: "Welcome to PLANiT", // Asunto
          html: `https://planit-ironhack.herokuapp.com/auth/confirm/${variables.code}`
        })
        .then(info => console.log(info));
    });
};
module.exports = sendAwesomeMail;
