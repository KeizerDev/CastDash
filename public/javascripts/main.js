jQuery(document).ready(function($) {
    var socket = io();

    var playButton = $('#playButton');
    var volume  = $('#volume');
    var currentAudio = null;

    var currentArtist = $('#currentArtist');
    var currentTrack = $('#currentTrack');

    socket.on('playState', function(data) {
        if (data == true) {
            if (currentAudio != null) {
                currentAudio.pause();
            }
            $('#playButton').html('play_circle_filled');
        } else if (data == false) {
            if (currentAudio != null) {
                currentAudio.play();
            }
            $('#playButton').html('pause');
        }
    });

    socket.on('volumeState', function(value) {
        if (currentAudio != null) {
            currentAudio.volume = (value / 100);
        }
        volume.get(0).MaterialSlider.change(value);
    });

    playButton.on('click', function() {
        if (playButton.html() == 'play_circle_filled') {
            socket.emit('setPlayState', false);
        } else if(playButton.html() == 'pause') {
            socket.emit('setPlayState', true);
        }
    });

    volume.on('change input', function() {
        socket.emit('setVolume', this.value);
    });


    socket.on('clientsConnected', function(amount) {
        //todo: bind the amount of users to the DOM
    });

    socket.on('newSong',function(id, artist, track){
        if(currentAudio != null) {
            currentAudio.pause();
        }

        currentArtist.html(artist);
        currentTrack.html(track);

        currentAudio = new Audio('http://pleer.com/browser-extension/files/' + id + '.mp3');
        currentAudio.play();
        currentAudio.volume = volume.get(0).MaterialSlider.element_.value / 100;
        socket.emit('setPlayState', false);

        currentAudio.addEventListener('timeupdate', function() {
           console.log(this.currentTime);
        });
    });


    socket.on('updateQueue', function(queue) {
            $.get('templates/queue.hbs', function (templateData) {
                var template = Handlebars.compile(templateData);
                $('.queue-list').html(template({tracks: queue}));
            });
    });

    $('.search-form').submit(function(event) {
        searchVal = $('.search-form input').val();
        $.getJSON(window.location.origin + '/pleer/' + searchVal, function(json) {
            console.log(json);
            $.get('templates/tracks.hbs', function (templateData) {
                var template = Handlebars.compile(templateData);
                $('.search-results').html(template(json));
                $('.song-item').each(function() {
                    $(this).click(function() {
                        console.log('adding new song to the queue');
                        socket.emit('addSong', $(this).data('id'), $(this).data('artist'), $(this).data('track'));
                    });
                })
            });
        });
        event.preventDefault();
    });
});