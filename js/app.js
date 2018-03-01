(function () {

  // define angular module

  /**
   * angular module
   */
  angular.module('LunchCheck', [])
    // define controller for checking lunch
    .controller('LunchCheckController', LunchCheckController)
    ;

  // inject dependencies to guard against minification
  LunchCheckController.$inject = ['$scope'];

  /**
   * function to define the LunchCheckerCtrl controller
   * @param {*}  angular services required
   */
  function LunchCheckController($scope) {

    $scope.lunchList = '';
    $scope.message = '';
    $scope.details = '';

    $scope.checkCount = function () {
      $scope.clearMessage();

      //console.log('list: "' + $scope.lunchList + '"');
      if ($scope.lunchList == '') {
        $scope.message = 'Please enter data first!'
        //console.log('empty');
      } else {
        //console.log('not empty');

        let res = splitString($scope.lunchList, ',');
        //console.log(res);

        if (res.words.length == 0) {
          $scope.message = 'Please enter items seperated by comma!';
        } else {
          $scope.details =
            'you had ' + res.words.length + ' items: ' + res.words.join(', ');

          if (res.words.length <= 3) {
            if (res.numDuplicates > 0) {
              $scope.message = 'Duplicates don\'t count. ';
            }
            $scope.message += 'Enjoy!';
          } else {
            $scope.message = 'Too much!';
          }
        }
      }
    }

    $scope.clearMessage = function () {
      $scope.message = '';
      $scope.details = '';
    }
  }


  /**
   * function that splits a string into words
   *
   * @param  {string}  string string of words seperated by seperator
   * @param  {string}  seperator optional one or more characters, default is space
   * @param  {boolean} trimSpaces optional, true to trim spaces from all words
   * @param  {boolean} includeEmpty optional, false to exclude empty strings
   * @param  {boolean} includeDuplicates optional, false to exclude duplicates
   * @return {object}  an object with three properties
   *      words: array of all words including empty strings and spaces
   *      occurancies: matching array with the number of occurancies of each word
   *      duplicates: array of unique words that have duplicates
   *      numDuplicates: total number of duplicates
   *      numEmpty: count of empty or spaces only words
   *
   * the entries
   */
  function splitString(string,
    seperator = ' ',
    trimSpaces = true,
    includeEmpty = false,
    includeDuplicates = false,
  ) {

    let res = {
      words: [],
      duplicates: [],
      numDuplicates: 0,
      numEmpty: 0,
    }

    let words = string.split(seperator);

    // count words accounting for empty, space only or duplicates
    words.forEach(function (word, index) {
      //console.log('word #' + index + ': ' + word);

      // trim leading/lagging spaces if applicable
      if (trimSpaces) word = word.trim();

      if (word == '') { // empty string
        res.numEmpty++;
        if (includeEmpty) res.words.push(word);

      } else if (res.words.indexOf(word) != -1) { // duplicate word
        res.numDuplicates++;
        if (res.duplicates.indexOf(word) == -1) { // only push once into duplicates []
          res.duplicates.push(word);
        }
        if (includeDuplicates) { // include in words [] if specified
          res.words.push(word);
        }
      } else {
        res.words.push(word);
      }
    });

    return res;
  }

})();
