var Client                = require('castv2-client').Client;
var DefaultMediaReceiver  = require('castv2-client').DefaultMediaReceiver;
var events = require('events');
var util = require('util');
var debug = require('debug')('Device');

var Device = function(options) {
    events.EventEmitter.call(this);
    var self = this;
    self.config = options;
    this.init();
};

exports.Device = Device;
util.inherits(Device, events.EventEmitter);

Device.prototype.connect = function(callback) {
    var self = this;
    self.client.connect(self.host, function() {
        debug('connected, launching app ...');
        self.client.launch(DefaultMediaReceiver, function(err, player) {
            if (err) {
                debug(err);
            } else {
                self.player = player;
                self.emit('connected');
            }

            player.on('status', function(status) {
                if (status){
                    debug('status broadcast playerState=%s',status.playerState);
                } else {
                    debug('-');
                }
            });

        });
    });

    self.client.on('error', function(err) {
        console.log('Error: %s', err.message);
        self.connect(self.host);
        self.client.close();
    });
};

Device.prototype.init = function() {
    var self = this;
    self.client = new Client();
    self.host = self.config.addresses[0];
    self.playing = false;
};

Device.prototype.play = function(resource, n, callback) {
    var self = this;

    options = { autoplay: true };

    if (typeof(resource) === 'string'){
        var media = {
            contentId: resource,
            contentType: 'video/mp4'
        };
    } else {
        var media = {
            contentId: resource.url,
            contentType: 'video/mp4'
        };
        if (resource.subtitles){
            var tracks = [];
            var i = 0;
            for (var each in resource.subtitles ) {
                var track = {
                    trackId: i,
                    type: 'TEXT',
                    trackContentId: resource.subtitles[i].url,
                    trackContentType: 'text/vtt',
                    name: resource.subtitles[i].name,
                    language: resource.subtitles[i].language,
                    subtype: 'SUBTITLES'
                };
                tracks.push(track);
                i++;
            }

            media.tracks = tracks;
            options['activeTrackIds'] = [0];
        }
        if (resource.subtitles_style){
            media.textTrackStyle = resource.subtitles_style;
            self.subtitles_style = resource.subtitles_style;
        }
        if (resource.cover) {
            media.metadata = {
                type: 0,
                metadataType: 0,
                title: resource.cover.title,
                images: [
                    { url: resource.cover.url }
                ]
            };
        }
    }

    options['currentTime'] = n || 0;

    self.player.load(media, options, function(err, status) {
        self.playing = true;
        self.timePosition = options['currentTime'];
        self.startedTime = process.hrtime()[0];
        if (callback){
            callback(err,status);
        }
    });
};

Device.prototype.getStatus = function(callback) {
    var self = this;
    
    self.player.getStatus(function(err, status) {
		if (err) {
			console.log("getStatus error: %s", err.message);
		} else {
			callback(status);
		}
    });
};

Device.prototype.seek = function(seconds, callback) {
    var self = this;

    self.timePosition += process.hrtime()[0] - self.startedTime;
    var newCurrentTime = self.timePosition + seconds;
	//Retrieve updated status just before seek
	self.getStatus(function(newStatus) {
		newCurrentTime = newStatus.currentTime + seconds;
	});

    self.player.seek(newCurrentTime, function() {
        self.startedTime = process.hrtime()[0];
        self.timePosition = newCurrentTime;
        callback();
    });
};

Device.prototype.pause = function(callback) {
    var self = this;

    self.playing = false;
    self.timePosition += process.hrtime()[0] - self.startedTime;
    self.player.pause(callback);
};

Device.prototype.setVolume = function(volume, callback) {
    var self = this;

    self.client.setVolume(volume, callback);
};

Device.prototype.unpause = function(callback) {
    var self = this;
    self.playing = true;
    self.startedTime = process.hrtime()[0];
    self.player.play(callback);
};

Device.prototype.stop = function(callback) {
    var self = this;
    self.playing = false;
    self.player.stop(callback);
};

Device.prototype.subtitlesOff = function(callback) {
    var self = this;
    self.player.media.sessionRequest({
        type: 'EDIT_TRACKS_INFO',
        activeTrackIds: [] // turn off subtitles.
    }, function(err, status){
        if (err) callback(err);
        callback(null, status);
    });
};

Device.prototype.changeSubtitles = function(num, callback) {
    var self = this;
    self.player.media.sessionRequest({
        type: 'EDIT_TRACKS_INFO',
        activeTrackIds: [num] // turn off subtitles.
    }, function(err, status){
        if (err) callback(err);
        callback(null, status);
    });
};

Device.prototype.changeSubtitlesSize = function(num, callback) {
    var self = this;
    var newStyle = self.subtitles_style;
    newStyle.fontScale = num;
    self.player.media.sessionRequest({
        type: 'EDIT_TRACKS_INFO',
        textTrackStyle: newStyle
    }, function(err, status){
        if (err) callback(err);
        callback(null, status);
    });
};