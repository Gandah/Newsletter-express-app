
const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();

app.use(express.static("public")) // static files are loaded from the public directory
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/signup.html");
})

app.post('/', (req, res) => {
    
    // This line extracts the values of "fname", "lname", and "email" from the request body.
    const{ fname, lname, email} = req.body;
    

    //This creates an object "data" with the email, status, and merge fields of the subscriber to be added to the Mailchimp list.
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: fname,
                    LNAME: lname
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data); //converts data to json string

   const url = "https://us13.api.mailchimp.com/3.0/lists/8b1a27cbda";

   
   const options = {
    method: "POST",
    auth: "ganderson:4b720fddac7c9eb6945c74011e067f45-us13",
   }
   
   //This line creates a new HTTPS request to the Mailchimp API endpoint with the specified URL and options. It also sets up a callback function to handle the response data.
   const request = https.request(url, options, (response) =>{  
        if(response.statusCode === 200){
            res.sendFile(__dirname + "/success.html")
        }else{
            res.sendFile(__dirname + "/failure.html")
        }

        response.on("data", (data) => {
            console.log(JSON.parse(data))
        })
    })

   //Failure page redirect to home route
app.post("/failure" , (req,res) => {
    res.redirect("/")
})
     
    //These lines write the JSON data to the request body and send the request to the Mailchimp API endpoint.
    // request.write(jsonData);
    request.end();
})

const PORT = process.env.PORT || 3000
app.listen(PORT , () => {
    console.log(`Server is running on port ${PORT}`);
}) 



// 4b720fddac7c9eb6945c74011e067f45-us13 apikey
// 8b1a27cbda  lsit-id