import express from "express";
import http from "http";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import initChatSocket from "./socket/chatSocket.js";
import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/user.js"
import chatRoutes from "./routes/chat.js"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const server = http.createServer(app);
// Serve static files from the 'uploads' folder
// Simulate __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Correct usage of CORS middleware
app.use(
  cors({
    origin: 'http://localhost:5173', // Allow requests from this origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow these HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
  })
);

// DB connection
connectDB(process.env.MONGO_URI)
  .then(() => {
    console.log("DB connected");
    initChatSocket(server);
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("DB Connection error", err);
  });

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom routes
app.use("/auth", authRoutes)
app.use("/users", userRoutes)
app.use("/chat", chatRoutes)
app.get("/", (req, res) => {
  res.send("Welcome to chat application!");
});
