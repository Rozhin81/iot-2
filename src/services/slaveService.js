const {slaves} = require("../model/slave");
const {plants} = require("../model/plant");
const {Token} = require("../lib/token")
const {PlantSensorData} = require("../model/sensorData")


class SlaveService {
    static async addNewSlave(req,userId){
        let body = req.body;
            return new Promise(async(resolve , reject)=>{
                let newSlave = await new slaves({
                    slaveId : body.slaveId ,
                    slaveName : body.slaveName ,
                    masterId : body.masterId ,
                    plantId : body.plantId ,
                    userId :userId
                });
                if(newSlave.save()){
                    resolve(true)
                }else{
                    reject(false)
                }
            })

    };

    static updateSlave(req){
        let body = req.body;
        let filter = {slaveId : body.slaveId};
        return new Promise((resolve , reject)=>{
            let findSlaveForUpdate = slaves.findOne(filter , (error , docs)=>{
                if(error){
                    reject("Can't find slave")
                }else return docs
            })
            slaves.findOneAndUpdate(filter , {
                slaveId : slaves.slaveId , 
                slaveName : body.slaveName=="" ? findSlaveForUpdate.slaveName : body.slaveName,
                masterId : body.masterId=="" ? findSlaveForUpdate.masterId : body.masterId, 
                plantId : body.plantId=="" ? findSlaveForUpdate.plantId : body.plantId, 

            },function(error , docs){
                if(docs){
                    resolve("Update information");
                }else{
                    reject("Can't update information.No such slave")
                }
            }
            )

        })
    }
    

    static deleteSlave(req){
        return new Promise((resolve , reject)=>{
            slaves.findOneAndDelete({
                slaveId : req.body.slaveId
            }, function(err , docs){
                if(docs){
                    resolve("Delete User")
                }else{
                    reject("can't find the slave")
                }
            }
            )
        });
    }

    static async getData(slaveId , startTime , endTime){
        // return new Promise((resolve , reject)=>{
            console.log(slaveId)
            await PlantSensorData.aggregate(
            [
                {
                  '$match': {
                    'slaves': '003'
                  }
                }, {
                  '$project': {
                    'data': {
                      '$filter': {
                        'input': '$value', 
                        'as': 'entity', 
                        'cond': {
                          '$gte': [
                            '$$entity.time', new Date(startTime)
                          ],
                          '$lte' : [
                            '$$entity.time', new Date(endTime)
                          ]
                        }
                      }
                    }
                  }
                }
              ]
            ).exec(function(e , d){
                console.log(d)
            }) 
            // , function(error , docs){
            //     console.log(docs)
            //     if(docs){
            //         resolve(docs)
            //     }else{
            //         reject("can't find slave")
            //     }
            // }}
            // )
    };

    
    static addSensorData(each_data , slaveId){
        let data = new Promise((resolve, reject) => {
          PlantSensorData.findOneAndUpdate(
              { slaves: slaveId },
              {
                  $push: {
                      value: {
                          time: new Date(),
                          TempSensor: each_data[1],
                          Soil_moisture: each_data[2],
                          Ambient_humidity: each_data[3],
                          Light: each_data[4],
                          fanButton: each_data[5],
                          Water_pomp: each_data[6],
                          Heater: each_data[7],
                          Fan: each_data[8]
  
                      }
                  }
              }
              ,{upsert:true},
              function (error, result) {
                if (error) {
                  console.log(error);
                  reject(error)
                } else {
                    console.log("in promise")
                  resolve(result) 
                }
            }
          )
      });
      return data
    };
};

module.exports = {SlaveService};