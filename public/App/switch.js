
mainModule.controller('switchController', function ($scope, viewModelHelper, $http) {
    $scope.Sepp = "Sepp Forcher";
    $scope.isLoading = false;
    // $scope.leds = [];

    var initialize = function () {
        console.log("initialize");
        // $scope.leds.led_11 = false;
    }

    $scope.init = function () {
        console.log("init");
        initialize();
    };

    // $scope.toggleState = function (event) {
    //     console.log("toggleState...");
    //     console.log(event);
    // }

}).directive('appClick', function ($http, $compile, $timeout) {
    return {
        restrict: 'E',
        scope: true,
        template: '<label>{{pinLabel}}</label><span ng-click="click($event, $scope)">&nbsp;&nbsp;<input type="checkbox" data-off-title="Off" data-on-title="On" ng-checked="ledValue"></span> <i>{{ledValue}}</i>',
        controller: function ($scope, $element, $attrs) {
            // console.log($attrs.pinNo);
            var pin = $attrs.pinNo;
            var _self = $scope;
            $scope.pinLabel = "PIN" + pin;
            //get value
            $http.get(MyApp.rootPath + 'api/getStatus/' + pin, null).then(function (response) {
                // console.log("GET...");
                // console.log("PIN: " + pin + ": " + response.data.value);
                $scope.ledValue = response.data.value == 1;
            });

            $scope.click = function ($event, scope) {
                // console.log ($event.currentTarget.querySelector('.active').children[0].getAttribute("is"));
                var valChkBox = $event.currentTarget.querySelector('.active').children[0].getAttribute("is");
                // console.log("valChkBox: --> " + valChkBox)
                if ($scope.ledValue == valChkBox) {
                    console.log("return...");
                    return;
                }
                //wichtig (!)
                $scope.ledValue = valChkBox == 1;
                // $scope.ledValue = true;
                // console.log("Value to set Pin %s: %s", pin, valChkBox);
                var data = {
                    pin: pin,
                    value: valChkBox
                };
                // console.log(data);
                //set only when different...
                $http.post(MyApp.rootPath + 'api/setValue/', data).then(function (response) {
                    // console.log(response.data.success);
                    //check Value --> set GUI (!)
                    //wait 500ms... 
                    console.log ("waiting...");
                    $timeout(function () {
                        // $element.css('display', 'none');
                        console.log("POST...")
                        // console.log("pin in timeout: " + pin);
                        $http.get(MyApp.rootPath + 'api/getStatus/' + pin, null).then(function (response) {
                            // console.log("2. GET --> PIN: " + pin + ": " + response.data.value);
                            $scope.ledValue = response.data.value == 1;
                            //$scope.ledValue = false;
                        });
                    }, 200);
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

