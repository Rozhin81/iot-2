const express = require("express");
const router = express.Router();
const plantController = require("./plantController");
const multer = require("multer");
const upload = multer({ dest: "../../public/uploads/" });  //where to store the files
const { MiddleWare } = require("../../lib/middleware");


router.get("/lists",
    [MiddleWare.checkToken],
    plantController.listOfPlants);


router.get("/lists/:plantId",
    [MiddleWare.checkToken],
    plantController.findPlantById);


router.post("/new", upload.single("image"),
    [MiddleWare.checkToken],
    plantController.createNewPlant);

router.delete(
    "/remove/:id",
    [MiddleWare.checkToken],

    plantController.delete
);

router.put(
    "/update/:id",
    upload.single("image"),
    [MiddleWare.checkToken],
    plantController.update
);
module.exports = router;
