import express from 'express';
import http from 'http';
import generateRoomId from './utils/generateRoomId.js';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

app.use(cors());

const rooms = new Map();

io.on('connection', (socket) => {
    console.log("-----------USER CONNECTED----------", socket.id);

    socket.on('host_room', () => {
        const roomId = generateRoomId();
        socket.join(roomId);
        rooms.set(roomId, { users: new Map() });
        socket.emit('room_hosted', roomId);
        console.log(`Room hosted: ${roomId}`);
    });

    socket.on('join_room', (data) => {
        const { roomId, username } = data;
        if (rooms.has(roomId)) {
            socket.join(roomId);
            rooms.get(roomId).users.set(socket.id, username);
            console.log(`User ${username} joined room: ${roomId}`);
            socket.emit('room_joined', roomId);
        } else {
            socket.emit('room_not_found', 'Room not found');
        }
    });

    socket.on('send_message', (data) => {
        const { message, roomId, username } = data;
        console.log('Message:', message);
        io.to(roomId).emit('receive_message', { message, name: username });
    });

    socket.on('disconnect', () => {
        console.log("-----------USER DISCONNECTED----------");
        rooms.forEach((room, roomId) => {
            if (room.users.has(socket.id)) {
                room.users.delete(socket.id);
                console.log(`User disconnected from room: ${roomId}`);
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
