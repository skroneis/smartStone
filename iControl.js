// =======================
// API ===================
// =======================

var express = require('express');
var app = express();
var http = require('http').Server(app);

//Data-Manager
var dataManager = require("./dataManager");

//GPIO
/*var gpio = require('./rpi_gpio')*/
var actuals = null;
var self = null;
var modules = module.exports = {
    init: function (values) {
        actuals = values;
        console.log("constructor - API...");
        self = this;
    },
};

// =======================
// configuration =========
// =======================
var port = process.env.PORT || 3001;

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

apiRoutes.get('/setOn/:id', function (req, res, next) {
    //if(err) res.send(err);
    //gu.setPin(req.params.id, 1);
    gpio.setOn(req.params.id)
    //res.json("OK");
    res.json({ success: true });
});

apiRoutes.get('/setOff/:id', function (req, res, next) {
    //if(err) res.send(err);
    gpio.setOff(req.params.id)
    //gu.setPin(req.params.id, 0);
    //res.json("OK");
    res.json({ success: true });
});

apiRoutes.get('/getTemp', function (req, res, next) {
    //if(err) res.send(err);
    try {
        if (actuals && actuals.IN && actuals.OUT)
            res.json({ "TempIn": actuals.IN.temp, "TempOut": actuals.OUT.temp });
        else
            res.json({ success: false });
    }
    catch (e) {
        console.log(e);
        return next(e);
    }
});

// apiRoutes.get('/getTempDB', function (req, res, next) {
//     try {
//         res.json({ success: true });
//     }
//     catch (e) {
//         console.log(e);
//         return next(e);
//     }
// });

apiRoutes.get('/test', function (req, res, next) {
    try {
        res.json({ success: true });
    }
    catch (e) {
        console.log(e);
        return next(e);
    }
});

//-----------------------------------------------------------------------------------------------------------------------------
//TEST
apiRoutes.get('/test/:id', function (req, res, next) {
    try {
        // var i = 0;
        // var y = 5/z;
        //throw new Error('thwump');
        //var err = new Error('Current password does not match');
        //err.code = 400;
        // forward control on to the next registered error handler:
        //return next(err);
        // read example 
        // var pin = wpw.setupPin(parseInt(req.params.id), pinModes.input);
        // var status = pin.read(); 
        var status = "1";

    } catch (e) {
        console.log(e);
        return next(e);
    }

    //if(err) res.send(err);
    //gu.setPin(req.params.id, 1);	

    // if (err) return next(err);
    //res.json("OK " + status);
    res.json({ success: true, status: status });
});

// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);


// =======================
// start the server ======
// =======================
var server = http.listen(port, function () {
    var host = server.address().address
    var port = server.address().port
    console.log('API listening on %s:%s', host, port);
});