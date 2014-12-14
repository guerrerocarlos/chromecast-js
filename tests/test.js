/**
 * Test for all device calls.
 * Recommended to be run with DEBUG=castv2 to see underlying protocol communication.
 */

chromecastjs = require('../');

var browser = new chromecastjs.Browser();

var media = {
    url : 'http://commondatastorage.googleapis.com/gtv-videos-bucket/big_buck_bunny_1080p.mp4',
    subtitles: [{
        language: 'en-US',
        url: 'http://carlosguerrero.com/captions_styled.vtt',
        name: 'English'
    },
    {
        language: 'es-ES',
        url: 'http://carlosguerrero.com/captions_styled_es.vtt',
        name: 'Spanish'
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
};

/*
var media = {
    //"url":"http://192.168.0.100:4009/5%20-%203%20-%20Lecture%205.3%20-%20Opportunity%20identification%20(29-59).mp4",
    //url : 'http://commondatastorage.googleapis.com/gtv-videos-bucket/big_buck_bunny_1080p.mp4',
    url : "http://192.168.0.100:8899/6.11.mp4",
    "subtitles":[{
        "language":"en-US",
        //"url":"http://192.168.0.100:9999/subtitles.vtt",

        url: 'http://carlosguerrero.com/captions_styled.vtt',
        "name":"Spanish"
    }]
};

var media = {"url":"http://192.168.0.100:8899/6.11.mp4","subtitles":[{"language":"en-US","url":"http://carlosguerrero.com/captions_styled.vtt","name":"Subtitle"}]};
*/

browser.on('deviceOn', function(device){
  device.connect();
  device.on('connected', function(){

    // Starting to play Big Buck Bunny (made in Blender) exactly in the first minute without subtitles or cover.
    //device.play('http://commondatastorage.googleapis.com/gtv-videos-bucket/big_buck_bunny_1080p.mp4', 60, function(){
    //    console.log('Playing in your chromecast!')
    //});

    // Starting to play Big Buck Bunny (made in Blender) exactly in the first minute with example subtitles and cover.
    device.play(media, 0, function(){
        console.log('Playing in your chromecast!');

        setTimeout(function(){
            console.log('lowering volume');
            device.setVolume( 0.25, function( err, newVol){
                if(err) console.log("there was an error changing the volume.");
                else console.log('Volume Changed to: '+newVol.level);
            });
        }, 15000);
        
        setTimeout(function() {
            console.log('muting audio');
            device.setVolumeMuted(true, function(err, newVol) {
                if(err) console.log("there was an error muting the volume.");
                else console.log('newVol', newVol);
            });
        }, 18000);
        
        setTimeout(function() {
            console.log('unmuting audio');
            device.setVolumeMuted(false, function(err, newVol) {
                if(err) console.log("there was an error muting the volume.");
                else console.log('newVol', newVol);
            });
        }, 19500);

        setTimeout(function(){
            console.log('subtitles off!');
            device.subtitlesOff(function(err,status){
                if(err) console.log("error setting subtitles off...");
                else console.log("subtitles removed.");
            });
        }, 20000);

        setTimeout(function(){
            console.log("restoring audio!");
            device.setVolume( 0.5, function( err, newVol){
                if(err) console.log("there was an error changing the volume.");
                else console.log('Volume Changed to: '+newVol.level);
            });
        }, 21000);


        setTimeout(function(){
            console.log('subtitles on!');
            device.changeSubtitles(1, function(err, status){
                if(err) console.log("error restoring subtitles...");
                else console.log("subtitles restored.");
            });
        }, 25000);

        setTimeout(function(){
            console.log('subtitles on!');
            device.changeSubtitles(1, function(err, status){
                if(err) console.log("error restoring subtitles...");
                else console.log("subtitles restored.");
            });
        }, 25000);

        setTimeout(function(){
            device.pause(function(){
                console.log('Paused!');
            });
        }, 30000);

        setTimeout(function(){
            device.unpause(function(){
                console.log('unpaused!');
            });
        }, 40000);

        setTimeout(function(){
            console.log('I ment English subtitles!');
            device.changeSubtitles(0, function(err, status){
                if(err) console.log("error restoring subtitles...");
                else console.log("English subtitles restored.");
            });
        }, 45000);

        setTimeout(function(){
            console.log('Increasing subtitles size...');
            device.changeSubtitlesSize(10, function(err, status){
                if(err) console.log("error increasing subtitles size...");
                else console.log("subtitles size increased.");
            });
        }, 46000);

        setTimeout(function(){
            device.seek(30,function(){
                console.log('seeking forward!');
            });
        }, 50000);

        setTimeout(function(){
            console.log('decreasing subtitles size...');
            device.changeSubtitlesSize(1, function(err, status){
                if(err) console.log("error...");
                else console.log("subtitles size decreased.");
            });
        }, 60000);

        setTimeout(function(){
            device.pause(function(){
                console.log('Paused!');
            });
        }, 70000);

        setTimeout(function(){
            device.seek(30,function(){
                console.log('seeking forward!');
            });
        }, 80000);

        setTimeout(function(){
            device.seek(30,function(){
                console.log('seeking forward!');
            });
        }, 85000);

        setTimeout(function(){
            device.unpause(function(){
                console.log('unpaused!');
            });
        }, 90000);


        setTimeout(function(){
            device.seek(-30,function(){
                console.log('seeking backwards!');
            });
        }, 100000);

        setTimeout(function(){
            device.seekTo(0,function(){
                console.log('seeking back to start!');
            });
        }, 110000);
        
        setTimeout(function(){
            device.seekTo(300,function(){
                console.log('seeking to exactly 5 mins!');
            });
        }, 120000);

        setTimeout(function(){
            device.getStatus(function(status) {
                device.seekTo( status.media.duration - 100 ,function(){
                    console.log('seeking to 100 sec before end!');
                });
            });
        }, 130000);
        
        setTimeout(function(){
            device.stop(function(){
                console.log('Stoped!');
            });
        }, 150000);
        
        //Connection still alive and heartbeats being sent between these two.
        
        setTimeout(function(){
            device.close(function(){
                console.log('Closed!');
            });
        }, 170000);

    });
  });
});