/* global _, moment */
angular.module('app')
.controller('PlayCtrl', [
    '$scope',
    '$state',
    '$timeout',
    'Words',
    PlayCtrl
    ]);

function PlayCtrl($scope, $state, $timeout, Words) {
    $scope.noWordsForReview = false;

    $scope.getNextAvailableWord = function() {
        $scope.quizCtrl.loading = true;

        Words.getAll().then(function(response) {
            var now = moment();
            console.log('now.format(): ', now.utc().format());
            var words = response.data.words;
            console.log('words: ', words);
            // Exclude words in bin 11 (never review) and 12 (hard to remember)
            // Filter for only dued reviews, unless word is in bin 0 then include as well
            var filtered = _.filter(words, function(w) {
                return w.currentBin < 11 && (w.currentBin === 0 || moment(w.nextReviewDate).isSameOrBefore(now));
            });
            console.log('filtered: ', filtered);
            // Priortize higher-numbered bins
            var sorted = _.reverse(_.sortBy(filtered, 'currentBin'));

            if (sorted.length) {
                console.log('first word ready for review');
                $scope.noWordsForReview = false;
                $timeout(function() {
                    $scope.quizCtrl.loading = false;
                    $scope.quizCtrl.currentWord = sorted[0];
                }, 0);

            } else {
                // If no words for review, determine whether all words are in final bins or if they are not yet up for review.
                var removed = _.remove(words, function(w) {
                    return w.currentBin > 10;
                });
                if (!words.length) {
                    $scope.noWordsForReview = 'You have no more words to review; you are permanently done!';
                } else {
                    $scope.noWordsForReview = 'You are temporarily done; please come back later to review more words.';
                }

                console.log('first word not ready for review');
                $timeout(function() {
                    $scope.quizCtrl.loading = false;
                }, 0);
            }

        }, function(err) {
            console.log('err: ', err);
        });
    };

    $scope.quizCtrl = {
        currentWord: null,
        revealed: false,
        markCorrect: function() {
            var nextReviewDate = moment();
            this.currentWord.numCorrect++;
            this.currentWord.currentBin++;
            switch (this.currentWord.currentBin) {
                case 0:
                    console.error('noop');
                    break;
                case 1:
                    nextReviewDate.add(5, 'seconds');
                    break;
                case 2:
                    nextReviewDate.add(25, 'seconds');
                    break;
                case 3:
                    nextReviewDate.add(2, 'minutes');
                    break;
                case 4:
                    nextReviewDate.add(10, 'minutes');
                    break;
                case 5:
                    nextReviewDate.add(1, 'hours');
                    break;
                case 6:
                    nextReviewDate.add(5, 'hours');
                    break;
                case 7:
                    nextReviewDate.add(1, 'days');
                    break;
                case 8:
                    nextReviewDate.add(5, 'days');
                    break;
                case 9:
                    nextReviewDate.add(25, 'days');
                    break;
                case 10:
                    nextReviewDate.add(4, 'months');
                    break;
                case 11:
                    nextReviewDate.add(100, 'years');
                    break;
                default:
                    console.error('noop');
                    break;
            }
            this.currentWord.nextReviewDate = nextReviewDate.format();

            this.submit();
        },
        markWrong: function() {
            this.currentWord.currentBin = 1;
            this.currentWord.numWrong++;
            if (this.currentWord.numWrong >= 10) {
                this.currentWord.currentBin = 12;
            } else {
                this.currentWord.nextReviewDate = moment().add(5, 'seconds').format();
            }
            this.submit();
        },
        submit: function() {
            this.revealed = false;
            this.loading = true;

            var w = angular.copy(this.currentWord);
            this.currentWord = null;
            Words.updateOne(w._id, w)
                .then(function(response) {
                    $scope.getNextAvailableWord();
                }, function(err) {
                    $scope.getNextAvailableWord();
                });
        },
        loading: true
    };



    $scope.getNextAvailableWord();
}
