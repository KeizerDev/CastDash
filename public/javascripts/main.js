jQuery(document).ready(function($) {
    var socket = io();

    var playButton = $('#playButton');
    var volume  = $('#volume');

    socket.on('playState', function(data) {
        if(data == true) {
            $('#playButton').html('play_circle_filled');
        }else if(data == false) {
            $('#playButton').html('pause');
        }
    });


    playButton.on('click', function() {
        if(playButton.html() == 'play_circle_filled') {
            socket.emit('setPlayState', false);
        }else if(playButton.html() == 'pause') {
            socket.emit('setPlayState', true);
        }
    });


    volume.on('change input', function() {
        console.log(this.value);
    });





});