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

console.log('Adding new id to DefaultMediaReceiver')
console.log(DefaultMediaReceiver)
//DefaultMediaReceiver.APP_ID = 'E64D12F5'

Device.prototype.connect = function(host){
    var self = this
    self.client.connect(host, function() {
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
    self.connect(self.host)

    /*
    self.client.connect(host, function() {
        debug('connected, launching app ...');
        client.launch(DefaultMediaReceiver, function(err, player) {
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

    client.on('error', function(err) {
        console.log('Error: %s', err.message);
        client.close();
    });
    */

}


Device.prototype.play = function(resource, n, callback){
    var self = this
      var media = {
        // Here you can plug an URL to any mp4, webm, mp3 or jpg file with the proper contentType.
        contentId: resource,
        contentType: 'video/mp4'
      };

      self.player.load(media, { autoplay: true }, function(err, status) {
          self.playing = true
          console.log("calling callback")
          callback(err,status)
      });
}


