const User = require("../models/User")

module.exports = {
  async index(req, res) {
    
    return res.json({ message: "hello world!" })
  },
  async store(req, res) {
    const { name, email, password } = req.body;
    try {

      const userAlreadyExists = await User.findOne({
        where: { email }
      });
      
      if (userAlreadyExists) {
        return  res.status(400).json({message: "User Already exists"});
      };

      const user = await User.create({name, email, password})

      user.password = undefined;

      return res.status(200).json({user});
    } catch(err) {
      console.log(err)
      return res.status(400).json({message: "Registration failed"});
    };

  }
}