const { plants } = require("../model/plant");
const { PlantSensorData, SensorValue } = require("../model/sensorData");

class PlantService {

  static async listOfPlants(search,user_id) {
    let allPlants = await plants.find({user_id:user_id});
    const foundPlants = [];
    allPlants.forEach((plant) => {
      console.log(plant)
      if (plant.name.match(search)) {
        foundPlants.push({
          name: plant.name,
          image: plant.image,
          objId: plant._id
        });
      }
    });
    return foundPlants;
  }

  
 static async addNewPlant(req,user_id) {
      await plants.create({
        user_id:user_id,
        name: req.body.name,
        image: req.file.path,    
        temperature: req.body.temperature,
        light: req.body.light,
        moisture: req.body.moisture,
        explanation: req.body.explanation,
      });
   }

  static deletePlant(plantId,userId) {
    let p = new Promise((resolve, reject) => {
      plants.findOneAndDelete({_id:plantId,user_id:userId}, function (err, result) {
        if (result) {
          resolve(result);
        } else {
          reject("Failed");
        }
      });

    });
    return p;
  }


  static updatePlant(req, plantId,userId) {
    let plant = new Promise(async(resolve, reject) => {
      let plantInfo=await plants.findOne({_id:plantId,user_id:userId})
      plants.findOneAndUpdate(
        {_id:plantId,user_id:userId},
        {
          name: req.body.name.trim().length<=0 ? plantInfo.name :req.body.name,
          image: req.file==undefined?plantInfo.image : req.file.path,
          temperature: req.body.temperature.trim().length<=0 ? plantInfo.temperature :req.body.temperature,
          light: req.body.light.trim().length<=0 ? plantInfo.light :req.body.light,
          moisture: req.body.moisture.trim().length<=0 ? plantInfo.moisture :req.body.moisture,
          explanation: req.body.explanation.trim().length<=0 ? plantInfo.explanation :req.body.explanation,
        },
        null,
        function (err, result) {
          if (result) {
            resolve(result);
          } else {
            reject("Failed");
          }
        }
      );
    });
    return plant
  }


  
}




module.exports = { PlantService };