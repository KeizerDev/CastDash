var io = function(io, socket, data) {

    //increase the amount of clients connected
    data.clientsConnected++;

    io.emit('playState', data.isPlaying);
    io.emit('volumeState', data.volume);
    io.emit('clientsConnected', data.clientsConnected);
    io.emit('updateQueue', data.queue);
    io.emit('playSong', data.currentPlaying);

    socket.on('setPlayState', function(socketData) {
        data.isPlaying = socketData;
        io.emit('playState', data.isPlaying);
    });

    socket.on('setVolume', function(value) {
        data.volume = value;
        io.emit('volumeState', data.volume);
    });

    socket.on('addSong', function(songID, artist, track) {
        data.queue.push({
            songID : songID,
            artist : artist,
            track  : track
        });

        if(data.queue.length == 1) {
            data.currentPlaying = {
                index: 0,
                songID : songID,
                artist : artist,
                track  : track
            };
        }

        io.emit('updateQueue', data.queue);
    });


    socket.on('requestSong', function(songIndex ,data) {
        if(data != null) {
            data.currentPlaying = {
                index: songIndex,
                songID: data.songID,
                artist: data.artist,
                track: data.track
            };

            io.emit('playSong', songIndex, data.songID, data.artist, data.track)
        }
    });

    socket.on('disconnect', function() {
        data.clientsConnected--;
        io.emit('clientsConnected', data.clientsConnected);
    });

};


module.exports = io;