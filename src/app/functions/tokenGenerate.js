const jwt = require("jsonwebtoken");

function tokenGenerate(params) {
  const token = jwt.sign(params, process.env.SECRET, {
    expiresIn: 86400,
  })

    console.log("Na prisão")
  return token;
};

module.exports = tokenGenerate;