// =======================
// Google Spreadsheet ====
// =======================

//Library
var GoogleSpreadsheet = require('google-spreadsheet');
var async = require('async');

// spreadsheet key is the long id in the sheets URL 
var doc = new GoogleSpreadsheet('1QcmeNcGtXc15z804IzBfkIrFAiT5wK5BQKZDHiqDGIo');
exports = module.exports = SpreadsheetLogger;

var actuals = null;
var self = null;
var sheet = null;

//constructor
function SpreadsheetLogger() {
    console.log("constructor - SpreadsheetLogger");
    self = this;
}

//config
var config = require('./config');
// INIT
SpreadsheetLogger.prototype.init = function (values) {
    actuals = values;

    async.series([
        function setAuth(step) {
            console.log("  SpreadsheetLogger::setAuth");
            // see notes below for authentication instructions! 
            var creds = require('./stone-5ab93e7770eb.json');
            doc.useServiceAccountAuth(creds, step);
        },
        function getInfoAndWorksheets(step) {
            doc.getInfo(function (err, info) {
                // console.log('Loaded doc: ' + info.title + ' by ' + info.author.email);
                console.log("  SpreadsheetLogger::getInfoAndWorksheets");
                sheet = info.worksheets[0];
                // console.log('sheet 1: ' + sheet.title + ' ' + sheet.rowCount + 'x' + sheet.colCount);
                step();
            });
        }
    ], function (err) {
        if (err) {
            console.log('Error: ' + err);
        }
    });
};

// write a new row entry in spreadsheet
SpreadsheetLogger.prototype.writeRow = function () {
    if (sheet != null)
        console.log("  SpreadsheetLogger::addRow...");
        // console.log(actuals);
        sheet.addRow({	temp_in: actuals.IN.temp, 
			temp_out: actuals.OUT.temp, 
			timestamp: actuals.KRO.dateTime, 
			wiGe: actuals.KRO.wiGe, 
			wiRi: actuals.KRO.wiRi, 
			wiRiStr: actuals.KRO.wiRiStr, 
			wiGeMax: actuals.KRO.nodeWiGeMax,
			wiGeMaxAt: actuals.KRO.wiGeMaxAt,
			wiGeWiRiMaxStr: actuals.KRO.nodeWiGeWiRiMaxStr }, function (err, row) {
            if (err) {
                throw err;
            }
            console.log("  SpreadsheetLogger::OK!");
        });
};
