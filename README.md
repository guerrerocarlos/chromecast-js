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

    device.play('http://commondatastorage.googleapis.com/gtv-videos-bucket/big_buck_bunny_1080p.mp4', 60, function(){
        console.log('Playing in your chromecast!')
    });

    setTimeout(function(){
        device.pause(function(){
            console.log('Paused!')
        });
    }, 30000);

    setTimeout(function(){
        device.stop(function(){
            console.log('Stoped!')
        });
    }, 40000);

  })
})

```

## Subtitles and Cover

To include subtitles and a cover image with the media title, use an Object instead of a string in the *play method*:

``` javascript
chromecastjs = require('chromecast-js')

var browser = new chromecastjs.Browser()

var media = {
    url : 'http://commondatastorage.googleapis.com/gtv-videos-bucket/big_buck_bunny_1080p.mp4',
    subtitles: [{
        language: 'en-US',
        url: "https://raw.githubusercontent.com/googlecast/CastClosedCaptioning-chrome/master/captions_styled.vtt",
        name: "English",
    }],
    cover: {
        title: 'Big Bug Bunny',
        url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg'
    }
}

browser.on('deviceOn', function(device){
  device.connect()
  device.on('connected', function(){

    device.play(media, 0, function(){
        console.log('Playing in your chromecast!')
    });

    setTimeout(function(){
        device.pause(function(){
            console.log('Paused!')
        });
    }, 30000);

    setTimeout(function(){
        device.stop(function(){
            console.log('Stoped!')
        });
    }, 40000);

    // see tests/test.js for more functions like seek and unpause.

  })
})

```

