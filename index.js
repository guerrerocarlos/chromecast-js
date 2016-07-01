'use strict';

var events = require('events');
var http = require('http');
var util = require('util');

var Device = require('./device').Device;
var SsdpClient = require('node-ssdp').Client;

function Browser(options) {
  events.EventEmitter.call(this);
  this.init(options);
}

Browser.prototype.update = function(device) {
  var devConfig = {addresses: device.addresses, name: device.name};
  this.device = new Device(devConfig);
  this.emit('deviceOn', this.device);
};

Browser.prototype.init = function() {
  var _this = this;

  var ssdpBrowser = new SsdpClient();
  ssdpBrowser.on('response', function(headers, statusCode, rinfo) {
    if (statusCode !== 200 || !headers.LOCATION) {
      return;
    }
    http.get(headers.LOCATION, function(res) {
      var body = '';
      res.on('data', function(chunk) {
        body += chunk;
      });
      res.on('end', function() {
        var match = body.match(/<friendlyName>(.+?)<\/friendlyName>/);
        if (!match || match.length !== 2) {
          return;
        }
        _this.update({addresses: [rinfo.address], name: match[1]});
      });
    });
  });
  ssdpBrowser.search('urn:dial-multiscreen-org:service:dial:1');
};

util.inherits(Browser, events.EventEmitter);

exports.Browser = Browser;
exports.Device = Device;
