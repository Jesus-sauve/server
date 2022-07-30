const User = require('../models/user');
const shortId = require('shortid');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const nodeMailer = require('nodemailer');
const { hashPassword, comparePassword } = require('../utils/auth');
const { errorHandler } = require('../helpers/dbErrorHandler');
const _ = require('lodash');

exports.signup = async (req, res) => {
    try {
    // console.log(req.body);
    const { nom, email, password } = req.body; 

    if (!nom) return res.status(400).send("Veuillez saisir votre nom");

    if (!(email).toLowerCase().match( /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
        return res
        .status(400)
        .send("Adresse mail invalid");
    }

     if (!password || password.length < 6) {
      return res
        .status(400)
        .send("Le mot de passe doit être supérieur ou égale à 6 caractères");
    }

    let userExist = await User.findOne({ email }).exec();
    if (userExist) return res.status(400).send("Erreur email ou email déjà utilisée");
            // hash password
    const hashedPassword = await hashPassword(password);

    // register
    const user = new User({
        nom,
        email,
        password: hashedPassword,
    });

    await user.save();

    return res.json({ ok: true });
} catch (err) {
    console.log(err);
    return res.status(400).send("Erreur...");
  }
};


exports.signin = async (req, res) => {
    try {

        const { email, password } = req.body;
    // check if user exist
    const user = await User.findOne({ email }).exec() ;

        if (!user) {
            return res.status(400).json({
                error: 'Aucun utilisateur trouvé avec cette adresse mail, merci de vous inscrire'
            });
        }

        // authenticate
        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.status(400).json({
                error: "L'email et le password ne correspondent pas"
            });
        }

        if (!(email).toLowerCase().match( /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
            return res
            .status(400)
            .send("Adresse mail invalid");
        }

        if (!password || password.length < 6) {
        return res
            .status(400)
            .send("Le mot de passe doit être supérieur ou égale à 6 caractères");
        }

        // generate a token and send to client
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { 
            expiresIn: '7d' 
        });

        user.password = undefined;
        // send token in cookie

        res.cookie('token', token, { 
           httOnly: true,
        //    secure: true
        });

        // send user as json response
        res.json(user);

    } catch (error) {
        console.log(error);
        return res.status(400).send("Erreur...")
    }
};

exports.logout = async (req, res) => {
    try {
      res.clearCookie("token");
      return res.json({ message: "Déconnexion" });
    } catch (err) {
      console.log(err);
    }
  };
  
exports.currentUser = async (req, res) => {
try {
    const user = await User.findById(req.user._id).select("-password").exec();
    console.log("CURRENT_USER", user);
    return res.json({ ok: true });
} catch (err) {
    console.log(err);
}
};

exports.forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;
      // console.log(email);
      const shortCode = shortId.generate().toUpperCase();
      const user = await User.findOneAndUpdate(
        { email }, 
        {passwordResetCode: shortCode}
      );
      if(!user) return res.status(400).send('Utilisateur non trouvé');
  
      // prepare for email
      const transporter = nodeMailer.createTransport({
        service: 'hotmail',
            auth: {
                user: 'basebiblique@hotmail.com',
                pass: 'Jesus-sauve'
            }
        });
    // email
    const emailData = {
        from: "basebiblique@hotmail.com",
        to: email,
        subject: `Régénérez votre mot de passe`,
        html: `
              <html>
                <h1>Réinitialiser le mot de passe</h1>
                <p>Veuillez utiliser ce code pour réinitialiser votre mot de passe</p>
                <h2 style="color:red;">${shortCode}</h2>
                <i>basebiblique.org</i>
              </html>
            `
    };
    transporter.sendMail(emailData).then((data) => {
      console.log(data);
      res.json({ ok: true });
    })
    .catch((err) => {
      console.log(err);
    });
      } catch (err) {
        res.status(400).send("Erreur...")
      console.log(err);
      }
  };
  
  exports.resetPassword = async (req, res) => {
    try {
      const { email, code, newPassword } = req.body;
      // console.table({ email, code, newPassword });
      const hashedPassword = await hashPassword(newPassword);
  
      const user = User.findOneAndUpdate(
        {
          email,
          passwordResetCode: code,
        },
        {
          password: hashedPassword,
          passwordResetCode: "",
        }
      ).exec();
      res.json({ ok: true });
    } catch (err) {
      console.log(err);
      return res.status(400).send("Erreur.");
    }
  };
  