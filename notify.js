var request = require('request');
var http = require('http');
var fs = require('fs');

exports = module.exports = MakerNotify;
var self = null;

//constructor
function MakerNotify() {
    console.log("constructor - MakerNotify");
    self = this;
}

//config
var config = require('./config');

MakerNotify.prototype.notify = function (message) {
    //console.log("message: " + message);
    // var post_data = querystring.stringify({
    //     'value1': 'Sepp Forcher'
    // });
    var post_data = {
        value1: message
    };
    //console.log(post_data);
    var url = "https://maker.ifttt.com/trigger/" + config.MakerServiceName + "/with/key/" + config.MakerChannelKey ;
    request({
        url: url,
        method: "POST",
        json: post_data
    });
};