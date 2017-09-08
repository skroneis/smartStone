
// mainModule.factory('updateService', function ($scope, $http) {
//     return {
//         getPinValue: function (pin) {
//             console.log(pin);
//             console.log("sfsdfsdfsfsdfsd");
//             $http.get(MyApp.rootPath + 'api/getStatus/' + pin, null).then(function (response) {
//                 $scope.ledValue = response.data.value == 1;
//             },
//                 function errorCallback(response) {
//                     console.log("ERROR");
//                     console.log(response.data);
//                 });
//         }
//     };
// });
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

    $scope.refresh = function () {
        console.log("btn click...");
        $scope.$broadcast('RefreshPinStatus');
    };

    // $scope.toggleState = function (event) {
    //     console.log("toggleState...");
    //     console.log(event);
    // }

}).directive('ledSwitch', function ($http, $compile, $timeout) {
    return {
        restrict: 'E',
        scope: true,
        // template: '<label>{{pinLabel}}</label><span ng-click="click($event, $scope)">&nbsp;&nbsp;<input type="checkbox" data-off-title="Off" data-on-title="On" ng-checked="ledValue"></span> <i>{{ledValue}}</i>',
        //template: '<table class="ledTableInline"><thead><tr><th>{{pinLabel}}{{caption}}</th></tr></thead><tbody><tr><td><span ng-click="click($event, $scope)"><input type="checkbox" data-off-title="Off" data-on-title="On" ng-checked="ledValue"></span><span class="boolLabel"><br/><i>{{ledValue}}</i></span></td></tr></tbody></table>',
        template: '<table class="ledTableInline"><thead><tr><th>{{caption}}</th></tr></thead><tbody><tr><td><span ng-click="click($event, $scope)"><input type="checkbox" data-off-title="Off" data-on-title="On" ng-checked="ledValue"></span></td></tr></tbody></table>',
        link: function ($scope, elm, $attrs, http) {
            //infinite loop
            var pin = $attrs.pinNo;
            var caption = $attrs.caption;
            var refreshPin = function (pin, caption) {
                console.log("refresh loop...");
                // console.log(pin);
                $http.get(MyApp.rootPath + 'api/getStatus/' + pin, null).then(function (response) {
                    $scope.ledValue = response.data.value == 1;
                },
                    function errorCallback(response) {
                        console.log("ERROR");
                        console.log(response.data);
                    });

                //infinite loop
                $timeout(function () {
                    refreshPin(pin, caption);
                }, 2000)
            };

            //call function first time
            refreshPin(pin);
        },
        controller: function ($scope, $element, $attrs) {
            // console.log($attrs.pinNo);
            var pin = $attrs.pinNo;
            var caption = $attrs.caption;
            var _self = $scope;
            $scope.caption = "PIN" + pin;
            if (caption)
                $scope.caption = caption;
            var refresh = function (pin) {
                //console.log("TEST!!!!!!!!");
                $http.get(MyApp.rootPath + 'api/getStatus/' + pin, null).then(function (response) {
                    //console.log("GET...");
                    //console.log("PIN: " + pin + ": " + response.data.value);
                    $scope.ledValue = response.data.value == 1;
                });
            };

            $scope.$on("RefreshPinStatus", function (event) {
                console.log("refresh...");
                refresh(pin);
            });

            // refresh(pin);
            //get value
            // $http.get(MyApp.rootPath + 'api/getStatus/' + pin, null).then(function (response) {
            //     // console.log("GET...");
            //     // console.log("PIN: " + pin + ": " + response.data.value);
            //     $scope.ledValue = response.data.value == 1;
            // });

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
                    console.log("waiting...");
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
});

