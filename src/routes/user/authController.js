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
        let userToken = token.generateToken({ email: user.email, id: user._id, role: Role.USER} , '900000');
        userToken.then((token) => {
          send_email(
            "verifyEmail.ejs",
            {
              name: req.body.fullname,
              user_token:token
            },
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
      await token.generateToken({ email: message.email, id: message._id, role: message.role },'3024000000')
      .then((data) => {
          console.log(data)
        return res.status(200).send({
          status: "Ok",
          message: "welcome to your page",
          data: {
            token: data,
          }
        });
      }).catch((error) => { return error });
    }).catch((message) => {
      console.log(message)
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

  
  verifyUser: async(req, res, next) => {
    const user_token = req.query.token;
    let p = token.verifyToken(user_token);
    p.then(async (message) => {
        AuthService.find_Update(message.email, { status: "active" });
        res.render("emailVerified.ejs" ,  console.log("set account to active"))

    }).catch(async(message) => {
      let checkStatus = await accounts.findOne({email : message.email})
      if(checkStatus.status=='deactive'){
        await accounts.deleteOne({email : message.email});
        return res.status(401).send({
          status: "error",
          message: "the token is not correct or expired",
          data: {},      
        });
      }else{
        // 208 : qablan gozaresh shode
        return res.status(208).send({
          status: "error",
          message: "your account was activated",
          data: {},
        });
      }

    });
  },


  forgetPassword: async (req, res, next) => {
    const email = req.body.email.trim();
    let user = await Validation.existToDB(email);
    if (user != false) {
      let randomHash = await AuthService.hashPassword("\\w+")
      AuthService.deleteHash(email);
      AuthService.addHash(email, randomHash);
      let userToken = await token.generateToken({ email: email } , '900000');
      console.log(userToken)
      send_email(
        "forgetPass.ejs",
        {
          name : user.fullname,
          token : userToken,
          forgetDynamicUrl : randomHash,
        },
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

  resetPassPage : (req,res)=>{
    res.render("newPass")
  },


  resetPass: async (req, res , next) => {
    let findHash = await hashs.findOne({ hash: req.body.hash });
    try{
      console.log(findHash)

      console.log(Date.now() - findHash.time_created)
      if (Date.now() - findHash.time_created <= 172800000) {
        let hash = await AuthService.hashPassword(req.body.password);
        console.log("hiiiiiiii")
        let p = token.verifyToken(req.body.token);
        p.then(async (message) => {
          AuthService.find_Update(message.email, { password: hash });
          // res.render("passwordReset");
          // next()
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
      console.log("can't find user")
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

  changeRoles : (req,res,next)=>{
      AuthService.updateRole(req.body.user_email , req.body.newRole)
      .then(async(message)=>{
        const newRole = await accounts.findOne({email : req.body.user_email})
      return res.status(200).send({
        status : "Ok" ,
        message : "Change the role of given user" ,
        data : {newRole}
      })
      }).catch((message)=>{
      return res.status(404).send({
        status : "error" ,
        message : message ,
        data : {}
      })
      })
  },

  recognizeRole:(req,res,next)=>{
    if(req.body.authorization ||req.headers['authorization']){
      token.verifyToken(req.body.authorization || req.headers['authorization'])
      .then((message)=>{
        return res.status(200).send({
          status : "ok",
          message : "verify token successful",
          data :message
        })
      }).catch((message)=>{
        return res.status(498).send({
          status:"error",
          message:"invalid token",
          data : message
        })
      })

    }else{
      return res.status(404).send({
        status:"error",
        message:"token not found",
        data : message
      })
    }
  },

  getEmails : async(req,res)=>{
    const email = await accounts.find();
    if(email!=null){
      let emailSender = token.verifyToken(req.headers['authorization']);
      emailSender.then((message)=>{
        var infoList =[]
        for(let each_email of email){
          let emailUser = each_email.email
          let roleUser =each_email.role
          infoList.push({email : emailUser , role :roleUser});
          // console.log(infoList)
        }
        let removeItem = infoList.indexOf(emailSender)
        infoList.splice(removeItem , 1)
        console.log(infoList)
        return res.status(200).send({
          status : "Ok",
          message : "all users",
          data : infoList
        })
      }).catch((message)=>{
        return res.status(401).send({
          status : "error",
          message : message,
          data : {}
        })
      })
      }else{
        return res.status(404).send({
          status:"error",
          message:"no emails",
          data : {}
        })
      }
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
