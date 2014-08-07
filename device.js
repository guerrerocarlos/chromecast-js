var Client                = require('castv2-client').Client;
var DefaultMediaReceiver  = require('castv2-client').DefaultMediaReceiver;
var events = require('events')
var util = require('util')

var Device = function(options){
    events.EventEmitter.call(this);
    var self = this;
    self.config = options
    this.init()
}

exports.Device = Device
util.inherits( Device, events.EventEmitter );

Device.prototype.init = function(){
    var self = this
    var host = self.config.addresses[0]
    var client = new Client();
    client.connect(host, function() {
        console.log('connected, launching app ...');
        client.launch(DefaultMediaReceiver, function(err, player) {
            if(err){
                console.log(err)
            }else{
                self.player = player
                self.emit('connected')
            }

            player.on('status', function(status) {
                if(status){
                    console.log('status broadcast playerState=%s',status.playerState);
                }else{
                    console.log('-')
                }
            });

        });
    });

    client.on('error', function(err) {
        console.log('Error: %s', err.message);
        client.close();
    });


}


Device.prototype.play = function(resource){
    var self = this
      var media = {
        // Here you can plug an URL to any mp4, webm, mp3 or jpg file with the proper contentType.
        contentId: resource,
        contentType: 'video/mp4'
      };

      self.player.load(media, { autoplay: true }, function(err, status) {
      });
  return !0;
}


