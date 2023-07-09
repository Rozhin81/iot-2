const { PlantService } = require("../../services/plantService");
const { plants } = require("../../model/plant");
const {Token}=require("../../lib/token");
const { accounts } = require("../../model/account");
let token=new Token();

module.exports = {

  delete : async function(req,res){
    let userId=req.decoded.id
      PlantService.deletePlant(req.params.id,userId)
      .then((message) => {
          res.status(200).send({
          status: "ok",
          message: "plant deleted",
          data: {},
          });
      }).catch((message) => {
          res.status(401).send({
          status: "error",
          message: "there isn't any plant by this id",
          data: {},
          });
      });
  },

  update : async function(req,res){
      let p =PlantService.updatePlant(req, req.params.id,req.decoded.id);
      p.then((message) => {
        res.status(200).send({
          status: "Ok",
          message: `plant updated \n${message}`,
          data: {},
        });
      }).catch((message) => {
        res.status(404).send({
          status: "error",
          message: "there isn't any plant with this id",
          data: {},
        });
      });
  },

  listOfPlants: async (req, res, next) => {
    const search = req.query.search;
    console.log(req.decoded)
    const similarPlants = await PlantService.listOfPlants(search,req.decoded.id);
    if (similarPlants.length == 0) {
      res.status(404).send({
        status: "error",
        message: "not found",
        data: {},
      });
    } else {
      res.status(200).send({
        status: "ok",
        message: "find similar plants",
        data: { similarPlants },
      });
    }
  },


  findPlantById: (req, res, next) => {
    let plantId = req.params.plantId;
    plants.findOne({_id:plantId,user_id:req.decoded.id},(err, result) => {
      if (result) {
        res.status(200).send({
          status: "ok",
          message: "plant found",
          data: result,
        });
      } else {
        res.status(404).send({
          status: "error",
          message: "plant not found",
          data: {},
        });
      }
    });
  },


 createNewPlant : async function(req,res){
  console.log(req.decoded)
    if(req.file==undefined){
      return res.status(406).send({
        status: "error",
        message: "image is empty",
        data: {},
      });
    }
    if ((await plants.findOne({ name: req.body.name,user_id:req.decoded.id })) == null) {
      try {
        PlantService.addNewPlant(req,req.decoded.id);
        return res.status(200).send({
          status: "ok",
          message: "your new plant created",
          data: {},
        });
      } catch {
        res.status(408).send({
          status: "error",
          message: "saving new plant failed",
          data: {},
        });
      }
      return user._id
      
    }else {
        res.status(406).send({
          status: "error",
          message: "this plant exists",
          data: {},
        })
      }
  }
  
};
