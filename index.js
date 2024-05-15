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

dbConnect();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/admin", AuthRouter);
app.use("/api/user", UserRouter);
app.use("/api/photosOfUser", PhotoRouter);
app.use("/api/likeOfPhoto", LikeRouter);
app.use("/api/BookmarkOfPhoto", BookmarkRouter);
app.use("/api/commentsOfUser", CommentRouter);
app.get("/", (request, response) => {
  response.send({ message: "Hello from photo-sharing app API!" });
});

app.listen(8081, () => {
  console.log("server listening on port 8081");
});

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// io.on("connection", (socket) => {
//   console.log("Client connected");

//   socket.on("clientMessage", (message) => {
//     console.log("Received message from client:", message);
//     socket.emit("serverMessage", "Hello from server!");
//   });
// });
// io.on("connection", (socket) => {
//   socket.on("chat message", (msg) => {
//     console.log(msg);
//     io.emit("chat message", msg);
//   });

//   socket.on("getAllGroups", (user) => {
//     console.log(
//       "🚀 ~ file: index.js:41 ~ chatgroups?.filter ~ chatgroups:",
//       chatgroups,
//       user
//     );

//     const data = chatgroups?.filter((item) => {
//       return item?.user?.includes(user);
//     });
//     socket.emit("groupList", data);
//   });

//   socket.on("createNewGroup", (groupInfo) => {
//     // console.log(currentGroupName);
//     chatgroups.unshift({
//       id: chatgroups.length + 1,
//       currentGroupName: groupInfo?.currentGroupName,
//       messages: [],
//       user: groupInfo?.user,
//     });
//     socket.emit("groupList", chatgroups);
//   });

//   socket.on("findGroup", (id) => {
//     const filteredGroup = chatgroups.filter((item) => item.id === id);
//     socket.emit("foundGroup", filteredGroup[0]?.messages ?? "");
//   });

//   socket.on("newChatMessage", (data) => {
//     const { currentChatMesage, groupIdentifier, currentUser, timeData } = data;

//     console.log("🚀 ~ file: index.js:63 ~ socket.on ~ data:", data);

//     const filteredGroup = chatgroups.filter(
//       (item) => item.id === groupIdentifier
//     );
//     const newMessage = {
//       id: createUniqueId(),
//       text: currentChatMesage,
//       currentUser,
//       time: `${timeData.hr}:${timeData.mins}`,
//     };

//     socket.to("a").emit("groupMessage", newMessage);
//     filteredGroup[0].messages.push(newMessage);
//     socket.emit("groupList", chatgroups);
//     socket.emit("foundGroup", filteredGroup[0].messages);
//   });
// });

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
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
