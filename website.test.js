// =======================
// WEB-Pages ================
// =======================
var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var http = require('http').Server(app);
// var request = require('request');
var httpget = require('http');

// =======================
// Google spreadsheet ====
// =======================
var Spreadsheet = require("./spreadsheet.js");
var spreadsheet = new Spreadsheet();

// =======================
// configuration =========
// =======================
var port = process.env.PORT || 8001;
// var actuals = { IN: { temp: 33.10, maturity: 8 }, OUT: {}, KRO: { temp: 35.85 }, CALC: {}, page: 1 };
actuals = {
    IN: {
        time: "2017-09-06T12:21:46.000Z", temp: 24.2, co2: 667, humidity: 56, "pressure": 1012.9, "maturity": 8
    },
    "OUT": {
        "time": "2017-09-06T12:21:18.000Z", "temp": 25.5, "humidity": 67, "maturity": 8
    },
    "KRO": {
        "dateTime": "2017-09-06T14:31:00", "temp": "23.14", "wiGe": "6.47", "wiRi": "244.78",
        "wiRiStr": "SW", "wiRiWiGeMax": "", "reference": "2.21", "nodeWiGeMax": 32.59, "nodeWiGeWiRiMax": 246.88,
        "nodeWiGeWiRiMaxStr": "SW", "lengthWiGe": 720, "lengthWiRi": 720, "lengthTimestamps": 720, "wiGeMaxAt": "2017-09-06T14:11:35+0200",
        "nodeWiGeMin": 1.16, "nodeWiGeWiRiMin": 209.44, "nodeWiGeWiRiMinStr": "SW", "wiGeMinAt": "2017-09-06T14:25:45+0200", "wiGeMax": "222.63"
    },
    "CALC": {
        "maxTempIn": 24.2, "minTempIn": 22.6, "maxTempOut": 23.2, "minTempOut": 14.52,
        "maxTempOutAt": "2017-09-06T14:06:26+0200", "minTempOutAt": "2017-09-06T06:51:36+0200", "maxTempInAt": "2017-09-06T14:31:56+0200",
        "minTempInAt": "2017-09-06T07:59:55+0200"
    },
    "page": 1
}


//app.use(express.compress());
app.use('/', express.static(__dirname + '/public'));
//4 post
app.use(bodyParser.json())

app.get('/rpi/', function (req, res) {
    res.sendFile(__dirname + '/public/index_Rpi.html');
});
app.get('/img/', function (req, res) {
    res.sendFile(__dirname + '/public/img.html');
});


// =======================
// start the server ======
// =======================
var server = http.listen(port, function () {
    var host = server.address().address
    var port = server.address().port
    console.log('listening on %s:%s', host, port);
    // console.log(config.secret);
});


function errorHandler(err, req, res, next) {
    var code = err.code;
    var message = err.message;
    res.writeHead(code, message, { 'content-type': 'text/plain' });
    res.end(message);
}


//init values (actual)
var modules = module.exports = {
    init: function (values) {
        //console.log("init (http)...");
        //console.log(values.temp);
        actuals = values;
    }
};

// =======================
// REST-API ================
// =======================
app.use(function (req, res, next) {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    // console.log('Client IP:', ip);
    next();
});

// API ROUTES -------------------
var apiRoutes = express.Router();

//-----------------------------------------------------------------------------------------------------------------------------
//Reset NETATMO
apiRoutes.get('/resetNetatmo', function (req, res, next) {
    try {
        netatmo.reInit(function (result) {
            console.log(result);
            res.json({ OK: true, info: result });
        });
        res.json({ OK: false });
        // netatmo.refreshAccessToken(function (result) {
        //     console.log (result);
        //     res.json({ OK: true, info: result });
        // });
        // res.json({ OK: false });
    }
    catch (e) {
        console.log(e);
        return next(e);
    }
});

//getData
apiRoutes.get('/getData', function (req, res, next) {
    //if(err) res.send(err);
    try {
        res.json(actuals);
    }
    catch (e) {
        console.log(e);
        return next(e);
    }
});

//getImage
apiRoutes.get('/getBingImage', function (req, res, next) {
    try {
        var url = 'http://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=de-AT';
        var result = { img: null };
        var _res = res;
        httpget.get(url, function (res) {
            var body = '';
            res.on('data', function (chunk) {
                body += chunk;
            });
            res.on('end', function () {
                var response = JSON.parse(body);
                // console.log(response);
                var resultUrl = "http://www.bing.com" + response.images[0].url;
                console.log(resultUrl);
                var result = { img: resultUrl };
                _res.json(result);
            });
        }).on('error', function (e) {
            console.log("Got an error: ", e);
        });
    }
    catch (e) {
        console.log(e);
        return next(e);
    }
});

//getChromecastImage
apiRoutes.get('/getChromecastImage', function (req, res, next) {
    try {
        var url = 'http://clients3.google.com/cast/chromecast/home';
        var result = { img: null };
        var _res = res;
        httpget.get(url, function (res) {
            var body = '';
            res.on('data', function (chunk) {
                body += chunk;
            });
            res.on('end', function () {
                //  var response = JSON.parse(body);                
                console.log(body);
                // var result = {img: resultUrl};
                // _res.json(result);
            });
        }).on('error', function (e) {
            console.log("Got an error: ", e);
        });
    }
    catch (e) {
        console.log(e);
        return next(e);
    }
});

//Test data for amcharts
apiRoutes.get('/getChartData', function (req, res, next) {
    //if(err) res.send(err);
    try {
        var json = [
            { "time": "2017-01-16 12:14:00", "temperature": 15.3 },
            { "time": "2017-01-16 12:15:00", "temperature": 15.4 },
            { "time": "2017-01-16 12:16:00", "temperature": 15.5 },
            { "time": "2017-01-16 12:17:00", "temperature": 15.6 },
            { "time": "2017-01-16 12:18:00", "temperature": 15.7 },
            { "time": "2017-01-16 12:19:00", "temperature": 15.5 },
            { "time": "2017-01-16 12:20:00", "temperature": 0.1 },
            { "time": "2017-01-16 12:21:00", "temperature": -0.5 },
            { "time": "2017-01-16 12:22:00", "temperature": -0.6 },
            { "time": "2017-01-16 12:23:00", "temperature": -6.1 },
        ];
        res.json(json);
    }
    catch (e) {
        console.log(e);
        return next(e);
    }
});
//TEST
apiRoutes.get('/test', function (req, res, next) {
    try {
        res.json({ temp: actuals.KRO.temp, success: true });
    }
    catch (e) {
        console.log(e);
        return next(e);
    }
});

//Reset
apiRoutes.get('/reset', function (req, res, next) {
    try {
        dataManager.ResetMaxMinValues();
        res.json({ OK: true });
    }
    catch (e) {
        console.log(e);
        return next(e);
    }
});

apiRoutes.route('/setValue')
    //(accessed at POST http://localhost:8001/api/setValue)
    .post(function (req, res) {
        console.log("---------------------------------------body---------------------------");
        console.log(req.body.pin);
        console.log(req.body.value);
        res.json({ success: true });
    });


//LED
//website
apiRoutes.get('/getStatus/:id', function (req, res, next) {
    console.log(req.params.id);
    var p = "pin_" + req.params.id;
    res.json({ value: 1 });
    // gpioStone.read(req.params.id, function (err, pin_value) {
    //     res.json({ pin: pin_value });;
    // });
});

// apiRoutes.get('/writeRow', function (req, res, next) {    
//     res.json({ value: 1 });    
// });

apiRoutes.route('/writeRow')
    //(accessed at POST http://localhost:8001/api/writeRow)
    .post(function (req, res) {
        console.log("---------------------------------------writeRow::body---------------------------");
        console.log(req.body.stone);
        res.json({ success: true });
    });



// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);
