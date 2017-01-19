// ========================
// netatmo ================
// ========================
//config
var config = require('./config');
var schedule = require('node-schedule');
var netatmo = require('netatmo');

var auth = {
    "client_id": "51b0dda8197759c41e00004a",
    "client_secret": "ie5f4dSDpQ1gUgQ8ZxNrqb5jMV",
    "username": config.username,
    "password": config.password,
};
var api = new netatmo(auth);
var self = null;

// =======================
// getMeasures ======
// =======================
var WData = module.exports = {
    // temp: "",
	// co2: "",
    // getData: function() {
	// 	console.log("getData...");
    //     WData.temp = "12,13";
	// 	WData.co2 = "333";
    //  },
	//  getMeasureTemp2 : function (callback){
	// 	callback("1234");
	//  },
	 getMeasuresIn : function (callback) {
		_options = optionsIndoor;		
		api.getMeasure(_options, function (err, measure) {
        // When the "error" event is emitted, this is called
        //console.error('Netatmo threw an error: ' + error);
        //console.log(measure[0].value);
        var time = measure[0].beg_time;
        var temp = measure[0].value[0][0];
		var co2 = measure[0].value[0][1];
		var humidity = measure[0].value[0][2];
		var pressure = measure[0].value[0][3];
		//console.log("_co2: %s", _co2);
		// logger.info(measure[0].value);
        // console.log("Temp: %s", temp);
        callback(time, temp, co2, humidity, pressure); // this will "return" your value to the original caller
		});
	 },
	 getMeasuresOut : function (callback) {
		_options = optionsOutdoor;		
		api.getMeasure(_options, function (err, measure) {
        // When the "error" event is emitted, this is called
        //console.error('Netatmo threw an error: ' + error);
        // console.log(measure[0].value);
        var time = measure[0].beg_time;
        var temp = measure[0].value[0][0];
		var humidity = measure[0].value[0][1];				
        callback(time, temp, humidity); 
		});
	 },
     init : function ()
     {
        self = this;
        this.api = new netatmo(auth);
        console.log ("init netatmo - OK");
     }
	 //,
    // remove: function() {
        // Counter.count += 10;
    // }
}


api.on("error", function (error) {
    // When the "error" event is emitted, this is called
    console.error('Netatmo threw an error: ' + error);
	logger.error('Netatmo threw an error: ' + error);
});
api.on("warning", function (error) {
    // When the "warning" event is emitted, this is called
    console.log('Netatmo threw a warning: ' + error);
	logger.warn('Netatmo threw an warning: ' + error);
});

var optionsIndoor = {
    device_id: '70:ee:50:00:fc:36', //indoor70:ee:50:00:fc:36
    scale: 'max',
    date_end: 'last',
    module_id: '70:ee:50:00:fc:36',//'NAMain',
    type: ['Temperature', 'CO2', 'Humidity', 'Pressure', 'Noise'],
};
var optionsOutdoor = {
    device_id: '70:ee:50:00:fc:36', //indoor70:ee:50:00:fc:36
    scale: 'max',
    date_end: 'last',
    module_id: '02:00:00:00:f9:28',//'NAModule1',
    type: ['Temperature','Humidity'],
};


// exports.getData = function() {
    // return 'Hello!';
// }

//re-init at midnight
schedule.scheduleJob('50 23 * * *', function () {
    self.init();
});
