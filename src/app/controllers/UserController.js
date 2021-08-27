const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

function tokenGenerate(params) {
  const token = jwt.sign(params, process.env.SECRET, {
    expiresIn: 86400,
  })

  return token;
};

module.exports = {
  async store(req, res) {
    const { name, email, password } = req.body;
    try {

      const userAlreadyExists = await User.findOne({
        where: { email }
      });
      
      if (userAlreadyExists) {
        return  res.status(400).json({error: "User Already exists"});
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
        return res.status(400).send({ error: "User not found"});
      }

      // Aqui eu estou usando o bcrypt pra comparar se o password que o usuário passou
      // é igual ao password que está no banco de dados.
      if (!await bcrypt.compare(password, user.password)) {
        return res.status(400).send({ error: "Invalid password" })
      } 
      user.password = undefined;
      const token = tokenGenerate({ id: user.id })

      return res.status(200).json({ user, token });

    } catch (err) {
      console.log(err)
      return res.status(400).send({ error: "Error" })

    }
  }
}