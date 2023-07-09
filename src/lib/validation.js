const {accounts}=require("../model/account")
class Validation{
    static async existToDB(email) {
        let user=await accounts.findOne({ email:email })
        if(user){
            return user
        }
        else{
            return false
            
        }
         }
      }


module.exports={Validation}