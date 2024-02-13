import React, { useState } from 'react';
import io from 'socket.io-client';

const socket = io.connect("http://localhost:5000")

function ChatApp() {
    const [roomId, setRoomId] = useState('');
    const [inputMessage, setInputMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState('');


    return (
        <div className="max-w-xl mx-auto mt-8 p-4 bg-gray-100 rounded-lg">
            <div className="flex justify-between items-center mb-4">
                <button className="bg-blue-500 cursor-pointer">Host a Room</button>
                <button className="bg-green-500 cursor-pointer" >Join a Room</button>
            </div>
            <input type="text" value={roomId} onChange={(e) => setRoomId(e.target.value)} placeholder="Enter 6-digit Room ID"
                className="w-full p-2 mb-4 rounded border"
            />
            <button className="w-full bg-blue-500">Enter Room</button>
            {error && <div className="text-red-500 mt-2">{error}</div>}
            {roomId && (
                <div className="mt-4">
                    <div className="overflow-y-auto max-h-64">
                        {messages.map((msg, index) => (
                            <div key={index} className="p-2 bg-gray-200 my-1 rounded">{msg}</div>
                        ))}
                    </div>
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        className="w-full p-2 mt-2 rounded border border-gray-300"
                    />
                    <button className="w-full bg-blue-500 ">Send</button>
                </div>
            )}
            {roomId.length > 0 && <button className="bg-red-500" >Disconnect from Room</button>}
        </div>
    );
}

export default ChatApp;
