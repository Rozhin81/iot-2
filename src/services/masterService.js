const {master}=require("../model/master")
class MasterService{

    static async createMaster(master_id,user_id,name){
        return new Promise(async (resolve,reject)=>{
            let newMaster=new master({
                master_id:master_id,
                user_id:user_id,
                name:name
            })
            if(newMaster.save()){
                resolve(true)
            }
            else{
                reject(false)
            }   
        })
    };

    static  deleteMaster(masterId,userId){
        return new Promise((resolve,reject)=>{
            master.findOneAndDelete({master_id:masterId,user_id:userId},(err,response)=>{
                if(response){
                    resolve(response);
                    }
                else{
                    reject(err);
                }
            })
        })
       
    };

    
    static  updateMaster(materId,userId,name,newMasterId){
        return new Promise((resolve,reject)=>{
            master.findOneAndUpdate({master_id:materId,user_id:userId},{name:name,master_id:newMasterId},(err,res)=>{
                if(res){
                    resolve(res)
                }
                else{
                    reject(err)
                }
            })
        })
      
    };

    static  readMaster(masterId,userId){
        return new Promise((resolve,reject)=>{
            master.findOne({master_id:masterId,user_id:userId},(err,res)=>{
                if(res){
                    resolve(res)
                }
                else{
                    reject(err)
                }
            })
        })
        
    };
}

module.exports={MasterService}