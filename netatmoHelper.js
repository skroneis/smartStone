// ========================
// netatmo ================
// ========================
//config
var config = require('./config');
var schedule = require('node-schedule');
var netatmo = require('./netatmoLib');
var logger = require("./logger");
var moment = require('moment');

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
    getAccessToken: function (callback) {
        api.getAccessToken(function (access_token) {
            callback(access_token);
        });
    },
    clearAccessToken: function (callback) {
        api.clearAccessToken(auth, function (result) {
            callback(result);
        });
    },
    refreshAccessToken: function (callback) {
        api.refreshAccessToken(auth, function (result) {
            callback(result);
        });
    },
    getMeasuresIn: function (callback) {
        var _options = optionsIndoor;
        try {
            api.getMeasure(_options, function (err, measure) {
                // When the "error" event is emitted, this is called
                //console.error('Netatmo threw an error: ' + error);
                //console.log(measure[0].value);
                if (measure !== null && measure !== undefinded) {
                    if (measure[0] !== null && measure[0] !== undefinded) {
                        var time = measure[0].beg_time;
                        var temp = measure[0].value[0][0];
                        var co2 = measure[0].value[0][1];
                        var humidity = measure[0].value[0][2];
                        var pressure = measure[0].value[0][3];

                        callback(time, temp, co2, humidity, pressure); // this will "return" your value to the original caller
                    }
                }
                //console.log("_co2: %s", _co2);
                // logger.info(measure[0].value);
                // console.log("Temp: %s", temp);        
                callback(null, null, null, null, null); // this will "return" your value to the original caller
            });
        }
        catch (e) {
            console.log(e);
            return;
        }
    },
    getMeasuresOut: function (callback) {
        var _options = optionsOutdoor;
        try {
            api.getMeasure(_options, function (err, measure) {
                // When the "error" event is emitted, this is called
                //console.error('Netatmo threw an error: ' + error);
                // console.log(measure[0].value);
                if (measure !== null && measure !== undefinded) {
                    if (measure[0] !== null && measure[0] !== undefinded) {
                        var time = measure[0].beg_time;
                        var temp = measure[0].value[0][0];
                        var humidity = measure[0].value[0][1];
                        callback(time, temp, humidity);
                    }
                }
                callback(null, null, null);
            });
        }
        catch (e) {
            console.log(e);
            return;
        }
    },
    getStationData: function (callback) {
        var _options = optionsIndoor;
        api.getStationsData(_options, function (err, measure) {
            console.log(measure);
            console.log("----------------------------------");
            console.log(measure[0].modules[0].dashboard_data);
            console.log(measure[0].modules[0].dashboard_data.Temperature);
            console.log(measure[0].modules[0].dashboard_data.temp_trend);
            console.log(measure[0].modules[0].dashboard_data.Humidity);
            console.log(measure[0].modules[0].dashboard_data.min_temp);
            console.log(measure[0].modules[0].dashboard_data.max_temp);
            console.log(measure[0].modules[0].dashboard_data.date_min_temp);
            console.log(measure[0].modules[0].dashboard_data.date_max_temp);
            console.log("----------------------------------");
            console.log(measure[0].dashboard_data);
            console.log(measure[0].dashboard_data.Temperature);
            console.log(measure[0].dashboard_data.Humidity);
            console.log(measure[0].dashboard_data.min_temp);
            console.log(measure[0].dashboard_data.max_temp);
            console.log(measure[0].dashboard_data.date_min_temp);
            console.log(measure[0].dashboard_data.date_max_temp);
            console.log(measure[0].dashboard_data.CO2);
            console.log(measure[0].dashboard_data.Pressure);
            console.log(measure[0].dashboard_data.pressure_trend);
            console.log(measure[0].dashboard_data.temp_trend);
            console.log("----------------------------------");

            var ts = moment.utc(measure[0].dashboard_data.time_utc * 1000);
            console.log(ts.local().format('DD.MM.YYYY HH:mm:ss'));

            var stationData = { IN: {}, OUT: {} };

            stationData.IN.Temp = measure[0].dashboard_data.Temperature;
            //save
            callback(stationData);
        });
    },
    init: function () {
        self = this;
        console.log("init netatmo - OK");
        //this.api = new netatmo(auth);
        // var auth = api.authenticate(auth, function (err, infos) {
        //     if (err)
        //         console.log(err);
        //     if (infos)
        //         console.log(infos);
        // })
        // console.log (auth);
        // api.authenticate(auth);
    },
    reInit: function (callback) {
        api = null;
        api = new netatmo(auth);
        console.log("ReInit (netatmo) - OK");
        callback("OK");
    }
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
    type: ['Temperature', 'CO2', 'Humidity', 'Pressure', 'Noise', 'temp_trend'],
};
var optionsOutdoor = {
    device_id: '70:ee:50:00:fc:36', //indoor70:ee:50:00:fc:36
    scale: 'max',
    date_end: 'last',
    module_id: '02:00:00:00:f9:28',//'NAModule1',
    type: ['Temperature', 'Humidity'],
};


// exports.getData = function() {
// return 'Hello!';
// }

//re-init
schedule.scheduleJob('50 0 * * *', function () {
    console.log("scheduled refresh access token");
    WData.refreshAccessToken(function (result) {
        console.log(result);
    });
});
