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

// routers

const router = require("./routes/userRouter.js")
app.use("/api/user", router)

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