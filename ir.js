var util = require('util');
var events = require('events');
var EventEmitter = require("events").EventEmitter;
var eventEmitter = new EventEmitter();
exports = module.exports = IRReceive;
var self = null;

//lirc
var lirc_node = require('lirc_node');
lirc_node.init();

function IRReceive() {
  console.log("constructor - IRReceive");
  this.callback = null;
}

util.inherits(IRReceive, EventEmitter);

IRReceive.prototype.init = function () {
  this.on('done', function () {
    console.log('done.');
  });
}

IRReceive.prototype.addListener = function (key, callback) {
  console.log("addListener...");
  self = this;
  
  function parameterError() {
    console.error("ir: IRReceive#addListener: bad parameters");
    throw new Error('ir: IRReceive#addListener: bad parameters. Please use addListener([key,[ remote,]] callback[, throttle]);');
  }

  //console.log(key);
  if (!callback) {
    parameterError();
  }

  //var retVal = { value: "Sepp Forcher" };
  //console.log(retVal.value);
  //callback(retVal);
  
  this.callback = callback;
  this.emit("done");
  //this._sendEvent();
  this._addListener(key);
  //_testFunction(this);
  //setTimeout(this._sendEvent(), 1000);
};

// IRReceive.prototype.startIt = function() {
//   var retVal = { value: "Sepp Forcher" };
//   this.callback(retVal);
// };

IRReceive.prototype._sendEvent = function() {
   var retVal = { value: "Sepp Forcher" };
   this.callback(retVal);   
}

//Test every second call callback
var _testFunction = function (app) {
  //console.log("_testFunction");
  app._sendEvent();
  setTimeout(_testFunction, 1000, app);
};

IRReceive.prototype._addListener = function(key) {
	lirc_node.addListener(key, 'apple', function(data) {
	  //console.log("Received IR keypress '"+key+"' from remote 'apple'");
	  // data also has `code` and `repeat` properties from the output of `irw`
	  // The final argument after this callback is a throttle allowing you to 
	  // specify to only execute this callback once every x milliseconds.
	  //self._sendEvent();
	  var retVal = { value: "Sepp Forcher", key: key };
      self.callback(retVal);  
	}, 100);
};
//TODO - enable (!)
// var listenerId = lirc_node.addListener(function(data) {
//   console.log("Received IR keypress '" + data.key + "'' from remote '" + data.remote +"'");
// });

// var sepp = function (app)
// {
//   console.log (app);
//   app.test();
//   setTimeout(sepp, 1000, app);
// }
// setTimeout(sepp, 1000, this);

//var timer = setInterval(this._sendEvent, 1*1000);

// var nInterval = setInterval(function(app) {
//     //this._sendEvent();
//     console.log("11111");
//     this.emit
// }, 1*1000);


/*****************************************************************************************************

// Listening for commands
var listenerId = lirc_node.addListener(function(data) {
  console.log("Received IR keypress '" + data.key + "'' from remote '" + data.remote +"'");
});

lirc_node.addListener('KEY_UP', 'remote1', function(data) {
  console.log("Received IR keypress 'KEY_UP' from remote 'remote1'");
  // data also has `code` and `repeat` properties from the output of `irw`
  // The final argument after this callback is a throttle allowing you to 
  // specify to only execute this callback once every x milliseconds.
}, 400);

=======
var util = require('util');
var events = require('events');
var EventEmitter = require("events").EventEmitter;
var eventEmitter = new EventEmitter();
exports = module.exports = IRReceive;
var self = null;

//lirc
var lirc_node = require('lirc_node');
lirc_node.init();

function IRReceive() {
  console.log("constructor");
  this.callback = null;
}

util.inherits(IRReceive, EventEmitter);

IRReceive.prototype.init = function () {
  this.on('done', function () {
    console.log('done.');
  });
}

IRReceive.prototype.addListener = function (key, callback) {
  console.log("addListener...");
  self = this;
  
  function parameterError() {
    console.error("ir: IRReceive#addListener: bad parameters");
    throw new Error('ir: IRReceive#addListener: bad parameters. Please use addListener([key,[ remote,]] callback[, throttle]);');
  }

  //console.log(key);
  if (!callback) {
    parameterError();
  }

  //var retVal = { value: "Sepp Forcher" };
  //console.log(retVal.value);
  //callback(retVal);
  
  this.callback = callback;
  this.emit("done");
  //this._sendEvent();
  this._addListener(key);
  //_testFunction(this);
  //setTimeout(this._sendEvent(), 1000);
};

// IRReceive.prototype.startIt = function() {
//   var retVal = { value: "Sepp Forcher" };
//   this.callback(retVal);
// };

IRReceive.prototype._sendEvent = function() {
   var retVal = { value: "Sepp Forcher" };
   this.callback(retVal);   
}

//Test every second call callback
var _testFunction = function (app) {
  //console.log("_testFunction");
  app._sendEvent();
  setTimeout(_testFunction, 1000, app);
};

IRReceive.prototype._addListener = function(key) {
	lirc_node.addListener(key, 'apple', function(data) {
	  //console.log("Received IR keypress '"+key+"' from remote 'apple'");
	  // data also has `code` and `repeat` properties from the output of `irw`
	  // The final argument after this callback is a throttle allowing you to 
	  // specify to only execute this callback once every x milliseconds.
	  //self._sendEvent();
	  var retVal = { value: "Sepp Forcher", key: key };
      self.callback(retVal);  
	}, 100);
};
//TODO - enable (!)
// var listenerId = lirc_node.addListener(function(data) {
//   console.log("Received IR keypress '" + data.key + "'' from remote '" + data.remote +"'");
// });

// var sepp = function (app)
// {
//   console.log (app);
//   app.test();
//   setTimeout(sepp, 1000, app);
// }
// setTimeout(sepp, 1000, this);

//var timer = setInterval(this._sendEvent, 1*1000);

// var nInterval = setInterval(function(app) {
//     //this._sendEvent();
//     console.log("11111");
//     this.emit
// }, 1*1000);


/*****************************************************************************************************

// Listening for commands
var listenerId = lirc_node.addListener(function(data) {
  console.log("Received IR keypress '" + data.key + "'' from remote '" + data.remote +"'");
});

lirc_node.addListener('KEY_UP', 'remote1', function(data) {
  console.log("Received IR keypress 'KEY_UP' from remote 'remote1'");
  // data also has `code` and `repeat` properties from the output of `irw`
  // The final argument after this callback is a throttle allowing you to 
  // specify to only execute this callback once every x milliseconds.
}, 400);

*****************************************************************************************************/