import React, { useState } from 'react';
import io from 'socket.io-client';
import Button from './Button';
import TextInput from './TextInput';

const socket = io.connect("http://localhost:5000");

function ChatApp() {
    const [roomId, setRoomId] = useState('');
    const [inputMessage, setInputMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState('');
    const [username, setUsername] = useState('');
    const [insideRoom, setInsideRoom] = useState(false);

    const hostRoom = () => {
        if (username.trim().length < 3) {
            setError("Username should be at least 3 characters");
            return;
        }
        socket.emit('host_room');
        socket.on('room_hosted', (roomId) => setRoomId(roomId))
        setError('');
        setInputMessage('');
        setMessages([]);
        setInsideRoom(true);

    };

    const joinRoom = () => {
        if (roomId.length !== 6 || isNaN(roomId) || username.trim().length < 3) {
            setError('Room ID must be a 6-digit number and Username should be at least 3 characters');
            return;
        }
        socket.emit('join_room', { roomId, username });
        setError('');
        setInputMessage('');
        setMessages([]);
        setInsideRoom(true);
    };

    const disconnectRoom = () => {
        setError('');
        setInputMessage('');
        setMessages([]);
        setRoomId('');
        setInsideRoom(false);
    };

    const sendMessage = () => {
        if (inputMessage.trim() !== '') {
            socket.emit('send_message', { message: inputMessage, roomId, username });
            setInputMessage('');
        }
    };

    socket.on('receive_message', (data) => {
        const { message, username } = data;
        setMessages([...messages, `${username}: ${message}`]);
    });

    socket.on('room_not_found', (errorMessage) => {
        setError(errorMessage);
        setInputMessage('');
        setMessages([]);
        setInsideRoom(false);
    });


    return (
        <div className="max-w-xl mx-auto mt-8 p-4 bg-gray-100 rounded-lg">
            {insideRoom &&
                <div className='bg-gray-950 text-white p-2 rounded focus:outline-none w-20 h-20 m-2 justify-center items-center border-red-600'>
                    Room ID: {roomId}
                </div>
            }
            {!insideRoom && <div className="flex justify-between items-center mb-4">
                <Button
                    onClick={hostRoom}
                    disabled={insideRoom}
                    text="Host a Room"
                    className={`bg-blue-500 hover:bg-blue-700 text-white font-bold rounded focus:shadow-outline ${insideRoom ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
                <Button
                    onClick={joinRoom}
                    disabled={insideRoom}
                    text="Join a Room"
                    className={`bg-green-500 hover:bg-green-700 text-white font-bold rounded focus:shadow-outline ${insideRoom ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
                <TextInput
                    value={username}
                    onChange={(e) => { !insideRoom && setUsername(e.target.value) }}
                    placeholder="Enter Username"
                />
                <TextInput
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    placeholder="Enter 6-digit Room ID"
                />
            </div>}

            {error && <div className="text-red-500 mt-2">{error}</div>}


            {insideRoom && (
                <div className="mt-4">
                    <div className="overflow-y-auto max-h-64">
                        {messages.map((msg, index) => (
                            <div key={index} className="p-2 bg-gray-200 my-1 rounded">{msg}</div>
                        ))}
                    </div>
                    <TextInput
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Enter your message..."
                    />
                    <Button
                        onClick={sendMessage}
                        text="Send"
                        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2 focus:outline-none focus:shadow-outline"
                    />
                    <Button
                        onClick={disconnectRoom}
                        text="Disconnect from Room"
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    />
                </div>
            )}
        </div>
    );
}

export default ChatApp;
