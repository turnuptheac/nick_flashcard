angular.module('app')
.factory('Words', [
    '$http',
    Words
    ]);

function Words($http) {

    return {
        getAll: getAll,
        getOne: getOne,
        createOne: createOne,
        deleteOne: deleteOne,
        updateOne: updateOne
    };

    function getAll(query) {
        var url = REST_URL + '/word' + (query ? '?' + $.param(query) : '');
        return $http.get(url);
    }

    function getOne(id, query) {
        var url = REST_URL + '/word/' + id + (query ? '?' + $.param(query) : '');
        return $http.get(url);
    }

    function createOne(word) {
        var url = REST_URL + '/word';
        return $http.post(url, word);
    }

    function deleteOne(id) {
        var url = REST_URL + '/word/' + id;
        return $http.delete(url);
    }

    function updateOne(id, props) {
        var url = REST_URL + '/word/' + id;
        return $http.put(url, props);
    }
}

