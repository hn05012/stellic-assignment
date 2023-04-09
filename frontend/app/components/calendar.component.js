"use strict";

angular.module("calendarApp", []).directive("gridDisplay", function () {
  return {
    restrict: "E",
    templateUrl: "components/calendar.template.html",
    controller: function ($scope) {
      var monthIndex = 0;
      $scope.year = 2023;
      $scope.selectedItemLabel = "";
      $scope.isDivOpen = false;
      $scope.month = Object.keys(data)[monthIndex];
      $scope.data = data[Object.keys(data)[monthIndex]];

      // Calculate number of items per row
      function getMonthData(month) {
        var itemsPerRow = 7;
        var numRows = Math.ceil($scope.data.length / itemsPerRow);
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

      function dateToUnixStamp(day, month, year) {
        return Math.floor(new Date(year, month, day).getTime() / 1000);
      }

      getMonthData(data.jan);

      // Click event handler for chevron left button
      $scope.prevMonth = function () {
        monthIndex--;
        if (monthIndex < 0) {
          monthIndex = Object.keys(data).length - 1;
          $scope.year--;
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
          $scope.year++;
        }
        $scope.month = Object.keys(data)[monthIndex];
        $scope.data = data[Object.keys(data)[monthIndex]];
        getMonthData($scope.data);
      };

      $scope.getItemLabel = function (label) {
        $scope.isDivOpen = true;
        $scope.selectedItemLabel = label;
        console.log(dateToUnixStamp(label, monthIndex, $scope.year));
      };

      $scope.closeDiv = function () {
        $scope.isDivOpen = false;
        $scope.selectedItemLabel = "";
      };
    },
  };
});
