"use strict";

angular.module("calendarApp", []).directive("gridDisplay", function () {
  return {
    restrict: "E",
    templateUrl: "components/calendar.template.html",
    controller: function ($scope) {
      var monthIndex = 0;
      $scope.month = Object.keys(data)[monthIndex];

      // Calculate number of items per row
      var itemsPerRow = 7;
      $scope.data = data[Object.keys(data)[monthIndex]];
      var numRows = Math.ceil($scope.data.length / itemsPerRow);

      function getMonthData(month) {
        $scope.rows = [];
        for (var i = 0; i < numRows; i++) {
          var row = [];
          for (var j = 0; j < itemsPerRow; j++) {
            var index = i * itemsPerRow + j;
            if (index < month.length) {
              row.push(month[index]);
            }
          }
          $scope.rows.push(row);
        }
      }

      getMonthData(data.jan);

      // Click event handler for chevron left button
      $scope.prevMonth = function () {
        monthIndex--;
        if (monthIndex < 0) {
          monthIndex = Object.keys(data).length - 1;
        }
        $scope.month = Object.keys(data)[monthIndex];
        $scope.data = data[Object.keys(data)[monthIndex]];
        getMonthData($scope.data);
      };

      // Click event handler for chevron right button
      $scope.nextMonth = function () {
        monthIndex++;
        if (monthIndex >= Object.keys(data).length) {
          monthIndex = 0;
        }
        $scope.month = Object.keys(data)[monthIndex];
        $scope.data = data[Object.keys(data)[monthIndex]];
        getMonthData($scope.data);
      };
    },
  };
});
