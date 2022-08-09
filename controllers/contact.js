const { sendEmailWithNodemailer } = require("../helpers/email");
 
exports.contactForm = (req, res) => {
  const { name, email, phone, message } = req.body;
 
  const emailData = {
    from: "basebiblique@hotmail.com", // MAKE SURE THIS EMAIL IS YOUR GMAIL FOR WHICH YOU GENERATED APP PASSWORD
    to: "basebiblique@gmail.com", // WHO SHOULD BE RECEIVING THIS EMAIL? IT SHOULD BE YOUR GMAIL
    subject: "Un message de Basebiblique.org",
    text: `Email reçut de la part de ${name}`,
    html: `
    <div style="width: 100%; background-color: #f3f9ff; padding: 5rem 0">
      <div style="max-width: 700px; background-color: white; margin: 0 auto">
        <div style="width: 100%; background-color: #000; padding: 20px 0">
        <a href="basebiblique.org" target="_blank"><img
            src="https://res.cloudinary.com/basebiblique/image/upload/v1657568781/basebiblique_xbptbo.jpg"
            style="width: 100%; height: 70px; object-fit: contain"
          /></a> 
        
        </div>
        <div style="width: 100%; gap: 10px; padding: 30px 0; display: grid">
          <p style="font-weight: 400; font-size: 2rem; padding: 0 30px; text-left: center; color: #c5a546">
           Message envoyé depuis le site
          </p>
          <div style="font-size: .8rem; margin: 0 30px">
            <p style="font-weight: 100; font-size: 20px; color: gray">Je suis <b>${name}</b></p>
            <p style="font-weight: 100; font-size: 20px; color: gray">Je suis  joignale au <b> +${phone}</b></p>
            <p style="font-weight: 100; font-size: 20px; color: gray">Mon email: <b>${email}</b></p>
            <p style="font-weight: 100; font-size: 20px; color: gray">Voici mon message: <b>${message}</b></p>
          </div>
        </div>
      </div>
    </div>
    `,
};
 
  sendEmailWithNodemailer(req, res, emailData);
};