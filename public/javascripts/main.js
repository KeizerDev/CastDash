jQuery(document).ready(function($) {
    var socket = io();

    var playButton = $('#playButton');
    var volume  = $('#volume');
    var currentAudio = null;

    socket.on('playState', function(data) {
        if (data == true) {
            $('#playButton').html('play_circle_filled');
        } else if(data == false) {
            $('#playButton').html('pause');
        }
    });

    socket.on('volumeState', function(value) {
        volume.get(0).MaterialSlider.change(value);
    });

    playButton.on('click', function() {
        if(playButton.html() == 'play_circle_filled') {
            socket.emit('setPlayState', false);
        } else if(playButton.html() == 'pause') {
            socket.emit('setPlayState', true);
        }
    });

    volume.on('change input', function() {
        socket.emit('setVolume', this.value);
    });
    $('.search-form').submit(function(event) {
        searchVal = $('.search-form input').val();
        $.getJSON(window.location.origin + '/pleer/' + searchVal, function(json, textStatus) {
            $('ul.search-results').html('');
            receivedData = json;
            $.each(json.tracks, function(index,value) {
                $('ul.search-results').append('<li class="song">'+value.artist+' - '+value.track+'</li>')
            });
        });
        event.preventDefault();
    });



});