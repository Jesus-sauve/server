const nodeMailer = require("nodemailer");
 
exports.sendEmailWithNodemailer = (req, res, emailData) => {
  const transporter = nodeMailer.createTransport({
    service: 'hotmail',
        auth: {
            user: 'basebiblique@hotmail.com',
            pass: 'Jesus-sauve'
        }
    });
 
  return transporter
    .sendMail(emailData)
    .then((info) => {
      console.log(`Message sent: ${info.response}`);
      return res.json({
        success: true,
      });
    })
    .catch((err) => {
      console.log(`Merci de vérifier les champs`)
      return res.json({
        error: "Merci de vérifier les champs"
    });
  });
};


