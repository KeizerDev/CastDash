jQuery(document).ready(function($) {
    var socket = io();

    var playButton = $('#playButton');
    var volume  = $('#volume');
    var currentAudio = null;

    socket.on('playState', function(data) {
        if (data == true) {
            if(currentAudio != null) {
                currentAudio.pause();
            }
            $('#playButton').html('play_circle_filled');
        } else if(data == false) {
            if(currentAudio != null) {
                currentAudio.play();
            }
            $('#playButton').html('pause');
        }
    });

    socket.on('volumeState', function(value) {
        if(currentAudio != null) {
            currentAudio.volume = (value / 100);
        }
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


    socket.on('newSong',function(url){
        if(currentAudio != null) {
            currentAudio.pause();
        }

        currentAudio = new Audio(url);
        currentAudio.play();
        socket.emit('setPlayState', false);
    });

    $('.search-form').submit(function(event) {
        searchVal = $('.search-form input').val();
        $.getJSON(window.location.origin + '/pleer/' + searchVal, function(json) {
            $.get('templates/tracks.hbs', function (templateData) {
                var template = Handlebars.compile(templateData);
                $('.search-results').html(template(json));
                $('.song-item').each(function() {
                    $(this).click(function() {
                        socket.emit('playSong', $(this).attr('url'));
                    });
                })
            });
        });
        event.preventDefault();
    });



});