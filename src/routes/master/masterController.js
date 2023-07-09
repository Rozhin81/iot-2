const { MasterService } = require("../../services/masterService");
const { master } = require("../../model/master")
const mongoose = require("mongoose");
const { Token } = require("../../lib/token");
const { accounts } = require("../../model/account")
let token = new Token();

module.exports = {
    addMaster: async (req, res) => {
        let masterId = req.body.master_id;
        let userId=req.decoded.id;
        let name= req.body.name;
        if (await master.findOne({ master_id: masterId ,user_id:userId}) == null) {
                await MasterService.createMaster(masterId,userId, name).then((message) => {
                    return res.status(201).send({
                        status: "ok",
                        message: "your new master added",
                        data: {}
                    })
                }).catch((e) => {
                    return res.status(409).send({
                        status: "error",
                        message: "having problem to saving new master,try again later",
                        data: {}
                    })
                });
        }
        else {
            return res.status(409).send({
                status: "error",
                message: "there is a master with this name",
                data: {}
            })
        }

    }
    ,
    deleteMaster: async (req, res) => {
        let masterId = req.params.id;
        let userId=req.decoded.id;
        await MasterService.deleteMaster(masterId, userId).then((message) => {
            return res.status(200).send({
                status: "ok",
                message: "master is deleted",
                data: {}
            })
        }).catch((message) => {
            console.log(masterId,userId)
            return res.status(404).send({
                status: "error",
                message: "master with this user not found",
                data: {}
            })
        })
        

    },


    updateMaster: async (req, res) => {
        let masterId = req.params.id;
        let newMasterId=req.body.master_id.trim().length>0 ? req.body.master_id :masterId;
        let name = req.body.name;
        let userId=req.decoded.id;
            MasterService.updateMaster(masterId, userId, name,newMasterId).then((message) => {
                return res.status(200).send({
                    status: "ok",
                    message: "your master is updated",
                    data: {}
                })
            }).catch((e) => {
                return res.status(404).send({
                    status: "error",
                    message: "master with this user not found",
                    data: {}
                })
            })
    },


    readMaster: async (req, res) => {
        let masterId = req.params.id;
        let userId=req.decoded.id;
            MasterService.readMaster(masterId, userId).then((master) => {
                return res.status(200).send({
                    status: "ok",
                    message: "find master",
                    data: { master }
                })
            }).catch((e) => {
                return res.status(404).send({
                    status: "error",
                    message: "master not found",
                    data: {}
                })
            })
        

    }
}