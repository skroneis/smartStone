
mainModule.controller('switchController', function ($scope, viewModelHelper, $http) {
    $scope.Sepp = "Sepp Forcher";
    $scope.isLoading = false;
    $scope.leds = [];

    var initialize = function () {
        console.log("initialize");
        $scope.leds.led_11 = false;
    }

    $scope.init = function () {
        console.log("init");
        initialize();
    };

    $scope.toggleState = function (event) {
        console.log("toggleState...");
        console.log(event);
    }
}).directive('appClick', function ($http, $compile, $timeout) {
    return {
        restrict: 'E',
        scope: true,
        template: '<label>{{pinLabel}}</label><span ng-click="click($event)">&nbsp;&nbsp;<input type="checkbox" data-off-title="Off" data-on-title="On" ng-checked="ledValue"></span> <i>{{ledValue}}</i>',
        controller: function ($scope, $element, $attrs) {
            console.log($attrs.pinNo);
            $scope.pinLabel = "PIN" + $attrs.pinNo;
            //get value
            $http.get(MyApp.rootPath + 'api/getStatus/' + $attrs.pinNo, null).then(function (response) {
                console.log("GET...");
                //console.log("PIN: " + $attrs.pinNo + ": " + response.data);
                $scope.ledValue = response.data.value == 1;
            });

            $scope.click = function ($event) {
                var valChkBox = $event.currentTarget.querySelector('.active').getAttribute("is");
                console.log(valChkBox)
                if ($scope.ledValue == valChkBox) {
                    console.log("return...");
                    return;
                }
                $scope.ledValue = valChkBox == 1;
                // $scope.ledValue = true;
                var data = {
                    pin: $attrs.pinNo,
                    value: valChkBox
                };
                console.log(data);
                //set only when different...
                $http.post(MyApp.rootPath + 'api/setValue/', data).then(function (response) {
                    console.log(response.data.success);
                    //check Value --> set GUI (!)
                    console.log("POST...")
                    $http.get(MyApp.rootPath + 'api/getStatus/' + $attrs.pinNo, null).then(function (response) {
                        console.log("PIN: " + $attrs.pinNo + ": " + response.data.value);
                        $scope.ledValue = response.data.value == 1;
                        //$scope.ledValue = false;
                    });
                });
            }
        }
    }
}).directive('ledStatus', function ($http, $compile, $timeout) {
    return {
        restrict: 'E',
        scope: {
            data: "@class"
        },
        link: function (scope, elm, attrs, http) {
            var getLedStatusInfo = function () {
                var element = document.createElement('span');
                element.className += "led";
                // console.log(scope);
                // console.log(scope.Sepp);
                $http.get(MyApp.rootPath + 'api/getStatus/' + attrs.pinNo, null).then(function (response) {
                    console.log("PIN: " + attrs.pinNo + ": " + response.data);
                    if (response.data.value == 1)
                        element.className += " on";
                    //elm.html("<a target='_self' href='http://www.google.at'>GOOGLE</a>");
                    // console.log(element);
                    elm.html($compile(element)(scope));

                },
                    function errorCallback(response) {
                        console.log("ERROR");
                        console.log(response.data);
                    });

                //infinite loop
                $timeout(function () {
                    getLedStatusInfo();
                }, 2000)
            };

            //call function first time
            getLedStatusInfo();
        },
        controller: function ($scope, $element, $attrs) {
            // Controller code goes here.
            // console.log("controller...");
            // console.log($attrs.pinNo);
        }
    };
});

