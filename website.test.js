// =======================
// WEB-Pages ================
// =======================
var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var http = require('http').Server(app);

// =======================
// Google spreadsheet ====
// =======================
var Spreadsheet = require("./spreadsheet.js");
var spreadsheet = new Spreadsheet();

// =======================
// configuration =========
// =======================
var port = process.env.PORT || 8001;
var actuals = null;

//app.use(express.compress());
app.use('/', express.static(__dirname + '/public'));
//4 post
app.use(bodyParser.json())

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
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
    //(accessed at POST http://localhost:8080/api/setValue)
    .post(function (req, res) {
        console.log ("---------------------------------------body---------------------------");
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


// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);
