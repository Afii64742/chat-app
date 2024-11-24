import { Server } from "socket.io";
import User from "../models/user.js";

const initChatSocket = (server) => {
    const io = new Server(server, { cors: { origin: "http://localhost:5173" } });
    const onlineUsers = new Map();

    io.on("connection", (socket) => {
        console.log("New user connected", socket.id);

        // Handle user login and set online status
        socket.on("login", async (userId) => {
            onlineUsers.set(userId, socket.id);
            await User.findByIdAndUpdate(userId, { isOnline: true });
            io.emit("onlineUsers", Array.from(onlineUsers.keys()));
        });

    // Handle user disconnect
    socket.on("disconnect", async () => {
        console.log("user disconnected", socket.id);
        const userId = onlineUsers.get(socket.id); 
        if (userId) {
            onlineUsers.delete(socket.id); 
            await User.findByIdAndUpdate(userId, { isOnline: false }); 
            console.log(`User ${userId} is now offline`);
            io.emit("onlineUsers", Array.from(onlineUsers.values())); 
        }
    });

        // Handle private messaging
        socket.on("sendMessage", (data) => {
            const { sender, receiver, message } = data;
            const receiverSocketId = onlineUsers.get(receiver);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("receiveMessage", { sender, message });
            }
        });

       // Handle group messaging
        socket.on("groupMessage", (data) => {
            const { groupId, message } = data;
            const groupMembers = onlineUsers.filter(
                ([id]) => id !== socket.id
            ).map(([id]) => id);
            groupMembers.forEach((memberSocketId) => {
                io.to(memberSocketId).emit("receiveGroupMessage", {
                    groupId,
                    message,
                });
            });
        });

        // Handle typing status
        socket.on("typing", (data) => {
            const { receiver } = data;
            const receiverSocketId = onlineUsers.get(receiver);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("typing", { sender: socket.id });
            }
        });            
        });

    return io;
};

export default initChatSocket;
