"use strict";

var express = require("express");
var bodyParser = require('body-parser');

var Storage = require('./lib/MongoDB');

var app = express();

var db = new Storage(null, null, 'maxweb');


app.use(bodyParser.json());

app.use(express.static('public'));



var myData = [

]

app.get("/data", function(req, res){
	console.log("Request to /data");
	db.getAllProjects(function(err, data){
         if(err){
            res.status(500).send();
        }else{
        	console.log(data);
        	myData = data;
        	res.status(200).json(data);
        } 
     });
});


app.post("/data", function(req, res) {
	console.log("POST to /data");
	if (myData.length == 0) myData.push(req.body);
	for (var i = 0;i<myData.length; i++) {
		if (myData[i].iden == req.body.iden) {
			myData[i] = req.body; 
			break;
		}
	}
	if (i == myData.length) myData.push(req.body);

	db.addProject(req.body, function(err,data) {
	});

});

app.post("/kill", function(req, res) {
	console.log("POST to /kill");
	for (var i = 0;i<myData.length; i++) 
		if (myData[i].iden == req.body.iden) {
			for (var j = 0;j<myData[i].time.length; j++)
				if (myData[i].time[j][0] == req.body.name) {
					myData[i].time.splice(j,1);
					myData[i].tasks.splice(j,1);
					break;
				}
			break;
		}
	db.addProject(myData[i], function(err,data) {});
});

app.listen(30149, function() {
	console.log("Listening on port 30149");

	db.connect(function(){
        // some message here....
    });

});
