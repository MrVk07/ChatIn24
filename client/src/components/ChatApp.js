import React, { useState } from "react";
import io from "socket.io-client";
import Button from "./Button";
import TextInput from "./TextInput";

const socket = io.connect("http://localhost:5000");

function ChatApp() {
    const [roomId, setRoomId] = useState("");
    const [inputMessage, setInputMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState("");
    const [username, setUsername] = useState("");
    const [insideRoom, setInsideRoom] = useState(false);

    const setValues = (errorMsg, joined) => {
        setError(errorMsg);
        setInputMessage("");
        setMessages([]);
        setInsideRoom(joined);
    }

    const hostRoom = () => {
        if (username.trim().length < 3) {
            setError("Username should be at least 3 characters");
            return;
        }
        socket.emit("host_room");
        socket.on("room_hosted", (roomId) => setRoomId(roomId))
        setValues("", true);
    };

    const joinRoom = () => {
        if (roomId.length !== 6 || isNaN(roomId)) {
            setError("Room ID must be a 6-digit number");
            return;
        }
        if (username.trim().length < 3) {
            setError("Username should be at least 3 characters")
            return;
        }
        socket.emit("join_room", { roomId, username });
        setValues("", true);
    };

    const disconnectRoom = () => {
        setValues("", false);
        setRoomId("");
    };

    const sendMessage = () => {
        if (inputMessage.trim() !== "") {
            socket.emit("send_message", { message: inputMessage, roomId, username });
            setInputMessage("");
        }
    };

    socket.on("receive_message", (data) => {
        const { message, name } = data;
        setMessages([...messages, { name, message }]);
    });

    socket.on("room_not_found", (errorMessage) => setValues(errorMessage, false));

    return (
        <div className="max-w-xl mx-auto mt-8 p-4 bg-gray-100 rounded-lg border-2">
            {insideRoom && (
                <>
                    <div className="flex justify-between items-center mb-4">
                        <div className="bg-gray-950 text-white p-2 rounded-lg focus:outline-none w-32 h-12 m-2 flex justify-center items-center">
                            <span className="text-xl">Room:</span>
                            <span className="ml-2 mt-1 text-lg font-bold">{roomId}</span>
                        </div>
                        <h1 className="text-xl font-bold">{username}</h1>
                        <Button
                            onClick={disconnectRoom}
                            text="Disconnect Room"
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="mt-4">
                        <div className="overflow-y-auto max-h-64">
                            {messages.map((msg, index) => (
                                <div key={index} className={`flex ${msg.name === username ? "justify-end" : "justify-start"}`}>
                                    <div className={`p-2 m-2 rounded ${msg.name === username ? "text-right bg-green-500" : "text-left bg-gray-200"}`}>
                                        {username !== msg.name && <span className="font-bold">{msg.name}: </span>}
                                        <span>{msg.message}</span>
                                    </div>
                                </div>
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
                    </div>
                </>
            )}
            {!insideRoom &&
                <>
                    <div className="flex justify-between items-center mb-4">
                        <Button
                            onClick={hostRoom}
                            disabled={insideRoom}
                            text="Host a Room"
                            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold rounded focus:shadow-outline ${insideRoom ? "opacity-50 cursor-not-allowed" : ""}`}
                        />
                        <Button
                            onClick={joinRoom}
                            disabled={insideRoom}
                            text="Join a Room"
                            className={`bg-green-500 hover:bg-green-700 text-white font-bold rounded focus:shadow-outline ${insideRoom ? "opacity-50 cursor-not-allowed" : ""}`}
                        />
                    </div>
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
                </>
            }
            {error && <div className="text-red-500 mt-2">{error}</div>}
        </div>
    );
}

export default ChatApp;
