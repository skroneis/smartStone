mainModule.controller("stoneController", function ($scope, viewModelHelper, $http) {
    $scope.Sepp = "Sepp Forcher";
    $scope.isLoading = false;
    $scope.actuals = null;

    var initialize = function () {
        console.log("initialize");
        $scope.getValues();
        $scope.resetAirConditionValues();
        $scope.getAirConditionIndicator();
    }

    $scope.init = function () {
        console.log("init");
        initialize();
    };

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

    setInterval(function () {
        // console.log("get....");
        $scope.getValues();
        // $scope.getAirConditionIndicator();
    }, 1000 * 5) //5 secongs...

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


});