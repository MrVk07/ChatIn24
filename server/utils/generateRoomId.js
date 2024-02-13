const generateRoomId = () => {
    const roomId = Math.floor(100000 + Math.random() * 900000);
    return roomId.toString();
}

export default generateRoomId

