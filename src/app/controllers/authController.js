const bcrypt = require("bcryptjs");
const User = require("../models/User");
const crypto = require("crypto");
const mailer = require("../../modules/mailer");
const tokenGenerate = require("../functions/tokenGenerate")

module.exports = {
  async store(req, res) {
    const { name, email, password } = req.body;
    try {

      const userAlreadyExists = await User.findOne({
        where: { email }
      });
      
      if (userAlreadyExists) {
        return res.status(400).json({error: "User Already exists"});
      };

      const user = await User.create({name, email, password})

      user.password = undefined;
      const token = tokenGenerate({ id: user.id })

      return res.status(200).json({ user, token });
    } catch(err) {
      console.log(err)
      return res.status(400).json({error: "Registration failed"});
    };

  },

  async authenticate(req, res) {
    const { email, password} = req.body;

    try {
      const user = await User.findOne({ where: { email } })

      if (!user) {
        return res.status(400).json({ error: "User not found"});
      }

      // Aqui eu estou usando o bcrypt pra comparar se o password que o usuário passou
      // é igual ao password que está no banco de dados.
      if (!await bcrypt.compare(password, user.password)) {
        return res.status(400).json({ error: "Invalid password" })
      };

      user.password = undefined;
      const token = tokenGenerate({ id: user.id })

      return res.status(200).json({ user, token });

    } catch (err) {
      return res.status(400).json({ error: "Error" })
    }
  },

  async forgotPassword(req, res) {
    const { email } = req.body;

    try {
      const user = await User.findOne({ 
        where: { email } 
      });

      if (!user) {
        return res.status(400).json({ error: "User not found"});
      };

      const token = crypto.randomBytes(20).toString("hex");

      const now = new Date();
      now.setHours(now.getHours() + 1)


      await User.update({
        password_reset_token: token,
        password_reset_expires: now
      }, {
        where: { id: user.id }
      });

      await mailer.sendMail({
        to: email,
        from: "julio@gmail.com",
        template: "/auth/forgot_password",
        context: { token }
      }, (err) => {
        
        if (err) {
          console.log(err)
          return res.status(400).json({ error: "Cannot json forgot password email" });
        };

        return res.json({sucess: "token sent"});
      })

    } catch(err) {
      console.log(err)
      res.status(400).json({ error: "Erro on forgot password, try again" });
    }
  },
  
  async resetPassword(req, res) {
    const { email, token, password } = req.body;

    try {
      const user = await User.findOne({
         where: { email }
      });

      if (!user) {
        return res.status(200).send({ error: "User not found"});
      };

      if (token !== user.password_reset_token) {
        return res.status(400).json({ error: "Token invalid" })
      };

      const now = new Date();

      if (now > user.password_reset_expires) {
        return res.status(400).json({ error: "Token expired" })
      };

      user.password = password;

      user.password_reset_token = null;
      user.password_reset_expires = null;

      await user.save()

      return res.status(200).json();
    } catch(err) {
      return res.status(400).json({ error: "Cannot reset password, try again" });
    }
  },
}