const { AuthService } = require("../../services/authService");
const { Token } = require("../../lib/token");
const token = new Token();
const { accounts } = require("../../model/account");
const jwt = require("jsonwebtoken");
const { Validation } = require("../../lib/validation");
const { send_email } = require("../../lib/sendEmail");
const { hashs } = require("../../model/hash");
const Role = require("../../lib/roles_list");

module.exports = {

  registerUser: async function (req, res) {
    let pass = req.body.password.trim();
    let email = req.body.email.trim();
    let existing = await Validation.existToDB(email);
    if (existing == true) {
      res.status(406).send({
        status: "error",
        message: "There is an account with this email",
        data: {}
      })
    } else {
      let hashed = await AuthService.hashPassword(pass)
      AuthService.addNewPerson(req.body, hashed , Role.USER).then((user)=>{
        let userToken = token.generateToken({ email: user.email, id: user._id, role: Role.USER});
        userToken.then((token) => {
          send_email(
            "sendLink.html",
            (replacement = {
              name: req.body.fullname,
              link: `http://178.63.147.27:3000/accounts/verify?token=${token}`,
            }),
            req.body.email,
            "Verify your account"
          );
          return res.status(201).send({
            status: "Ok",
            message:
              "please verify your account by follow the link that sent to your email address",
            data: {}
          });
        })
      }).catch((e)=>{
        return res.status(403).send({
          status: "error",
          message:
            "can't register your account,try again later!",
          data: {}
        });
      })
     
    }
  },

  loginUser: async (req, res) => {
    const email = req.body.email.trim();
    const password = req.body.password.trim();
    let p = AuthService.loginCheck(email, password);
    p.then(async (message) => {
      let userToken = await token.generateToken({ email: message.email, id: message._id, role: message.role }).then((data) => {
        console.log(data)
        return data;
      }).catch((error) => { return error });
      return res.status(200).send({
        status: "Ok",
        message: "welcome to your page",
        data: {
          token: userToken,
        },
      });

    }).catch((message) => {
      jwt.verify(user_token, process.env.SECRET_KEY,{
        ignoreExpiration:true
      },async function(err,decoded){
        if(decoded){
          console.log(decoded.email);
          await accounts.findOneAndDelete({email:decoded.email,status:"deactive"});
        }
      });
      if (message == 403) {
        return res.status(403).send({
          status: "error",
          message: "your account is deactivated.verify your account",
          data: {},
        });
      } else {
        return res.status(401).send({
          status: "error",
          message: "email or password is wrong",
          data: {},
        });
      }
    });
  },

  verifyUser: (req, res, next) => {
    const user_token = req.query.token;
    let p = token.verifyToken(user_token);
    p.then(async (message) => {
      AuthService.find_Update(message.email, { status: "active" });
      return res.status(200).send({
        status: "Ok",
        message: "set account to active",
        data: {},
      });
    }).catch((message) => {
      return res.status(406).send({
        status: "error",
        message: "the token is not correct or expired",
        data: {},
      });
    });
  },


  forgetPassword: async (req, res, next) => {
    const email = req.body.email.trim();
    let user = await Validation.existToDB(email);
    if (user == true) {
      let randomHash = await AuthService.hashPassword("\\w+")
      AuthService.deleteHash(email);
      AuthService.addHash(email, randomHash);
      let userToken = await token.generateToken({ email: email });
      console.log(userToken)
      send_email(
        "sendLink.html",
        (replacement = {
          name: user.fullname,
          link: `http://localhost:3000/accounts/reset-password?hash=${randomHash}`,
        }),
        email,
        "Reset password"
      );
      return res.status(200).send({
        status: "ok",
        message: "the message is sent to your email address",
        data: {
          token: userToken
        },
      });
    } else {
      return res.status(404).send({
        status: "error",
        message: "email not found",
        data: {},
      });
    }
  },


  resetPass: async (req, res) => {
    let findHash = await hashs.findOne({ hash: req.query.hash });
    try{
      console.log(findHash)
      console.log(Date.now() - findHash.time_created)
      if (Date.now() - findHash.time_created <= 172800000) {
        let hash = await AuthService.hashPassword(req.body.password);
        let p = token.verifyToken(req.body.token);
        p.then(async (message) => {
          AuthService.find_Update(message.email, { password: hash })
          return res.status(200).send({
            status: "Ok",
            message: "your password was reset successfully!",
            data: {},
          })
        })
          .catch((message) => {
            return res.status(406).send({
              status: "error",
              message: "the token was not correct or expired.",
              data: {},
            });

          });

      }
      else {
        return res.status(403).send({
          status: "error",
          message: "your reset time has been expired,try again.",
          data: {},
        });
      }
    }catch{
      console.log("can't find hash")
    }

  },



  editProfile: async (req, res, next) => {
    let user = await accounts.findOne({ email: req.decoded.email });
    let hashPass =
      req.body.password.length < 8
        ? user.password
        : await AuthService.hashPassword(req.body.password);
    console.log(hashPass)
    let fullname = req.body.fullname.trim().length <= 0 ? user.fullname : req.body.fullname;
    AuthService.find_Update(req.decoded.email, {
      fullname: fullname,
      password: hashPass,
    });

    res.status(200).send({
      status: "Ok",
      message: "your profile is updated",
      data: {},
    });

  },

  changeRoles :(req,res,next)=>{
      AuthService.updateRole(req.body.user_email , req.body.newRole)
      .then((message)=>{
      return res.status(200).send({
        status : "Ok" ,
        message : "Change the role of given user" ,
        data : {message}
      })
      }).catch((message)=>{
      return res.status(404).send({
        status : "error" ,
        message : "can't find user" ,
        data : {}
      })
      })
  },

  googleVerify: async (req, res) => {
    let DB = [];
    try {
      if (req.body.credential) {
        const verificationResponse = await token.verifyGoogleToken(req.body.credential);
        console.log(verificationResponse)

        if (verificationResponse.error) {
          return res.status(400).send({
            status: "error",
            message: "there is an error",
            data: verificationResponse.error
          });
        }

        const profile = verificationResponse?.payload;

        DB.push(profile);

        res.status(201).send({
          status: "ok",
          message: "Signup was successful",
          user: {
            firstName: profile?.given_name,
            lastName: profile?.family_name,
            picture: profile?.picture,
            email: profile?.email,
            token: jwt.sign({ email: profile?.email }, process.env.SECRET_KEY, {
              expiresIn: "1d",
            }),
          },
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "An error occurred. Registration failed.",
      });
    }
  }



};
