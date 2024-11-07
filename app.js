const express = require("express")
const app = express();

//port for application
let port = 3000;

//basic test api
app.get("/", ( req, res )=> {
    
    console.log("inside test controller");

    return res.status(200).json({
        status : 200,
        msg : "API is working"
    });
})


app.listen(3000, (err)=>{
    if( err )
    {
        console.log("Error running on server ", err );
    }
    else{
        console.log("Server is running on port ", port );
    }
})