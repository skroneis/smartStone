// =======================
// Data-Manager ================
// =======================
var express = require('express');
var p = [35, 2, 65, 7, 8, 9, 12, 121, 33, 99];
var WiGe = [];
//init values (actual)
var modules = module.exports = {
    init: function () {
        console.log("Data-Manager...");

    },
    Min: function (arr) {
        return arr.min();
    },
    Max: function (arr) {

        return arr.max();
    },
    Push: function (arr, value) {
        WiGe.push(value);
        if (arr.length > 4) {   //1800 ~ 1h
            WiGe.shift();
            console.log("REMOVE");
        }

    },
    P: function () {
        return p;
    },
    WiGe: function () {
        return WiGe;
    }
};



//helper
Array.prototype.max = function () {
    return Math.max.apply(null, this);
};

Array.prototype.min = function () {
    return Math.min.apply(null, this);
};

