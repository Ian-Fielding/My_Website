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
    res.sendFile(__dirname+"/homepage/RayTracer/raytraceIndex.html");
});

["Builder.js","Index.html","Color.js","MathUtils.js","Client.js","Style.css"].forEach(function(com){
    app.get(`/projects/raytrace${com}`,function(req,res){
        res.sendFile(__dirname+`/homepage/RayTracer/raytrace${com}`);
    });
})

app.get('*', function(req, res){
  res.status(404).send("What??");
});

app.listen(port, function() {
    console.log(`App listening at http://localhost:${port}`);
});

