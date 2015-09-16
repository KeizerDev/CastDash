jQuery(document).ready(function($) {
    var socket = io();

    var playButton = $('#playButton');

    socket.on('playState', function(data) {
        if(data == true) {
            $('#playButton').html('playing');
        }else if(data == false) {
            $('#playButton').html('pause');
        }
    });


    playButton.on('click', function() {
        if(playButton.html() == 'playing') {
            socket.emit('setPlayState', false);
        }else if(playButton.html() == 'pause') {
            socket.emit('setPlayState', true);
        }
    });


});