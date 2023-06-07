let jwt = require("jsonwebtoken");
let {Token} = require("../lib/token");
let token = new Token();

class MiddleWare {
  static mailCheck(req, res, next) {
    const emailCheck = new RegExp(
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    );
    if (!emailCheck.test(req.body.email)) {
      return res.status(401).send({
        status: "error",
        message: "the email address is wrong",
      });
    } else next();
  };


  static emptyCheck(req, res, next) {
    let found = false;
    for (let key in req.body) {
      if (req.body[key].trim().length == 0) {
        found = true;
        return res.status(404).send({
          status: "error",
          message: "fill all fields",
        });
      }
    }
    if (!found) {
      next();
    }
  }

  static passwordCheck(req, res, next) {
    if (req.body.password.length < 8) {
      return res.status(406).send({
        status: "error",
        message: "the password is very short.it must be at least 8 characters",
      });
    } else next();
  }

  static confirmPassCheck(req, res, next) {
    if (req.body.password != req.body.confirmPassword) {
      return res.status(401).send({
        status: "error",
        message: "passwords that you entered do not matched",
      });
    } else next();
  }

  static existToken(req, res, next) {
    let token = req.headers["x-access-token"] || req.headers["authorization"];
    if (!token) {
      return res.status(403).send({
        status: "error",
        message: "login to your account",
      });
    } else next();
  }


  static checkToken(req, res, next) {
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    if (token) {
      var privateKey = process.env.SECRET_KEY
      jwt.verify(token, privateKey, {
      }, (err, decoded) => {
        if (err) {
          return res.status(403).send({
            status: "error",
            message: "login to your account",
          });
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      return res.status(403).send({
        status: "error",
        message: "token is missing",
      });
    }

  }

  static verifyRoles=(...allowedRoles)=>{
    return (req,res,next)=>{
      const roleArray = [...allowedRoles];
        const roles = req.decoded.role;
        const result = [roles].map(each_role => roleArray.includes(each_role)).find(val => val ==true);
        if(!result){
          res.status(403).send({
          status : "access denid" ,
          message : "You dont have permission to this url"
        })
      }else{
        next()
      }
    }
  }


}

module.exports = { MiddleWare };
