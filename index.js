const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const http = require("http");
const { Server } = require("socket.io");
const dbConnect = require("./db/dbConnect");

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    // origin: "http://localhost:3000",
    origin: "*",
  },
});

app.use(express.json());
app.use(cors());

const userRoutes = require("./routes/userRoutes");
const chatBoxRoutes = require("./routes/chatBoxRoutes");
const messageRoutes = require("./routes/messageRoutes");
const authCheckMiddleware = require("./middlewares/authCheck");

app.use("/api/users", userRoutes);
app.use("/api/chats", authCheckMiddleware, chatBoxRoutes);
app.use("/api/messages", authCheckMiddleware, messageRoutes);

io.on("connection", (socket) => {
  // here all socket io events
});

dbConnect()
  .then(() => {
    httpServer.listen(process.env.PORT, () => {
      console.log("Server Started...");
    });
  })
  .catch(() => console.log("Server not started..."));
