//  jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
}); 

app.post("/", (req, res) => {
    var firstName = req.body.fName;
    var lastName = req.body.lName;
    var email = req.body.email;
    
    var data = {
        members: [
            { 
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };
    
    const jsonData = JSON.stringify(data);
    const url = "https://us13.api.mailchimp.com/3.0/lists/d0322eb39c";
    const options = {
        method: "POST",
        auth: "ajaya:a6b075b1b851b3388c2f4203e6e299c09-us13"
    }

    const request = https.request(url, options, (response) => {

        if( response.statusCode === 200 ){
            res.sendFile(__dirname + "/sucess.html");
        }
        else{
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", (data)=>{
            console.log( JSON.parse(data) );
        });
    });

    request.write(jsonData);
    request.end();
});

app.post("/failure", (req, res)=>{
    res.redirect("/");
});

app.listen(3000, () => {    
    console.log("Server is running on port 3000");
});


// "ajaya:6b075b1b851b3388c2f4203e6e299c09-us13"