const express = require("express");
const app = express();
const port = 5000;
app.use(express.json());
const path = require('path')
app.use('/static', express.static(path.join(__dirname, 'homepage')));
//app.use('/ray', express.static(path.join(__dirname, 'homepage/RayTracer')));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/homepage/index.html");
});

app.get("/projects/raytracer",function(req,res){
    res.sendFile(__dirname+"/homepage/RayTracer/index.html");
});

[
    "builder.js",
    "client.js",
    "color.js",
    "mathScary.js",
    "mathUtils.js",
    "object.js",
    "parsedObjs.js",
    "style.css"
].forEach(function(com){
    app.get(`/projects/raytraceHelpers/${com}`,function(req,res){
        res.sendFile(__dirname+`/homepage/RayTracer/raytraceHelpers/${com}`);
    });
})


app.get('*', function(req, res){
    res.status(404).send("404 Error! You aren't supposed to be here :)");
});

app.listen(port, function() {
    console.log(`App listening at http://localhost:${port}`);
});

