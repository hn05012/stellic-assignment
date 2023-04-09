"use strict";

angular.module("calendarApp", []).directive("gridDisplay", function () {
  return {
    restrict: "E",
    templateUrl: "components/calendar.template.html",
    controller: function ($scope, $http) {
      var monthIndex = 0;
      $scope.username = "";
      $scope.year = 2023;
      $scope.day = "";
      $scope.isDivOpen = false;
      $scope.month = Object.keys(data)[monthIndex];
      $scope.data = data[Object.keys(data)[monthIndex]];
      $scope.reservationArray;
      $scope.reservationDetails = {};
      $scope.reservationName = "";
      $scope.reservationDate = "";

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

      function unixStamptoDate(UNIX_timestamp) {
        var a = new Date(UNIX_timestamp * 1000);
        var months = [
          "jan",
          "feb",
          "mar",
          "apr",
          "may",
          "jun",
          "jul",
          "aug",
          "sep",
          "oct",
          "nov",
          "dec",
        ];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        return {
          year: year,
          month: month,
          date: date,
        };
      }

      $scope.checkReservation = function (day) {
        if ($scope.reservationArray) {
          var date = dateToUnixStamp(day, monthIndex, $scope.year);
          var details;
          for (let i = 0; i < $scope.reservationArray.length; i++) {
            if ($scope.reservationArray[i].time === date) {
              details = $scope.reservationArray[i];
              break;
            }
          }
          if (details) {
            $scope.reservationDetails = details;
            $scope.reservationName = details.tennantName;
            $scope.reservationDate = unixStamptoDate(details.time);
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      };

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
        $scope.day = label;
        $scope.checkReservation(label);
      };

      $scope.closeDiv = function () {
        $scope.isDivOpen = false;
        $scope.day = "";
      };

      $scope.confirmStay = function (day, username) {
        var date = dateToUnixStamp(day, monthIndex, $scope.year);
        console.log("in unix stamp", date);
        $scope.reserve(username, date, true);
        $scope.fetchReservations(
          dateToUnixStamp(1, monthIndex, $scope.year),
          dateToUnixStamp($scope.data.length, monthIndex, $scope.year)
        );
      };

      $scope.cancelStay = function (day, username) {
        var date = dateToUnixStamp(day, monthIndex, $scope.year);
        $scope.reserve(username, date, false);
        $scope.fetchReservations(
          dateToUnixStamp(1, monthIndex, $scope.year),
          dateToUnixStamp($scope.data.length, monthIndex, $scope.year)
        );
      };

      $scope.reserve = function (tennantName, time, reserved) {
        console.log(time);
        var reserveData = {
          tennantName: tennantName,
          time: time,
          reserved: reserved,
        };
        $http
          .post("http://localhost:3000/reserve", reserveData)
          .then(function (response) {
            console.log("Reservation successful:", response.data);
          })
          .catch(function (error) {
            console.error("Error making reservation:", error);
          });
      };

      $scope.fetchReservations = function (startTime, endTime) {
        var url = "http://localhost:3000/reserve/" + startTime + "/" + endTime;
        $http
          .get(url)
          .then(function (response) {
            $scope.reservationArray = response.data.reserved;
            console.log("Reservation array:", $scope.reservationArray);
          })
          .catch(function (error) {
            console.error("Error retrieving reservations:", error);
          });
      };

      getMonthData(data.jan);
      $scope.fetchReservations(
        dateToUnixStamp(1, monthIndex, $scope.year),
        dateToUnixStamp($scope.data.length, monthIndex, $scope.year)
      );
    },
  };
});
