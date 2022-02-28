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
    origin: "http://localhost:3000",
  },
});

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

const userRoutes = require("./routes/userRoutes");
const chatBoxRoutes = require("./routes/chatBoxRoutes");
const messageRoutes = require("./routes/messageRoutes");
const profileRoutes = require("./routes/profileRoutes");

const authCheckMiddleware = require("./middlewares/authCheck");

app.use("/api/users", userRoutes);
app.use("/api/chats", authCheckMiddleware, chatBoxRoutes);
app.use("/api/messages", authCheckMiddleware, messageRoutes);
app.use("/api/profile", authCheckMiddleware, profileRoutes);

let usersArray = [];

io.on("connection", (socket) => {
  //updateOnlineUsers for every new connection
  io.emit("updatedOnlineUsers", usersArray);

  // here all socket io events

  socket.on("disconnect", () => {
    usersArray = usersArray.filter((userObj) =>
      userObj.socketId === socket.id ? null : userObj
    );
    //updateOnlineUsers for every new disconnection
    io.emit("updatedOnlineUsers", usersArray);
  });

  socket.on("saveUser", (saveUserObj) => {
    const { id, name, email } = saveUserObj;
    //need to check wheter userExists,then change socket id
    //filtered array doesnot have userObj if matches current userID
    usersArray = usersArray.filter((userObj) =>
      userObj.userId === saveUserObj.id ? null : userObj
    );
    //now save currentUser with new socketId
    usersArray = [
      ...usersArray,
      { userId: id, userEmail: email, userName: name, socketId: socket.id },
    ];
    //updateOnlineUsers for every new savedUser
    io.emit("updatedOnlineUsers", usersArray);
  });

  socket.on("removeUser", (saveUserObj) => {
    //filtered array doesnot have userObj if matches current userID
    usersArray = usersArray.filter((userObj) =>
      userObj.userId === saveUserObj.id ? null : userObj
    );
    //updateOnlineUsers for every new connection removes (component unmounts/logout)
    io.emit("updatedOnlineUsers", usersArray);
  });

  socket.on("sendMsg", (sentMsgObj) => {
    const { msgObj, senderId, chatId, receiverObj } = sentMsgObj;
    const receiverSocket = usersArray.find(
      (userObj) => receiverObj._id === userObj.userId
    );

    if (!receiverSocket) {
      //no receiver found, so real time communication not needed
      return;
    }
    if (receiverSocket) {
      //now emit new event and send the msg to the receiver
      //sending privateMsg
      io.to(receiverSocket.socketId).emit("receivedMsg", {
        msgObj,
        senderId,
        chatId,
        receiverObj,
      });
    }
  });
});

dbConnect()
  .then(() => {
    httpServer.listen(process.env.PORT, () => {
      console.log("Server Started...");
    });
  })
  .catch(() => console.log("Server not started..."));
