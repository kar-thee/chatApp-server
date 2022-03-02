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
    origin: "https://chatapp-karthee.netlify.app",
  },
});

app.use(express.json());
app.use(
  cors({
    origin: "https://chatapp-karthee.netlify.app",
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

//the below array stores all userObjs with socket id
let usersArray = [];
//socket.io events below :
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
    const { msgObj, senderId, chatId, receiverObjArray } = sentMsgObj;
    //the below array will help in storing all userObj that are online/have socket id
    let receiverSocketArray = [];
    receiverObjArray.forEach((receiverObj) => {
      //if obj is online we return the obj
      let receiverSocket = usersArray.find(
        (userObj) => receiverObj._id === userObj.userId
      );
      //the receiverSocketArray is updated if receiverSocket present
      receiverSocketArray = receiverSocket
        ? [...receiverSocketArray, receiverSocket]
        : receiverSocketArray;
    });
    //if array empty that means receiver not online /has socket id attached
    if (!receiverSocketArray || receiverSocketArray.length < 1) {
      //no receiver found, so real time communication not needed
      return;
    }
    //if array is not empty
    if (receiverSocketArray.length > 0) {
      //now emit new event and send the msg to the receiver
      //sending msg
      //using forEach we send to all users in receiverSocketArray
      //either group or private chat
      receiverSocketArray.forEach((receiverSocket) => {
        io.to(receiverSocket.socketId).emit("receivedMsg", {
          msgObj,
          senderId,
          chatId,
          receiverSocket,
        });
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
