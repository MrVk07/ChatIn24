import express from 'express';
import http from 'http';
import generateRoomId from './utils/generateRoomId.js';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "*",
    }
});

app.use(cors());

const rooms = new Set();

io.on('connection', (socket) => {
    socket.on('host_room', () => {
        const roomId = generateRoomId();
        socket.join(roomId);
        rooms.add(roomId);
        socket.emit('room_hosted', roomId);
    });

    socket.on('join_room', (data) => {
        const { roomId, username } = data;
        if (rooms.has(roomId)) {
            socket.join(roomId);
            socket.emit('room_joined', roomId);
        } else {
            socket.emit('room_not_found', 'Room not found');
        }
    });

    socket.on('send_message', (data) => {
        const { message, roomId, username } = data;
        io.to(roomId).emit('receive_message', { message, name: username });
    });

    socket.on('disconnect', () => {
        rooms.forEach((roomId) => {
            if (socket.rooms.has(roomId)) {
                rooms.delete(roomId);
            }
        });
    });
});

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
