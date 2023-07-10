const express = require("express");
const app = express();
const port = 5000;
app.use(express.json());
const path = require('path');

app.use('/projects/raytraceHelpers', express.static(path.join(__dirname, 'homepage/RayTracer/raytraceHelpers')));
app.use('/projects/tetrisHelpers', express.static(path.join(__dirname, 'homepage/TetrisAI/tetrisHelpers')));
app.use('/projects/ecruHelpers', express.static(path.join(__dirname, 'homepage/Ecru/ecruHelpers')));
app.use('/ecruHelpers', express.static(path.join(__dirname, 'homepage/Ecru/ecruHelpers')));
app.use('/projects/homepage', express.static(path.join(__dirname, 'homepage/main')));
app.use('/node', express.static(path.join(__dirname, 'node_modules')));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/homepage/main/index.html");
});

app.get("/three",function(req,res){
    res.redirect("/node/three");
});

app.get("/projects/raytracer",function(req,res){
    res.sendFile(__dirname+"/homepage/RayTracer/index.html");
});

app.get("/projects/tetris",function(req,res){
    res.sendFile(__dirname+"/homepage/TetrisAI/index.html");
});

app.get("/projects/ecru",function(req,res){
    res.sendFile(__dirname+"/homepage/Ecru/index.html");
});

app.get('*', function(req, res){
    res.status(404).send("404 Error! You aren't supposed to be here :)");
});

app.listen(port, function() {
    console.log(`App listening at http://localhost:${port}`);
});

