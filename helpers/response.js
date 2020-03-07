
module.exports.toJSON = sendJSONresponse;

function sendJSONresponse(prop) {
    return function (req, res, next) {
        res.json({
            success: true,
            data: req.resources[prop]
        });
    }
}