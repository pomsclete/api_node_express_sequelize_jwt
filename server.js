const express = require("express");
const cors = require("cors");

const app = express();

var corOptions = {
    original: "https://localhost:8081",
}


// Add middleware to the server

app.use(cors(corOptions))

app.use(express.json())

app.use(express.urlencoded({ extended: true }))


/******** API ROUTES *********/
const routerUser = require("./routes/userRouter.js")
const routerPost = require("./routes/postRouter.js")
    // User routes
app.use("/api/user", routerUser)
    // Post routes
app.use("/api/post", routerPost)


//Testing API

app.get('/', (req, res, next) => {
    res.json({ "message": "Hello" })
})

//Portc

const PORT = process.env.PORT || 3000

// Server

app.listen(PORT, () => {
    console.log("Server listening on port " + PORT)
})