"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIO = exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
let io;
const initSocket = (server) => {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });
    io.on("connection", (socket) => {
        console.log("Client connected:", socket.id);
        // Clients can join rooms
        socket.on("join-room", (roomName) => {
            if (roomName) {
                socket.join(roomName.toString());
            }
        });
        socket.on("join_room", (roomName) => {
            if (roomName) {
                socket.join(roomName.toString());
            }
        });
        socket.on("disconnect", () => {
            console.log("Client disconnected:", socket.id);
        });
    });
    return io;
};
exports.initSocket = initSocket;
const getIO = () => {
    if (!io) {
        console.warn("Socket.io not initialized!");
    }
    return io;
};
exports.getIO = getIO;
//# sourceMappingURL=socket.js.map