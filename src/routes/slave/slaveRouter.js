const express = require("express");
const router = express.Router();
const slaveController = require("./slaveController");
const { MiddleWare } = require("../../lib/middleware")
const Role = require("../../lib/roles_list")

router.post("/slave",
    [MiddleWare.checkToken, MiddleWare.emptyCheck , MiddleWare.verifyRoles(Role.ADMIN,Role.SUPERADMIN)],
    slaveController.add);

router.delete("/slave",
    [MiddleWare.checkToken , MiddleWare.verifyRoles(Role.SUPERADMIN)]
    , slaveController.delete)

router.put("/slave",
    [MiddleWare.checkToken ,MiddleWare.verifyRoles(Role.ADMIN ,Role.SUPERADMIN)]
    , slaveController.update);

router.post("/getdata",
    [MiddleWare.checkToken ,MiddleWare.verifyRoles(Role.ADMIN ,Role.SUPERADMIN)] ,
     slaveController.data);

module.exports = router;
