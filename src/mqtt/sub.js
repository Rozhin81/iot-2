const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://broker.emqx.io:1883");
const topicName = "m003/publish";
const { slaves } = require("../model/slave");
const { PlantSensorData } = require("../model/sensorData");
const mongoose = require("mongoose");
const {masterSavedSlaves} = require("../model/masterSlaves");
const {SlaveService} = require("../services/slaveService");
const {RedisService}=require("../services/redisService");
const redisObj=new RedisService()

// try{
//     mongoose.connect("mongodb://admin:c8olxij6adhpyuq@remote-asiatech.runflare.com:31132/greenhouse");
// }catch{
//     console.log("can't connect to mongoDB");
// };


client.on("connect", () => {
    console.log("connected");
    client.subscribe([topicName], (err, granted) => {
        if (err) {
            console.log("Can't connect");
        }
        console.log(`Subscribe to topic ${topicName}`);
    })
});

client.on("message", async (topic, message, packet) => {
    if (topic === topicName) {
        let data = packet.payload.toString().replace("{", "").replace("}", "").trim().split("\n");
        for (let i = 0 ; i < data.length; i++){
            if(data[i][0]==='"'){
                console.log(data[i])
                try{
                    await masterSavedSlaves.create({
                        time : Date.now(),
                        value : data[i]
                    });
                }catch{
                    console.log("Can't save slaves")
                };

            }else{
                let each_data = data[i].replace("s:", "").split(",");
                let slaveId=('s' + each_data[0]).toString();
                let findSlaveId = await slaves.findOne({ slaveId: slaveId});
                if (findSlaveId != null) {
                    let keys=["temp","soil","ambient","light"];
                    for(let x=1;x<=keys.length;x++){
                        console.log(`${slaveId}_${keys[x-1]}`)
                        redisObj.setData(`${slaveId}_${keys[x-1]}`,each_data[x])
                    };

                    await SlaveService.addSensorData(each_data , findSlaveId._id)
                    .then((message)=>{
                        console.log(message)                    
                    }).catch((e)=>{
                        console.log(e)
                    })
                };
            } 
      };
        console.log("finish")
   }
});










