chromecastjs = require('../')

var browser = new chromecastjs.Browser()

var subtitles = {
    url: "https://raw.githubusercontent.com/googlecast/CastClosedCaptioning-chrome/master/captions_styled.vtt",
    name: "English",
    language: "en-US"
}

var cover = {
    title: "Big Buck Bunny",
    url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg'
}

browser.on('deviceOn', function(device){
  device.connect()
  device.on('connected', function(){

    // Starting to play Big Buck Bunny (made in Blender) exactly in the first minute.
    device.play('http://commondatastorage.googleapis.com/gtv-videos-bucket/big_buck_bunny_1080p.mp4', 60, subtitles, cover, function(){
        console.log('Playing in your chromecast!')
    });

    setTimeout(function(){
        device.pause(function(){
            console.log('Paused!')
        });
    }, 30000);

    setTimeout(function(){
        device.unpause(function(){
            console.log('unpaused!')
        });
    }, 40000);

    setTimeout(function(){
        device.seek(30,function(){
            console.log('seeking forward!')
        });
    }, 50000);

    setTimeout(function(){
        device.pause(function(){
            console.log('Paused!')
        });
    }, 70000);

    setTimeout(function(){
        device.seek(30,function(){
            console.log('seeking forward!')
        });
    }, 80000);

    setTimeout(function(){
        device.seek(30,function(){
            console.log('seeking forward!')
        });
    }, 85000);

    setTimeout(function(){
        device.unpause(function(){
            console.log('unpaused!')
        });
    }, 90000);


    setTimeout(function(){
        device.seek(-30,function(){
            console.log('seeking backwards!')
        });
    }, 100000);


    setTimeout(function(){
        device.stop(function(){
            console.log('Stoped!')
        });
    }, 200000);

  })
})
