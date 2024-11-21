import express from "express"
import http from "http"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
dotenv.config();
const app = express()
const PORT = process.env.PORT || 8080
const server = http.createServer(app)

// DB connection 
connectDB(process.env.MONGO_URI).then(()=>{
    console.log("DB connected")
    server.listen(PORT, () => {
        console.log("Server is running on port 3000")
    })
}).catch((err)=>{
    console.log("DB Connection error", err)
})

//middlwares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// custom routes 
app.get("/", (req, res) => {
    res.send("Welcome to chat application!")
})

