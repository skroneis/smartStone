chartModule.controller("chartController", function ($scope, viewModelHelper, $http, $q) {
    $scope.Sepp = "Sepp Forcher";
    $scope.isLoading = false;
    $scope.chartData = null;

    var initialize = function () {
        console.log("initialize");
        $scope.getChartData();
    }

    $scope.init = function () {
        console.log("init");
        initialize();
    };

    // this function returns our chart data as a promise
    $scope.dataFromPromise = function () {
        var deferred = $q.defer();

        $scope.isLoading = true;
        return $http.get(MyApp.rootPath + 'api/getChartData', null).then(function (response) {
            //console.log(response.data);
            var data = response.data;
            $scope.isLoading = false;
            deferred.resolve(data)
            return deferred.promise;
        },
            function errorCallback(response) {
                console.log("ERROR");
                console.log(response.data);
            });
    };

    $scope.amChartOptions = {
        "type": "serial",
        "theme": "light",
        "marginTop": 40,
        "marginRight": 40,
        "valueAxes": [{
            "minimum": -10,
            "maximum": 40,
            "title": "°C",
            "titleRotation": 45,
            "axisColor": "#ff0000",
            "bands": [
                {
                    "startValue": 0,
                    "endValue": 100
                }
            ]
        }],
        "categoryAxis": {
            "minPeriod": "mm",
            "parseDates": true,
            "minorGridAlpha": 0.5,
            "minorGridEnabled": true,
            "autoGridCount": true,
            "title": "t",
            dateFormats: [{
                period: 'fff',
                format: 'JJ:NN:SS'
            }, {
                period: 'ss',
                format: 'JJ:NN:SS'
            }, {
                period: 'mm',
                format: 'JJ:NN'
            }, {
                period: 'hh',
                format: 'JJ:NN'
            }, {
                period: 'DD',
                format: 'MMM DD'
            }, {
                period: 'WW',
                format: 'MMM DD'
            }, {
                period: 'MM',
                format: 'MMM YYYY'
            }, {
                period: 'YYYY',
                format: 'MMM YYYY'
            }],
            "startOnAxis": true
        },
        "graphs": [{
            "id": "g1",
            "balloonText": "[[category]]<br><b><span style='font-size:14px;'>[[value]]</span></b>",
            "bullet": "round",
            "bulletSize": 8,
            "lineColor": "#d1655d",
            "lineThickness": 2,
            "negativeLineColor": "#637bb6",
            "type": "smoothedLine",
            "valueField": "temperature"
        }],
        // "chartScrollbar": {
        //     "graph": "g1",
        //     "gridAlpha": 0,
        //     "color": "#888888",
        //     "scrollbarHeight": 55,
        //     "backgroundAlpha": 0,
        //     "selectedBackgroundAlpha": 0.1,
        //     "selectedBackgroundColor": "#888888",
        //     "graphFillAlpha": 0,
        //     "autoGridCount": true,
        //     "selectedGraphFillAlpha": 0,
        //     "graphLineAlpha": 0.2,
        //     "graphLineColor": "#c2c2c2",
        //     "selectedGraphLineColor": "#888888",
        //     "selectedGraphLineAlpha": 1
        // },
        "chartCursor": {
            "categoryBalloonDateFormat": "YYYY-MM-DD JJ:NN:SS",
            "cursorAlpha": 0,
            "valueLineEnabled": true,
            "valueLineBalloonEnabled": true,
            "valueLineAlpha": 0.5,
            "fullWidth": true
        },
        "dataDateFormat": "YYYY-MM-DD JJ:NN:SS",
        "categoryField": "time",
        "export": {
            "enabled": true
        },
        "titles": [
            {
                "text": "Temperatur",
                "size": 15
            }
        ],
        // pathToImages: 'https://cdnjs.cloudflare.com/ajax/libs/amcharts/3.13.0/images/',
        "data": $scope.dataFromPromise(),
    };

    $scope.getChartData = function () {
        console.log("getChartData");
        $scope.isLoading = true;
        return $http.get(MyApp.rootPath + 'api/getChartData', null).then(function (response) {
            //console.log(response.data);
            $scope.chartData = response.data;
            $scope.isLoading = false;
        },
            function errorCallback(response) {
                console.log("ERROR");
                console.log(response.data);
            });
    };

});