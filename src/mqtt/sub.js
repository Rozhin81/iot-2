const mqtt = require("mqtt");
// const topicName = `m#/publish`;
const { slaves } = require("../model/slave");
// const { PlantSensorData } = require("../model/sensorData");
// const mongoose = require("mongoose");
const {masterSavedSlaves} = require("../model/masterSlaves");
const {SlaveService} = require("../services/slaveService");
const {RedisService}=require("../services/redisService");
const {Automation}=require("../services/automationService")
const redisObj=new RedisService()

// try{
//     mongoose.connect("mongodb://127.0.0.1:27017/greenhouse");
// }catch{
//     console.log("can't connect to mongoDB");
// };


function subDataToJsfile(entrydata){
    return new Promise(async(resolve,reject)=>{
        let data=[];
        let editeddata = entrydata.replace(/"/g,'').replace("{", "").replace("}", "").trim().split("\n");
        for(let x of editeddata){
            x=x.replace(/,\s*$/, "").replace(/"/g,'');
            data.push(x)
        }
        // console.log(data)
        for (let i = 0 ; i < data.length; i++){
            if(data[i][0]==='"'){
                try{
                    await masterSavedSlaves.create({
                        time : Date.now(),
                        value : data[i]
                    });
                }catch{
                    console.log("Can't save slaves")
                };

            }else{
                for(let each_data of data){ 
                    let eachData = each_data.replace("s:", "s").split(","); 
                    let slaveId=eachData[0].toString();
                    slaves.findOne({slaveId: slaveId},async function(err,findSlave){
                        if(err){
                            console.log("can't find");
                            reject("err")
                        }
                        else{
                            const edit_slaveId=eachData[0];
                            Automation.saveToFile(`/home/rozhan/rahavard/backend/src/mqtt/jsFiles/${edit_slaveId}.js`,eachData);
                            // await redisObj.setData(eachData,slaveId);
                            resolve("ok")

                        }
                    }); 
                    
                }
                };
            
        };
        console.log("finish");
    }
)};

module.exports={subDataToJsfile}