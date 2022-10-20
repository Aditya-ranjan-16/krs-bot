const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config()
const store = require('data-store')({ path: process.cwd() + '/foo.json' });
const port = process.env.PORT || 5000;
const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
  
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH, DELETE,OPTIONS"
    );
  
    next();
  });

  app.get("/status", (req, res) => {
    if(store.get("lightstatus")=="true"){
        res.json({status:"on"})
    }else{
        res.json({status:"off"})
    }
    
  })
 function KeepAlive(){
    app.listen(port, () => {
        console.log("Listining on port " + port);
        console.log("connected");
      })
 }

 module.exports=KeepAlive
 

