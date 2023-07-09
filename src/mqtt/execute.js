let cron = require("node-cron");
let fs = require("fs");
let path = require("path");
let jsonFilesPath = "/home/rozhan/rahavard/backend/src/mqtt/jsonFiles";
const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://broker.emqx.io:1883");
const topicName = 'm001/publish';
const redis = require("redis");
let { pub } = require("./pub");
let filePath="./data.txt"
let { subDataToJsfile } = require("./sub");
let dataList=[];

redisClient = redis.createClient({
    host: '127.0.0.1',
    port: '6379'
});
redisClient.on("err", (err) => {
    console.log(err)
})
const x = async () => {
    await redisClient.connect()
}
x()


    client.on("connect", () => {
        console.log("hi")
        client.subscribe(topicName,function(err){
            if(!err){
                console.log(`Subscribe to topic ${topicName}`);
            }
        })
        client.on("message", async (topic, message, packet) => { 
            let data=packet.payload.toString()
            dataList.push(data)
            await redisClient.set("dataList",JSON.stringify(dataList))
      
        client.on("error", function (err) {
            console.log("Error:" + err);
            if (err.code == "ENOTFOUND") {
                console.log("Network error , make sure you have an active internet connection")
            }
        });
        })
    } 
    )


    cron.schedule('* * * * *', async() => {
            let lastData=JSON.parse(await redisClient.get("dataList")).pop()
            console.log(lastData)
            subDataToJsfile(lastData).then((message) => {
                console.log(message)
                fs.readdir(jsonFilesPath, (err, files) => {
                    if (err) {
                        console.log(err)
                    }
                    else {
                        files.forEach(file => {
                            fs.readFile(path.join(jsonFilesPath, file), async (err, fileData) => {
                                if (fileData) {
                                    const jsonData = JSON.parse(fileData.toString());
                                    console.log(jsonData);
                                    pub(jsonData);
                                }
                                else {
                                    console.log(err);
                                }
                            })
                        })
                    }
        
                })
            }).catch((e) => {
                console.log(e)
            })


        }
    );