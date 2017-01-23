mainModule.controller("ledController", function ($scope, viewModelHelper, $http) {
    $scope.Sepp = "Sepp Forcher";
    $scope.isLoading = false;

    var initialize = function () {
        console.log("initialize");

    }

    $scope.init = function () {
        console.log("init");
        initialize();
    };

    // $scope.getStatus = function (pin) {
    //     console.log("getStatus...");
    //     console.log(pin);
    //     $http.get(MyApp.rootPath + 'api/getStatus/' + pin, null).then(function (response) {
    //         //console.log(response.data);
    //         if (response.data == 0)
    //             return "off";
    //         if (response.data == 1)
    //             return "on";
    //         $scope.isLoading = false;
    //     },
    //         function errorCallback(response) {
    //             console.log("ERROR");
    //             // bootbox.alert("ERROR");            
    //             console.log(response.data);
    //         });

    //     return "off";
    // };
});