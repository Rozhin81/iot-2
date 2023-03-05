let jwt = require("jsonwebtoken");
let { accounts } = require("../model/account");

class Token {
  generateToken(email) {
    let token = jwt.sign({ email: email }, process.env.SECRET_KEY, {
      expiresIn: 100000,
    });
    return token;
  }

  existToken(req, res, next) {
    let token = req.headers["x-access-token"] || req.headers["authorization"];
    if (!token) {
      return res.status(404).send({
        status: "error",
        message: "login to your account",
      });
    } else next();
  }

  verifyToken(token) {
    let p = new Promise((resolve, reject) => {
      try {
        var decoded = jwt.verify(token, process.env.SECRET_KEY);
        resolve(decoded);
      } catch (err) {
        reject("failed");
      }
    });
    return p;
  }
}

module.exports = { Token };
