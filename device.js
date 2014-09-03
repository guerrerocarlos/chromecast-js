var Client                = require('castv2-client').Client;
var DefaultMediaReceiver  = require('castv2-client').DefaultMediaReceiver;
var events = require('events')
var util = require('util')
var debug = require('debug')('Device')

var Device = function(options){
    events.EventEmitter.call(this);
    var self = this;
    self.config = options
    this.init()
}

exports.Device = Device
util.inherits( Device, events.EventEmitter );

Device.prototype.connect = function(callback){
    var self = this
    self.client.connect(self.host, function() {
        debug('connected, launching app ...');
        self.client.launch(DefaultMediaReceiver, function(err, player) {
            if(err){
                debug(err)
            }else{
                self.player = player
                self.emit('connected')
            }

            player.on('status', function(status) {
                if(status){
                    debug('status broadcast playerState=%s',status.playerState);
                }else{
                    debug('-')
                }
            });

        });
    });

    self.client.on('error', function(err) {
        console.log('Error: %s', err.message);
        self.connect(self.host)
        self.client.close();
    });

}

Device.prototype.init = function(){
    var self = this
    self.client = new Client();
    self.host = self.config.addresses[0]
    self.playing = false
}


Device.prototype.play = function(resource, n, subtitles, cover, callback){
    var self = this
    var media = {
        contentId: resource,
        contentType: 'video/mp4'
    };
    options = { autoplay: true }
    if(subtitles) {
        media.tracks = [{
          trackId: 1,
          type: 'TEXT',
          trackContentId: subtitles.url,
          trackContentType: 'text/vtt',
          name: subtitles.name,
          language: subtitles.language,
          subtype: 'SUBTITLES'
        }]
        options['activeTrackIds'] = [1];
    }

    if(cover) {
        media.metadata = {
          type: 0,
          metadataType: 0,
          title: cover.title,
          images: [
            { url: cover.url }
          ]
        }
    }

    if(n){
      options['currentTime'] = n
    }
    self.player.load(media, options, function(err, status) {
        self.playing = true;
        self.timePosition = options['currentTime'];
        self.startedTime = process.hrtime()[0];
        if(callback){
            callback(err,status)
        }
    });

}

Device.prototype.seek = function(seconds, callback){
    var self = this

    self.timePosition += process.hrtime()[0] - self.startedTime
    var newCurrentTime = self.timePosition + seconds

    self.player.seek(newCurrentTime, function(){
        self.startedTime = process.hrtime()[0];
        self.timePosition = newCurrentTime
        callback()
    })

}

Device.prototype.pause = function(callback){
    var self = this

    self.playing = false
    self.timePosition += process.hrtime()[0] - self.startedTime
    self.player.pause(callback)
}

Device.prototype.unpause = function(callback){
    var self = this
    self.playing = true
    self.startedTime = process.hrtime()[0];
    self.player.play(callback)
}

Device.prototype.stop = function(callback){
    var self = this
    self.playing = false
    self.player.stop(callback)
}
