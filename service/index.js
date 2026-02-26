const express = require("express");
const app = express();
const debug = require("debug")("my-application")
const router = require("./router")
const bodyParser = require("body-parser");
const cors =require("cors")

app.use(cors());
//post参数传递---中间件--- 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended:true
}))
app.use("/api",router)
// cors跨域处理
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:5174");
    res.header("Access-Control-Allow-Headers", "Content-Type,Access-Token");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
})

app.listen(3001,function(){
    console.log("服务器运行在3001端口上");
    debug("服务器运行在3001端口上");
})