var util = require( 'util' );
var events = require( 'events' );
var mdns = require('mdns-js');
var Device = require('./device').Device;
var debug = require('debug')('chromecast-js');

var Browser = function( options ) {
  events.EventEmitter.call( this );
  this.init( options );
};

util.inherits( Browser, events.EventEmitter );

exports.Browser = Browser;


Browser.prototype.init = function( options ) {
  var self = this;

  var mdnsBrowser = new mdns.createBrowser(mdns.tcp("googlecast"));

  mdnsBrowser.on('ready', function () {
      mdnsBrowser.discover();
  });

  mdnsBrowser.on('update', function (data) {
    var dev_config = {addresses: data.addresses, name: data.host};
    var device = new Device(dev_config);
    self.emit('deviceOn', device);
  });
};