jQuery(document).ready(function($) {
    var socket = io();

    var playButton = $('#playButton');
    var volume  = $('#volume');

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
        $.getJSON(window.location.origin + '/pleer/' + searchVal, function(json) {
            $.get('templates/tracks.hbs', function (templateData) {
                var template = Handlebars.compile(templateData);
                $('.search-results').html(template(json));
            });
        });
        event.preventDefault();
    });

});