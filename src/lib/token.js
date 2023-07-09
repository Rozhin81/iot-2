let jwt = require("jsonwebtoken");
let { accounts } = require("../model/account");
class Token {
  generateToken(jsonData , expirTime) {
    return new Promise((resolve, reject) => {
      let token = jwt.sign(jsonData, process.env.SECRET_KEY, {
        expiresIn : expirTime
      })
      if (token) {
        resolve(token)
      } else {
        reject("failed")
        
      }

    });
  };


  verifyToken(token) {
    console.log(token)
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.SECRET_KEY, async(err, decodedToken) => {
        if (err) {
          let userEmail = jwt.decode(token)
          reject(userEmail)
        }
         else {
          resolve(decodedToken);
        }
      });
    })
  }


  async userBasedOnToken(token) {
    return new Promise(async (resolve, reject) => {
      await this.verifyToken(token).then(async (decoded) => {
        resolve(await accounts.findOne({ email: decoded.email }));
      }).catch((err) => {
        reject(err)
      })
    })
  }


  async  verifyGoogleToken(token) {
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      return { payload: ticket.getPayload() };
    } catch (error) {
      return { error: "Invalid user detected. Please try again" };
    }
  }  

}

module.exports = { Token };
