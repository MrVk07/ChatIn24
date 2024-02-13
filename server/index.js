import express from 'express';
import http from 'http';
import generateRoomId from './utils/generateRoomId.js'
import { Server } from 'socket.io';

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);

const rooms = new Set();

io.on('connection', (socket) => {
    console.log("-----------USER CONNECTED----------", socket.id);

    socket.on('host_room', () => {
        const roomId = generateRoomId();
        socket.join(roomId);
        rooms.add(roomId);
        socket.emit('room_hosted', roomId);
        console.log(`Room hosted: ${roomId}`);
    });

    socket.on('disconnect', () => {
        console.log("-----------USER DISCONNECTED----------");
    });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
