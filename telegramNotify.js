var request = require('request');
var http = require('http');
var fs = require('fs');

exports = module.exports = TelegramNotify;
var self = null;

//constructor
function TelegramNotify() {
    console.log("constructor - TelegramNotify");
    self = this;
}

//config
var config = require('./config');

TelegramNotify.prototype.notify = function (message) {
    //console.log("message: " + message);
    // var post_data = querystring.stringify({
    //     'value1': 'Sepp Forcher'
    // });
    var post_data = {
        chat_id: config.TelegramChatId,
        text: message
    };
    //console.log(post_data);
    var url = "https://api.telegram.org/bot" + config.TelegramBotApiToken + "/sendMessage";
    request({
        url: url,
        method: "POST",
        json: post_data
    });
};