import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const httpServer = createServer(app);

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Socket.io configuration
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
  pingTimeout: 60000,
  pingInterval: 25000,
});

// Store online users
const onlineUsers = new Map();

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    status: "running",
    connections: io.engine.clientsCount,
    onlineUsers: onlineUsers.size,
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("✅ Client connected:", socket.id);

  // User comes online
  socket.on("user:online", (userId) => {
    onlineUsers.set(userId, socket.id);
    io.emit("user:status", { userId, status: "online" });
    console.log(`👤 User ${userId} is online (${onlineUsers.size} total)`);
  });

  // Join conversation room
  socket.on("conversation:join", (conversationId) => {
    socket.join(`conversation:${conversationId}`);
    console.log(`📥 Socket ${socket.id} joined conversation ${conversationId}`);
  });

  // Leave conversation room
  socket.on("conversation:leave", (conversationId) => {
    socket.leave(`conversation:${conversationId}`);
    console.log(`📤 Socket ${socket.id} left conversation ${conversationId}`);
  });

  // Send message
  socket.on("message:send", (data) => {
    const { conversationId, message } = data;
    socket.to(`conversation:${conversationId}`).emit("message:new", message);
    console.log(`💬 Message sent to conversation ${conversationId}`);
  });

  // Typing indicators
  socket.on("typing:start", (data) => {
    const { conversationId, user } = data;
    socket.to(`conversation:${conversationId}`).emit("typing:start", user);
  });

  socket.on("typing:stop", (data) => {
    const { conversationId, user } = data;
    socket.to(`conversation:${conversationId}`).emit("typing:stop", user);
  });

  // Mark messages as read
  socket.on("messages:read", (data) => {
    const { conversationId, userId } = data;
    socket
      .to(`conversation:${conversationId}`)
      .emit("messages:read", { userId });
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        io.emit("user:status", { userId, status: "offline" });
        console.log(
          `👤 User ${userId} went offline (${onlineUsers.size} remaining)`
        );
        break;
      }
    }
    console.log("❌ Client disconnected:", socket.id);
  });

  // Error handling
  socket.on("error", (error) => {
    console.error("Socket error:", error);
  });
});

// Start server
const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`🚀 Socket.io server running on port ${PORT}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  httpServer.close(() => {
    console.log("HTTP server closed");
  });
});
