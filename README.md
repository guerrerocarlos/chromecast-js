chromecast-js
=================

chromecast-js is a javascript client library for googlecast's remote playback protocol that uses DefaultMediaReceiver to play any (compatible) content in the Chromecast.

## Installation

From npm:

	npm intall chromecast-js 

## Usage

``` javascript
chromecastjs = require('chromecast-js')

var browser = new chromecastjs.Browser()

browser.on('deviceOn', function(device){
  device.connect()
  device.on('connected', function(){
    device.play('http://commondatastorage.googleapis.com/gtv-videos-bucket/big_buck_bunny_1080p.mp4', 0, function(){
        console.log('Playing in your chromecast!')
    })
  })
})
```
