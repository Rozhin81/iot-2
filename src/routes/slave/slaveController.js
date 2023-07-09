const {SlaveService} = require("../../services/slaveService");
const {slaves} = require("../../model/slave");
const {Token} = require("../../lib/token");
const token = new Token;
const {PlantSensorData} = require("../../model/sensorData");


module.exports = {
    add : async function(req,res){
            let findSlave = await slaves.findOne({slaveId : req.body.slaveId})
            if(findSlave==null){
                let userId = req.decoded.id
                SlaveService.addNewSlave(req ,userId)
                .then((message)=>{
                    return res.status(201).send({
                        status : "Ok" ,
                        message : "Add Slave",
                        data : {}
                    })
                })
                .catch((message)=>{
                    return res.status(406).send({
                        status : "error",
                        message : "There is a problem to add the slave" , 
                        data : {}
                    })
                })
            }else{
                return res.status(404).send({
                    status : "error" , 
                    message : "There is a slave with this id" ,
                    data : findSlave
                })
            }
    },


    delete : async function(req,res){
        await SlaveService.deleteSlave(req) 
        .then((message)=>{
            return res.status(200).send({
                status : "Ok" ,
                message : message,
                data : {}
            })
        })
        .catch((message)=>{
            return res.status(404).send({
                status :"error",
                message : message ,
                data : {}
            })
        });
    
    },


    update : function(req,res){
        SlaveService.updateSlave(req)
        .then((message)=>{
            return res.status(200).send({
                status : "Ok" ,
                message : message ,
                data : {}
            })
        })
        .catch((message)=>{
            return res.status(404).send({
                status : "error" ,
                message : message , 
                data:{}
            })
        });
    },
    

    data :async function(req,res){
          await PlantSensorData.aggregate(
            [
                {
                  '$match': {
                    'slaves': req.body.slaveId
                  }
                }, {
                  '$project': {
                    'data': {
                      '$filter': {
                        'input': '$value', 
                        'as': 'entity', 
                        'cond': { $and :[
                          {'$gte': ['$$entity.time', new Date(req.body.startTime)]} ,
                          {'$lte': ['$$entity.time', new Date(req.body.endTime)]}
                          ]
                        }
                      }
                    }
                  }
                }
              ]
            ).exec(function(e , d){
                console.log(e)
                if(e){
                    return res.status(404).send({
                        status : "error" ,
                        message : e ,
                        data : {}
                    })
                
                }else{
                    return res.status(200).send({
                        status : "Ok" ,
                        message : "get data",
                        data : d
                    })
                }
            }) 




        // let p = SlaveService.getData(req.body.slaveId);
        //     if(p!=undefined || p!=[] || p!=null){
                // return res.status(200).send({
                //     status : "Ok" ,
                //     message : "get data",
                //     data : p
                // })
        //     }
        //     else{
                // return res.status(404).send({
                //     status : "error" ,
                //     message : message ,
                //     data : {}
                // })
        //     }
    }
}