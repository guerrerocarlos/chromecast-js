chromecastjs = require('..');

var browser = new chromecastjs.Browser();

var devices = [];

browser.on('deviceOn', function(device) {
  if (devices.indexOf(device.host) >= 0) {
    return console.log('already connecting to', device.host);
  }
  devices.push(device.host);
  device.connect();
  device.on('connected', function(){
    console.log('connected');
    device.play('http://commondatastorage.googleapis.com/gtv-videos-bucket/big_buck_bunny_1080p.mp4', 60, function(){
      console.log('Playing in your chromecast "%s"!', device.config.name);
    });

    setTimeout(function(){
        device.pause(function(){
            console.log('Paused!');
        });
    }, 30000);

    setTimeout(function(){
        device.stop(function(){
            console.log('Stoped!');
        });
    }, 40000);

  });
});
