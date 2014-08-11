chromecastjs = require('../')

var browser = new chromecastjs.Browser()

browser.on('deviceOn', function(device){
  device.connect()
  device.on('connected', function(){
    device.play('http://commondatastorage.googleapis.com/gtv-videos-bucket/big_buck_bunny_1080p.mp4', 60, function(){
        console.log('Playing in your chromecast!')
    })
  })
})
