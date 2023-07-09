// const redis=require("redis");

// class RedisService{
//     constructor(){
//         this.client = redis.createClient({
//             host: '127.0.0.1',
//             port: '6379'
//         });
//         this.client.on("err",(err)=>{
//         console.log(err)
//         })
//         const x=async()=>{
//             await this.client.connect()
//         }
//         x()

//     };

//     async setData(key,value){
//         try{
//             await this.client.set(key,value);
//         }
//         catch(e){
//             throw e 
//         }
        

//     };

//     getData(key){
//         return new Promise(async(resolve,reject)=>{
//                 const x=await this.client.get(key);
//                 if(x!=null || x!=undefined){
//                     resolve(x)
//                 }
//                 else{
//                     reject("not found")
//                 }

           
//     });
// }
// }


// module.exports={RedisService}
