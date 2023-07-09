// // const { logicParse } = require("../../logic/parseLogic");
// const { pub } = require("../../mqtt/pub");
// const {Automation}=require("../../services/automationService");
// const execute=require("../../mqtt/execute")
// module.exports = {
//     getLogic: (req, res, next) => {
//         logicJson =req.body;
//         try {           
//             for(let arr of logicJson){
//                 const slaveId=Object.keys(arr).toString().toLowerCase();
//                 Automation.saveToFile(`/home/rozhan/rahavard/backend/src/mqtt/jsonFiles/${slaveId}.json`,logicJson);
//             }

//             pub(logicJson)
//             res.status(200).send({
//                 status: "ok",
//                 message: "ok your automation is executed",
//                 data: {}
//             })
//         }
//         catch(e) {
//             console.log(e)
//             res.status(401).send({
//                 status: "error",
//                 message: "having problem to execute your automation",
//                 data: {}
//             })
//         }

//     }
// };