const express = require("express")
const app = express();

//port for application
let port = 3000;


app.listen(3000, (err)=>{
    if( err )
    {
        console.log("Error running on server ", err );
    }
    else{
        console.log("Server is running on port ", port );
    }
})