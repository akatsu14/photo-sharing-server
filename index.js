const express = require("express");
const app = express();
const cors = require("cors");
const { createServer } = require("node:http");
const { Server } = require("socket.io");

const dbConnect = require("./db/dbConnect");
const UserRouter = require("./routes/UserRouter");
const BXHRouter = require("./routes/BXHRouter");
// const PhotoRouter = require("./routes/PhotoRouter");
// const CommentRouter = require("./routes/CommentRouter");
const AuthRouter = require("./routes/AuthRouter");
const User = require("./db/userModel");
const { hostname } = require("node:os");

// const BookmarkRouter = require("./routes/BookmarkRouter");
// const LikeRouter = require("./routes/LikeRouter");
// const MessageRouter = require("./routes/MessageRouter");
// const OnlineRouter = require("./routes/OnlineRouter");
// const Message = require("./db/messageModel");
// const Online = require("./db/onlineModel");

dbConnect();

app.use(cors());
app.use(express.json());
// app.use("/uploads", express.static("uploads"));
app.use("/admin", AuthRouter);
app.use("/api/user", UserRouter);
app.use("/api/bxh", BXHRouter);
// app.use("/api/photosOfUser", PhotoRouter);
// app.use("/api/likeOfPhoto", LikeRouter);
// app.use("/api/bookmarkOfPhoto", BookmarkRouter);
// app.use("/api/commentsOfUser", CommentRouter);
// app.use("/api/messageOfUser", MessageRouter);
// app.use("/api/onlineUser", OnlineRouter);
app.get("/", (request, response) => {
  response.send({ message: "Hello from photo-sharing app API!" });
});

app.listen(8081, () => {
  console.log("server listening on port 8081");
});

// const server = createServer(app);
// const userStatus = [];

// const io = new Server(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"],
//   },
// });

// io.on("connection", (socket) => {
//   console.log(`User Connected: ${socket.id}`);
//   socket.on("user-online", async (userId) => {
//     try {
//       const onlineUser = new Online({
//         user_id: userId,
//       });
//       const online = await Online.findOne({ user_id: userId });
//       if (!online) await onlineUser.save();
//     } catch (error) {
//       console.log("🚀 ~ socket.on ~ error:", error);
//     }
//     userStatus[userId] = true;
//     io.emit("user-status", { userId, status: "online" });
//   });
//   socket.on("join_room", (data) => {
//     socket.join(data);
//     console.log(`User with ID: ${socket.id} joined room: ${data}`);
//   });

//   socket.on("send_message", async (data) => {
//     try {
//       const newMessage = new Message({
//         room_id: data.room_id,
//         sender_id: data.sender_id,
//         message: data.message,
//         create_at: data.create_at,
//       });
//       await newMessage.save();
//     } catch (error) {
//       console.log("Error sending message", error);
//     }
//     socket.emit("is_send");
//     socket.to(data.room_id).emit("receive_message", data);

//     console.log("🚀 ~ socket.on ~ data:", data);
//   });
//   socket.on("user-offline", async (userId) => {
//     try {
//       const offlineUser = await Online.findOneAndDelete({ user_id: userId });
//       console.log("🚀 ~ socket.on ~ offlineUser:", offlineUser);
//     } catch (error) {
//       console.log("🚀 ~ socket.on ~ error:", error);
//     }
//     userStatus[userId] = false;
//     io.emit("user-status", { userId, status: "offline" });
//   });
//   socket.on("disconnect", () => {
//     for (let userId in userStatus) {
//       if (userStatus[userId] === socket.id) {
//         userStatus[userId] = false;
//         io.emit("user-status", { userId, status: "offline" });
//         break;
//       }
//     }
//     console.log("User Disconnected", socket.id);
//   });
// });

// server.listen(3000, () => {
//   console.log("server running at http://localhost:3000");
// });

// const server2 = createServer(app);
// const io2 = new Server(server2, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"],
//   },
// });
// io2.on("connection", (socket) => {
//   console.log("a user connected");

//   socket.on("sendComment", () => {
//     console.log("user comment");
//     socket.emit("commented");
//   });
//   socket.on("likePost", () => {
//     console.log("user likePost");
//     socket.emit("liked");
//   });
//   socket.on("bookmarkPost", () => {
//     console.log("user likePost");
//     socket.emit("bookmark");
//   });

//   socket.on("disconnect", () => {
//     console.log("user disconnected");
//   });
// });
// server2.listen(8080, () => {
//   console.log("server2 running at http://localhost:8080");
// });

// tạo 1 server websocket lắng nghe sự kiện tạo phòng chờ khi chơi game 2 người 
const server3 = createServer(app);
const io3 = new Server(server3, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
let quickMatchQueue = []; 
io3.on("connection", (socket) => {
  console.log("a user connected to game server");
  socket.on("createRoom", (roomId) => {
    socket.join(roomId);
    console.log(`User with ID: ${socket.id} created room: ${roomId}`);
  });
socket.on("game_end", (roomId) => {
    socket.emit("game_end_frontend");
    console.log('Game ended');
  });
  // Thay đổi trong file server (io3)

socket.on("start_game", (data) => {
    const roomId = data.roomId;
    console.log(`Host in room ${roomId} started the game.`);
    // Broadcast lệnh bắt đầu game cho tất cả người chơi trong phòng
    io3.to(roomId).emit("start_game_frontend"); 
});
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`User with ID: ${socket.id} joined room: ${roomId}`);
    socket.to(roomId).emit("player_joined", { msg: "A new player joined" });
  });

  // Xử lý tạo phòng riêng tư
  socket.on("createPrivateRoom", async (data) => {
    const { roomCode, roomName, password, userId } = data;
    socket.join(roomCode);
    console.log(`✅ User ${userId} created private room: ${roomCode}`);
    socket.emit("roomCreatedSuccess", { roomCode, roomName });
  });

  // Xử lý tham gia phòng riêng tư
  socket.on("joinPrivateRoom", async (data) => {
    const { roomCode, password, userId } = data;
    socket.join(roomCode);
    console.log(`✅ User ${userId} joined private room: ${roomCode}`);
    
    try {
      const guestUser = await User.findOne({ _id: userId });
      const guestName = guestUser ? guestUser.full_name : "Người chơi 2";
      
      // Thông báo cho host
      socket.to(roomCode).emit("player_joined", { guestName });
      
      // Thông báo cho guest
      socket.emit("roomJoinedSuccess", { roomCode });
    } catch (error) {
      console.log("Error joining room:", error);
      socket.emit("roomError", { msg: "Không thể tham gia phòng" });
    }
  });
  socket.on("sendGameData", (data) => {
    socket.to(data.roomId).emit("receiveGameData", data);
    console.log("🚀 ~ socket.on ~ data:", data);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected from game server");
  });
  // Thêm code này vào khối io3.on("connection", (socket) => { ... });

// Dùng mảng tạm thời cho hàng đợi tìm trận (đơn giản hóa, không có logic xếp hạng)



socket.on("joinQueue", async (userId) => {
  console.log("Quick Match Queue initialized.", quickMatchQueue, userId);
    // Ngăn chặn trùng lặp, nếu đã có trong hàng đợi thì không thêm nữa
    if (!quickMatchQueue.includes(userId)) {
        quickMatchQueue.push({ userId, socketId: socket.id });
        console.log(`User ${userId} joined the queue. Queue size: ${quickMatchQueue.length}`);
    }
    // Kiểm tra tìm trận (cần 2 người)
    if (quickMatchQueue.length >= 2) {
        const player1 = quickMatchQueue.shift(); // Lấy người chơi 1 (Host)
        const player2 = quickMatchQueue.shift(); // Lấy người chơi 2 (Guest)
        
        // Tạo một Room ID ngẫu nhiên cho trận đấu này
        const matchRoomId = "QM-" + Math.random().toString(36).substring(2, 8).toUpperCase();

        // 1. Thêm 2 người chơi vào Room
        const p1Socket = io3.sockets.sockets.get(player1.socketId);
        const p2Socket = io3.sockets.sockets.get(player2.socketId);
        
        p1Socket.join(matchRoomId);
        p2Socket.join(matchRoomId);

        console.log(`Match found: ${player1.userId} vs ${player2.userId} in room ${matchRoomId}`);
try {
      const player1inf = await User.findOne({ _id: player1.userId });
      console.log("🚀 ~ socket.on ~ player1inf:", player1inf);
      const player2inf   = await User.findOne({ _id: player2.userId });
      const matchData = { 
            roomId: matchRoomId, 
            hostId: player1.userId,
            guestId: player2.userId,
            hostfullname: player1inf.full_name,
            guestfullname: player2inf.full_name,
        };

        // Gửi cho cả hai người chơi
        io3.to(matchRoomId).emit("matchFound", matchData);
    } catch (error) {
      console.log("🚀 ~ socket.on ~ error:", error);
    }
        // 2. Gửi sự kiện matchFound cho cả 2 người chơi
        
    }
});

// Xử lý khi người chơi sẵn sàng
socket.on("ready", (data) => {
    const { roomId, userId } = data;
    
    // Gửi thông báo cho toàn bộ phòng (trừ người gửi) rằng có người đã sẵn sàng
    socket.to(roomId).emit("playerReady", userId);
});

// Xử lý cập nhật điểm số
socket.on("updateScore", (data) => {
    console.log("🎯 RECEIVED updateScore event:", data);
    const { roomId, userId, score } = data;
    console.log(`📊 Score update from ${userId} in room ${roomId}: ${score}`);
    
    // Broadcast điểm số cho tất cả người chơi trong phòng (bao gồm cả người gửi)
    io3.to(roomId).emit("scoreUpdate", { userId, score });
    console.log(`✅ Broadcasted scoreUpdate to room ${roomId} - Data:`, { userId, score });
});

// Xử lý khi ngắt kết nối
socket.on("disconnectquickmatch", () => {
    console.log("user disconnected from quickmatch");
    
    // Loại bỏ người chơi khỏi hàng đợi nếu họ đang tìm trận
    quickMatchQueue = quickMatchQueue.filter(p => p.socketId !== socket.id);
});
});
server3.listen(8082, () => {
  console.log("game server running at http://localhost:8082");
});