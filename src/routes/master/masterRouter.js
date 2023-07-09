const express=require("express");
const router=express.Router();
const masterController=require("./masterController");
const {MiddleWare}=require("../../lib/middleware");

router.post("/master",[MiddleWare.checkToken,MiddleWare.emptyCheck],masterController.addMaster);

router.delete("/master/:id",[MiddleWare.checkToken],masterController.deleteMaster);

router.get("/master/:id",[MiddleWare.checkToken],masterController.readMaster);

router.put("/master/:id",[MiddleWare.checkToken],masterController.updateMaster);


module.exports=router