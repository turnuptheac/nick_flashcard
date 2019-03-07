/* global moment */
angular.module('app')
.controller('SettingsCtrl', [
    '$scope',
    '$state',
    '$timeout',
    'Words',
    SettingsCtrl
    ]);

function SettingsCtrl($scope, $state, $timeout, Words) {

    function getWords() {
        Words.getAll().then(function(response) {
            console.log('Words.getAll response: ', response);
            if (response.data.success) {
                $timeout(function() {
                    $scope.words = response.data.words;
                }, 0);
            } else {
                console.log('err: ', response.data.msg);
            }
        }, function(err) {
            console.log('err: ', err);
        });
    }
    getWords();

    $scope.newWordComposer = {
        name: '',
        definition: '',
        statusMsg: '',
        submit: function() {
            var self = this;
            Words.createOne({name: this.name, definition: this.definition})
                .then(function(response) {
                    console.log('Words.createOne response: ', response);
                    $timeout(function() {
                        self.name = '';
                        self.definition = '';
                        self.statusMsg = 'Successfully added new word.';
                        getWords();
                    }, 0);
                }, function(err) {
                    self.statusMsg = 'Unable to add new word.';
                });
        }
    };

    $scope.deleteWord = function(wordId) {
        Words.deleteOne(wordId)
            .then(function(response) {
                console.log('Words.deleteOne response: ', response);
                $timeout(function() {
                    getWords();
                }, 0);
            }, function(err) {
                console.error('Unable to delete word err: ', err);
            });
    };

    $scope.editWordComposer = {
        selectedWord: '',
        select: function(word) {
            this.selectedWord = angular.copy(word);
        },
        submit: function() {

        }
    };

    $scope.isPastDate = function(date) {
        return moment(date).isSameOrBefore(moment());
    };

    $scope.formatLocalTime = function(date) {
        return moment(date).local().format('M/D/YY [at] h:mma');
    };
}
