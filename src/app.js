const express=require("express");
const app=express();
const mongoose=require("mongoose");
const bodyParser = require("body-parser");
const authRouter=require("./routes/user/authRouter");
const plantRouter=require("./routes/plant/plantRouter");
const masterRouter=require("./routes/master/masterRouter");
const slaveRouter=require("./routes/slave/slaveRouter");
// const automatinoRouter=require("./routes/logic/logicRouter");
const path = require("path");
const cors=require("cors");
require('dotenv').config();
let ejs = require('ejs');

app.set('views' , path.join(__dirname,"views"))
app.set("view engine" , "ejs")
app.use('/public' , express.static('public'));


app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use("/accounts",authRouter);
app.use("/plants",plantRouter);
app.use("/master",masterRouter);
app.use("/slaves" ,slaveRouter);
// app.use("/logic",automatinoRouter);



const start=()=>{
  
    mongoose.connect(
      "mongodb://localhost:27017/greenhouse"
        // "mongodb://admin:c8olxij6adhpyuq@remote-asiatech.runflare.com:31132/greenhouse"
        // ,{
        //       maxPoolSize: 10,
        //       authSource: "admin",
        //       user: "admin",
        //       pass: "c8olxij6adhpyuq"
        // }
      );
    app.listen(process.env.HTTP_PORT)
}
start();

module.exports=app;
