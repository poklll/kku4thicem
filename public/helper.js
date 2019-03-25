function introduce(sock, intro)
{
    if(socket.connected)
    {
        sock.emit("introduce", intro);
    }
    sock.on("connect", () => sock.emit("introduce", intro));
    sock.on('manual-ping', () => socket.emit('manual-pong'));
}