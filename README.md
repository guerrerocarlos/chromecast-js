chromecast-js
=================

chromecast-js is a javascript client library for googlecast's remote playback protocol that uses DefaultMediaReceiver to play any (compatible) content in the Chromecast, it works by wrapping the [node-castv2-client](https://github.com/thibauts/node-castv2-client) module.

## Installation

From npm:
```bash
npm install chromecast-js --save
```

## Usage

```js
const chromecastjs = require('chromecast-js')

const mediaUrl = 'http://commondatastorage.googleapis.com/gtv-videos-bucket/big_buck_bunny_1080p.mp4';
const browser = new chromecastjs.Browser()

browser.on('deviceOn', device => {
  device.connect()
  device.on('connected', () => {

    device.play(mediaUrl, 60, () =>{
        console.log('Playing in your chromecast!')
    });

    setTimeout(() => {
        device.pause(() => {
            console.log('Paused!')
        });
    }, 30000);

    setTimeout(() => {
        device.stop(() => {
            console.log('Stoped!')
        });
    }, 40000);
  })
})

```

## Subtitles and Cover

To include subtitles and a cover image with the media title, use an Object instead of a string in the *play method*:

```js
const chromecastjs = require('../')

const browser = new chromecastjs.Browser()

const media = {
    url : 'http://commondatastorage.googleapis.com/gtv-videos-bucket/big_buck_bunny_1080p.mp4',
    subtitles: [{
        language: 'en-US',
        url: 'http://carlosguerrero.com/captions_styled.vtt',
        name: 'English',
    },
    {
        language: 'es-ES',
        url: 'http://carlosguerrero.com/captions_styled_es.vtt',
        name: 'Spanish',
    }
    ],
    cover: {
        title: 'Big Bug Bunny',
        url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg'
    },
    subtitles_style: { 
          backgroundColor: '#FFFFFFFF', // see http://dev.w3.org/csswg/css-color/#hex-notation
          foregroundColor: '#000FFFF', // see http://dev.w3.org/csswg/css-color/#hex-notation
          edgeType: 'DROP_SHADOW', // can be: "NONE", "OUTLINE", "DROP_SHADOW", "RAISED", "DEPRESSED"
          edgeColor: '#AA00FFFF', // see http://dev.w3.org/csswg/css-color/#hex-notation
          fontScale: 1.5, // transforms into "font-size: " + (fontScale*100) +"%"
          fontStyle: 'BOLD_ITALIC', // can be: "NORMAL", "BOLD", "BOLD_ITALIC", "ITALIC",
          fontFamily: 'Droid Sans',
          fontGenericFamily: 'CURSIVE', // can be: "SANS_SERIF", "MONOSPACED_SANS_SERIF", "SERIF", "MONOSPACED_SERIF", "CASUAL", "CURSIVE", "SMALL_CAPITALS",
          windowColor: '#AA00FFFF', // see http://dev.w3.org/csswg/css-color/#hex-notation
          windowRoundedCornerRadius: 10, // radius in px
          windowType: 'ROUNDED_CORNERS' // can be: "NONE", "NORMAL", "ROUNDED_CORNERS"
    }
}


browser.on('deviceOn', device => {
  device.connect()
  device.on('connected', () => {

    // Starting to play Big Buck Bunny (made in Blender) exactly in the first minute without subtitles or cover.
    //device.play('http://commondatastorage.googleapis.com/gtv-videos-bucket/big_buck_bunny_1080p.mp4', 60, () => {
    //    console.log('Playing in your chromecast!')
    //});

    // Starting to play Big Buck Bunny (made in Blender) exactly in the first minute with example subtitles and cover.
    device.play(media, 0, () => {
        console.log('Playing in your chromecast!')

        setTimeout(() => {
            console.log('subtitles off!')
            device.subtitlesOff((err,status) => {
                if(err) console.log("error setting subtitles off...")
                console.log("subtitles removed.")
            });
        }, 20000);

        setTimeout(() => {
            console.log('subtitles on!')
            device.changeSubtitles(1, (err, status) => {
                if(err) console.log("error restoring subtitles...")
                console.log("subtitles restored.")
            });
        }, 25000);

        setTimeout(() => {
            console.log('subtitles on!')
            device.changeSubtitles(1, (err, status) => {
                if(err) console.log("error restoring subtitles...")
                console.log("subtitles restored.")
            });
        }, 25000);

        setTimeout(() => {
            device.pause(() => {
                console.log('Paused!')
            });
        }, 30000);

        setTimeout(() => {
            device.unpause(() => {
                console.log('unpaused!')
            });
        }, 40000);

        setTimeout(() =>{
            console.log('I ment English subtitles!')
            device.changeSubtitles(0, (err, status) => {
                if(err) console.log("error restoring subtitles...")
                console.log("English subtitles restored.")
            });
        }, 45000);

        setTimeout(() => {
            console.log('Increasing subtitles size...')
            device.changeSubtitlesSize(10, function(err, status){
                if(err) console.log("error increasing subtitles size...")
                console.log("subtitles size increased.")
            });
        }, 46000);

        setTimeout(() => {
            device.seek(30,() => {
                console.log('seeking forward!')
            });
        }, 50000);

        setTimeout(() => {
            console.log('decreasing subtitles size...')
            device.changeSubtitlesSize(1, function(err, status){
                if(err) console.log("error...")
                console.log("subtitles size decreased.")
            });
        }, 60000);

        setTimeout(() => {
            device.pause(() => {
                console.log('Paused!')
            });
        }, 70000);

        setTimeout(() => {
            device.seek(30,() => {
                console.log('seeking forward!')
            });
        }, 80000);

        setTimeout(() => {
            device.seek(30,() => {
                console.log('seeking forward!')
            });
        }, 85000);

        setTimeout(() => {
            device.unpause(() => {
                console.log('unpaused!')
            });
        }, 90000);


        setTimeout(() => {
            device.seek(-30,() => {
                console.log('seeking backwards!')
            });
        }, 100000);


        setTimeout(() => {
            device.stop(() => {
                console.log('Stoped!')
            });
        }, 200000);
    })
  })
}
```

