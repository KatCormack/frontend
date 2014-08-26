var mockResource = {
    query: function() {
        queryDeferred = $q.defer();
        return { $promise: queryDeferred.promise };
    }
}
