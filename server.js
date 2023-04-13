const express = require("express");
const app = express();
const port = 5000;
app.use(express.json());
const path = require('path')
app.use('/static', express.static(path.join(__dirname, 'homepage')))

app.get("/",function(req,res){
    res.sendFile(__dirname+"/homepage/index.html");
});

app.listen(port, function() {
    console.log(`App listening at http://localhost:${port}`);
});

