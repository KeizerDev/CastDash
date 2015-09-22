jQuery(document).ready(function($) {
    var socket = io();



    var playButton = $('#playButton');
    var previousButton = $('#previousButton');
    var nextButton = $('#nextButton');
    var volume  = $('#volume');
    var currentAudio = null;

    var currentArtist = $('#currentArtist');
    var currentTrack = $('#currentTrack');

    var currentQueue= [];
    var currentSongIndex = 0;

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


    previousButton.on('click', function() {
        if(currentSongIndex != 0) {
            socket.emit('requestSong', (currentSongIndex - 1), currentQueue[currentSongIndex - 1]);
        }
    });

    nextButton.on('click', function() {
        if(currentSongIndex != currentQueue.length) {
            socket.emit('requestSong', (currentSongIndex + 1), currentQueue[currentSongIndex + 1]);
        }
    });


    volume.on('change input', function() {
        socket.emit('setVolume', this.value);
    });


    socket.on('clientsConnected', function(amount) {
        $('#clients').html(amount);
    });

    socket.on('playSong', function(songIndex, songID, artist, track) {
        if(currentAudio != null) {
            currentAudio.pause();
        }

        currentSongIndex = songIndex;

        currentArtist.html(artist);
        currentTrack.html(track);

        currentAudio = new Audio('http://pleer.com/browser-extension/files/' + songID + '.mp3');
        currentAudio.play();
        currentAudio.volume = volume.get(0).MaterialSlider.element_.value / 100;
        socket.emit('setPlayState', false);
    });


    socket.on('updateQueue', function(queue) {
        currentQueue = queue;
        $.get('templates/queue.hbs', function (templateData) {
            var template = Handlebars.compile(templateData);
            $('.queue-list').html(template({tracks: queue}));
        });

        if(queue.length == 1) {
            socket.emit('requestSong', currentSongIndex, currentQueue[0]);
        }
    });

    $('.search-form').submit(function(event) {
        searchVal = $('.search-form input').val();
        $.getJSON(window.location.origin + '/pleer/' + searchVal, function(json) {
            $.get('templates/tracks.hbs', function (templateData) {
                var template = Handlebars.compile(templateData);
                $('.search-results').html(template(json));
                $('.song-item').each(function() {
                    $(this).click(function() {
                        socket.emit('addSong', $(this).data('id'), $(this).data('artist'), $(this).data('track'));
                    });
                })
            });
        });
        event.preventDefault();
    });

});