const express = require("express");
const app = express();
const cors = require("cors");
const { createServer } = require("node:http");
const { Server } = require("socket.io");

const dbConnect = require("./db/dbConnect");
const UserRouter = require("./routes/UserRouter");
const PhotoRouter = require("./routes/PhotoRouter");
const CommentRouter = require("./routes/CommentRouter");
const AuthRouter = require("./routes/AuthRouter");
const BookmarkRouter = require("./routes/BookmarkRouter");
const LikeRouter = require("./routes/LikeRouter");
const MessageRouter = require("./routes/MessageRouter");
const OnlineRouter = require("./routes/OnlineRouter");
const Message = require("./db/messageModel");
const Online = require("./db/onlineModel");

dbConnect();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/admin", AuthRouter);
app.use("/api/user", UserRouter);
app.use("/api/photosOfUser", PhotoRouter);
app.use("/api/likeOfPhoto", LikeRouter);
app.use("/api/bookmarkOfPhoto", BookmarkRouter);
app.use("/api/commentsOfUser", CommentRouter);
app.use("/api/messageOfUser", MessageRouter);
app.use("/api/onlineUser", OnlineRouter);
app.get("/", (request, response) => {
  response.send({ message: "Hello from photo-sharing app API!" });
});

app.listen(8081, () => {
  console.log("server listening on port 8081");
});

const server = createServer(app);
const userStatus = [];

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);
  socket.on("user-online", async (userId) => {
    try {
      const onlineUser = new Online({
        user_id: userId,
      });
      const online = await Online.findOne({ user_id: userId });
      if (!online) await onlineUser.save();
    } catch (error) {
      console.log("🚀 ~ socket.on ~ error:", error);
    }
    userStatus[userId] = true;
    io.emit("user-status", { userId, status: "online" });
  });
  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", async (data) => {
    try {
      const newMessage = new Message({
        room_id: data.room_id,
        sender_id: data.sender_id,
        message: data.message,
        create_at: data.create_at,
      });
      await newMessage.save();
    } catch (error) {
      console.log("Error sending message", error);
    }
    socket.emit("is_send");
    socket.to(data.room_id).emit("receive_message", data);

    console.log("🚀 ~ socket.on ~ data:", data);
  });
  socket.on("user-offline", async (userId) => {
    try {
      const offlineUser = await Online.findOneAndDelete({ user_id: userId });
      console.log("🚀 ~ socket.on ~ offlineUser:", offlineUser);
    } catch (error) {
      console.log("🚀 ~ socket.on ~ error:", error);
    }
    userStatus[userId] = false;
    io.emit("user-status", { userId, status: "offline" });
  });
  socket.on("disconnect", () => {
    for (let userId in userStatus) {
      if (userStatus[userId] === socket.id) {
        userStatus[userId] = false;
        io.emit("user-status", { userId, status: "offline" });
        break;
      }
    }
    console.log("User Disconnected", socket.id);
  });
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});

const server2 = createServer(app);
const io2 = new Server(server2, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
io2.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("sendComment", () => {
    console.log("user comment");
    socket.emit("commented");
  });
  socket.on("likePost", () => {
    console.log("user likePost");
    socket.emit("liked");
  });
  socket.on("bookmarkPost", () => {
    console.log("user likePost");
    socket.emit("bookmark");
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});
server2.listen(8080, () => {
  console.log("server2 running at http://localhost:8080");
});
