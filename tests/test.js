chromecast = require('../')

var chromecaster = new chromecast.Browser()

chromecaster.on('onDevice', function(device){
  console.log(device)
  device.play('http://192.168.1.100:56502/')
})
