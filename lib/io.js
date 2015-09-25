var io = function(io, socket, data) {


    function setEventHandlers() {
        sendInitData();
        socket.on('setPlayState', setPlayState);
        socket.on('setVolume', setVolume);
        socket.on('addSong', addSong);
        socket.on('requestSong', requestSong);
        socket.on('disconnect', disconnect)

    }

    function sendInitData() {
        //increase the amount of clients connected
        data.clientsConnected++;

        io.emit('playState', data.isPlaying);
        io.emit('volumeState', data.volume);
        io.emit('clientsConnected', data.clientsConnected);
        io.emit('playSong', data.currentPlaying);
        io.emit('updateQueue', data.queue);
    }



    function setPlayState(socketData) {
        data.isPlaying = socketData;
        io.emit('playState', data.isPlaying);
    }

    function setVolume(value) {
        data.volume = value;
        io.emit('volumeState', data.volume);
    }

    function addSong(songID, artist, track) {
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
    }


    function requestSong(songIndex ,data) {
            data.currentPlaying = {
                index: songIndex,
                songID: data.songID,
                artist: data.artist,
                track: data.track
            };

            io.emit('playSong', songIndex, data.songID, data.artist, data.track)
    }

    function disconnect() {
        data.clientsConnected--;
        io.emit('clientsConnected', data.clientsConnected);
    }


    setEventHandlers();

};


module.exports = io;