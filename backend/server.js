const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const path = require("path");
const cors = require("cors");

const app = express();
dotenv.config();
connectDB();
app.use(express.json());

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

app.use(cors());

app.use(express.static(path.join(__dirname, "../frontend/public")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/public/index.html"));
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Servidor rodando na porta ${PORT}...`)
);

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

let usersOnline = [];

io.on("connection", (socket) => {
  console.log("Usuário conectado:", socket.id);
  
  // Emitir evento quando um usuário se conectar
  io.emit("userConnected", socket.id);

  socket.on("setup", (userData) => {
    usersOnline.push(userData);
    io.emit("useronline", usersOnline);
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("Usuário entrou na sala: " + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageReceived) => {
    var chat = newMessageReceived.chat;

    if (!chat.users) return console.log("chat.users não definido");

    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) return;

      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  socket.on("disconnect", () => {
    console.log("Usuário desconectado:", socket.id);
    
    // Remover usuário da lista de online ao se desconectar
    const disconnectedUserIndex = usersOnline.findIndex((user) => user.socket_id === socket.id);
    if (disconnectedUserIndex !== -1) {
      usersOnline.splice(disconnectedUserIndex, 1);
      io.emit("useronline", usersOnline);
    }

    // Emitir evento quando um usuário se desconectar
    io.emit("userDisconnected", socket.id);
  });
});
