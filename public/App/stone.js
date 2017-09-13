mainModule.controller("stoneController", function ($scope, viewModelHelper, $http) {
    $scope.Sepp = "Sepp Forcher";
    $scope.isLoading = false;
    $scope.actuals = null;
    $scope.trigger = true;

    var initialize = function () {
        console.log("initialize");
        $scope.getValues();
        $scope.resetAirConditionValues();
        $scope.getAirConditionIndicator();

        setInterval(function () {
            // console.log("get....");
            $scope.getValues();
        }, 1000 * 5) //5 seconds...
    }

    $scope.init = function () {
        console.log("init");
        initialize();
    };

    // $scope.initImg = function () {
    //     console.log("init-img");
    //     initialize();
    //     $scope.getImage();
    //     setInterval(function () {
    //         $scope.getImage();
    //     }, 1000 * 1 * 60 * 60) //1 second --> 1hour ...
    // };

    // $scope.getImage = function () {
    // console.log("get image....");
    // return $http.get(MyApp.rootPath + 'api/getImage', null).then(function (response) {
    //     console.log(response.data.img);
    // },
    //     function errorCallback(response) {
    //         console.log("ERROR");
    //         // bootbox.alert("ERROR");            
    //         console.log(response.data);
    //     });
    // }

    $scope.getValues = function () {
        //alert("getInfos");
        // console.log("getInfos");
        $scope.isLoading = true;
        //$http.defaults.headers.common["RequestVerificationToken"] = $scope.token;
        // console.log("-----------------------------");
        // console.log(MyApp.rootPath);
        return $http.get(MyApp.rootPath + 'api/getData', null).then(function (response) {
            //console.log(response.data);
            $scope.actuals = response.data;
            $scope.getAirConditionIndicator();
            $scope.isLoading = false;
        },
            function errorCallback(response) {
                console.log("ERROR");
                // bootbox.alert("ERROR");            
                console.log(response.data);
            });
    };

    $scope.getDate = function () {
        return new Date();
    };

    $scope.getWiGeClass = function (val) {
        if (val > 50)
            return "danger";
        return null;
    }

    $scope.writeSpreadsheetEntry = function () {
        console.log("writeSpreadsheetEntry...");
        $scope.isLoading = true;
        return $http.post(MyApp.rootPath + 'api/writeRow', { "stone": "SeppForcher" }).then(function (response) {
            //console.log(response.data);
            console.log(response.data);
            $scope.isLoading = false;
            if (response.data.success)
                bootbox.alert({
                    message: "OK!",
                    size: 'small'
                });
        },
            function errorCallback(response) {
                console.log("ERROR");
                // bootbox.alert("ERROR");            
                console.log(response.data);
            });
    };



    $scope.resetAirConditionValues = function () {
        $scope.showAirConditionIndicatorGreen = false;
        $scope.showAirConditionIndicatorRed = false;
        $scope.showAirConditionIndicatorYellow = false;
        $scope.airConditionMessage = null;
    }

    $scope.getAirConditionIndicator = function () {
        $scope.resetAirConditionValues();
        console.log($scope.actuals);
        if ($scope.actuals) {
            //if temp inside is higher than outside --> green (turn on)
            if ($scope.actuals.IN.temp > $scope.actuals.KRO.temp) {
                $scope.airConditionMessage = "[turn off]"
                if ($scope.actuals.IN.temp - $scope.actuals.KRO.temp <= 0.5) {
                    $scope.showAirConditionIndicatorYellow = true;
                    $scope.airConditionMessage += " ...soon";
                }
                else
                    $scope.showAirConditionIndicatorRed = true;


            }
            //if temp inside is lower than outside --> red (turn off)
            else if ($scope.actuals.IN.temp < $scope.actuals.KRO.temp) {
                $scope.airConditionMessage = "[turn on]"
                if ($scope.actuals.KRO.temp - $scope.actuals.IN.temp <= 0.5) {
                    $scope.showAirConditionIndicatorYellow = true;
                    $scope.airConditionMessage += " ...soon";
                }
                else
                    $scope.showAirConditionIndicatorGreen = true;

            }
        }
    };

    $scope.updateImage = function () {
        console.log("update image...");
        $scope.trigger = !$scope.trigger;
    }
}).directive('backImgBing', function ($http, $compile, $timeout) {
    return function (scope, element) {
        console.log("get image....");
        //get url
        var getImgUrl = function () {
            return $http.get(MyApp.rootPath + 'api/getBingImage', null).then(function (response) {
                console.log(response.data.img);
                element.css({
                    'background-image': 'url(' + response.data.img + ')',
                    'position': 'absolute',
                    'top': '0',
                    'left': '0',
                    'right': '0',
                    'bottom': '0',
                    'background-repeat': 'no-repeat',
                    'background-size': 'cover',
                    'z-index': '-99',
                    'opacity': '1'
                });
            },
                function errorCallback(response) {
                    console.log("ERROR");
                    // bootbox.alert("ERROR");            
                    console.log(response.data);
                });
        }
        //watch
        scope.$watch('trigger', function (val) {
            console.log("TRIGGER");
            return getImgUrl();
        });

        setInterval(function () {
            return getImgUrl();
        }, 1000 * 1 * 60 * 60) // 1 second --> 1hour ...

        return getImgUrl();
    };
}).directive('backImgChromecast', function ($http, $compile, $timeout) {
    return function (scope, element) {
        console.log("get image....");
        return $http.get(MyApp.rootPath + 'api/getChromecastImage', null).then(function (response) {
            console.log(response.data.img);
            element.css({
                'background-image': 'url(' + response.data.img + ')',
                'position': 'absolute',
                'top': '0',
                'left': '0',
                'right': '0',
                'bottom': '0',
                'background-repeat': 'no-repeat',
                'background-size': 'cover',
                'z-index': '-1'
            });
        },
            function errorCallback(response) {
                console.log("ERROR");
                // bootbox.alert("ERROR");            
                console.log(response.data);
            });
    };
});