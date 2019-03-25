function introduce(sock, intro)
{
    if(sock.connected)
    {
        sock.emit("introduce", intro);
    }
    sock.on("connect", () => sock.emit("introduce", intro));
    sock.on('manual-ping', () => socket.emit('manual-pong'));
    sock.intro = intro;
}

function onEx(sock, event, callback) {
    sock.on(event, (...args) => {
        var data = {event: event, error: null, client: sock.intro};
        if(event == "tick") data.tick = args[0];
        try
        {
            callback.apply(null, args);
        }
        catch(e)
        {
            data.error = e.message;
        }
        sock.emit("feedback", data);
    })
};