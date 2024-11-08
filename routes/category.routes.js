
app.get("/", ( req, res )=> {
    
    console.log("inside test controller");

    return res.status(200).json({
        status : 200,
        msg : "API is working"
    });
})