const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

// to make static data to dynamic
app.use(express.static("public"));

// to send post method
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req, res){
    res.sendFile(__dirname+"/signup.html");
})

app.post("/",function(req,res){
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members : [
        { 
         email_address : email ,
         status :"subscribed" ,
         merge_fields :{
            FNAME : firstName,
            LNAME : lastName,
            }
        }
      ]
    };

    const jsonData = JSON.stringify(data);
    
    const url = "https://us21.api.mailchimp.com/3.0/lists/f349cc68ee";

    const options ={
        method : "POST",
        auth : "soniya1:4bdf5eedb429dc251516bb15954ec467-us21"
    }

    const request = https.request(url, options, function(response){
   
       if(response.statusCode === 200){
         res.sendFile(__dirname+"/success.html");
       }
       else{
          res.sendFile(__dirname+"/failure.html");
       }

       response.on("data", function(data){
        console.log(JSON.parse(data));
       }) 
    })

    request.write(jsonData);
    request.end();
});


// for failure to take back the form original page
app.post("/failure", function(req, res){ 
    res.redirect("/");
});

app.listen(process.env.PORT ||3000, function(){
    console.log("server started on port 3000.");
});


// api key
//  4bdf5eedb429dc251516bb15954ec467-us21

// list id
// f349cc68ee.