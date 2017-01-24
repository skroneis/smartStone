
mainModule.controller('ledController', function ($scope, viewModelHelper, $http) {
    $scope.Sepp = "Sepp Forcher";
    $scope.isLoading = false;

    var initialize = function () {
        console.log("initialize");

    }

    $scope.init = function () {
        console.log("init");
        initialize();
    };
})
    .directive('ledStatus', function ($http, $compile, $timeout) {
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


/***********cool template************/
// angular.module('docsSimpleDirective', [])
// .controller('Controller', ['$scope', function($scope) {
//   $scope.customer = {
//     name: 'Naomi',
//     address: '1600 Amphitheatre'
//   };
// }])
// .directive('myCustomer', function() {
//   return {
//     template: 'Name: {{customer.name}} Address: {{customer.address}}'
//   };
// });


///Obsolete
// mainModule.controller("ledController", function ($scope, viewModelHelper, $http) {
//     $scope.Sepp = "Sepp Forcher";
//     $scope.isLoading = false;

//     var initialize = function () {
//         console.log("initialize");

//     }

//     $scope.init = function () {
//         console.log("init");
//         initialize();
//     };

//     // $scope.getStatus = function (pin) {
//     //     console.log("getStatus...");
//     //     console.log(pin);
//     //     $http.get(MyApp.rootPath + 'api/getStatus/' + pin, null).then(function (response) {
//     //         //console.log(response.data);
//     //         if (response.data == 0)
//     //             return "off";
//     //         if (response.data == 1)
//     //             return "on";
//     //         $scope.isLoading = false;
//     //     },
//     //         function errorCallback(response) {
//     //             console.log("ERROR");
//     //             // bootbox.alert("ERROR");            
//     //             console.log(response.data);
//     //         });

//     //     return "off";
//     // };
// });


