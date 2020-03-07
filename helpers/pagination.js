function paginate(q, pageNumber, resultsPerPage, cb, options) {
    var model = this;
    var options = options || {}
    var columns = options.columns || null;
    var sortBy = options.sortBy || {
        id: 1
    }

    cb = cb || function () { };

    var skipFrom = (pageNumber * resultsPerPage) - resultsPerPage;
    console.log(options);

    if (columns == null) {
        var query = model.find(q).skip(skipFrom).limit(resultsPerPage).sort(sortBy).where('isDeleted', false)
        .select('-isDeleted')
    } else {
        var query = model.find(q).select(options.columns).skip(skipFrom).limit(resultsPerPage).sort(sortBy).where('isDeleted', false)
        .select('-isDeleted')
    }

    query
    .populate({
      path : 'images',
      match : {
        'isDeleted' : false
      }
    })
    .exec((error, results) => {

        if(error) {
            cb(error, null, null);
        } else {
            model.count(q, (error, count) => {
                if (error) {
                    cb(error, null, null)
                } else {
                    var pageCount = Math.ceil(count / resultsPerPage);
                    if (pageCount == 0) {
                        pageCount = 1;
                    }
                    cb(null, pageCount, results);
                }


            });
        }

    });
}

module.exports = paginate;
