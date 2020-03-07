const Location = require('../model/Geo');
const maxDistance = 1000;

exports.addUnitLocation = (req, res, next) => {
    let { longitude, latitude } = req.body;
    let unitId = req.resources.unit._id;
    let newLocation = new Location({
        coordinates: [
            longitude,
            latitude
        ],
        unit: unitId
    })

    newLocation.save()
    .then(location => {
        if(!location) {
            return res.status(401).json({
                success: true,
                message: "Sorry we could not get your location :" + error
            })
        }
        req.resources.unitLocation = location;
        next();
    })
    .catch(error => {
      if(error.name == 'MongoError' && error.code === 11000) {
        return res.status(422).json({
          success: false,
          message: error.errors[message]
        })
      }
      res.status(500).json({
        message: "Sorry something happenend on our end"
      })
    })
}

exports.addEstateLocation = (req, res, next) => {
    let { longitude, latitude } = req.body;
    let estateId = req.resources.unit._id;
    let newLocation = new Location({
        coordinates: [
            longitude,
            latitude
        ],
        estate: estateId
    })

    newLocation.save()
        .then(location => {
            if (!location) {
                return res.status(401).json({
                    success: true,
                    message: "Sorry we could not get your location :" + error
                })
            }
            req.resources.estateLocation = location;
            next();
        })
        .catch(error => {
          if(error.name == 'MongoError' && error.code === 11000) {
            return res.status(422).json({
              success: false,
              message: error.errors[message]
            })
          }
          res.status(500).json({
            message: "Sorry something happenend on our end"
          })
        })
};

exports.getUnitLocation = (req, res, next) => {
    let unitId = req.resources.unit._id;
    Location.findOne(
        {
            unit: unitId
        }
    )

    .then(location => {
        if (!location) {
            return res.status(401).json({
                success: true,
                message: "Sorry we could not get your location :" + error
            })
        }
        req.resources.unitLocation = location;
        next();
    })
    .catch(error => {
      if(error.name == 'MongoError' && error.code === 11000) {
        return res.status(422).json({
          success: false,
          message: error.errors[message]
        })
      }
      res.status(500).json({
        message: "Sorry something happenend on our end"
      })
    })
}

exports.getUserLocation = (req, res, next) => {
    let userId = req.resources.user._id;

    Location.findOne(
        {
            user: userId
        }
    )
    .then(location => {
        if (!location) {
            return res.status(401).json({
                success: true,
                message: "Sorry we could not get your location :" + error
            })
        }
        req.resources.userLocation = location;
        next();
    })
    .catch(error => {
      if(error.name == 'MongoError' && error.code === 11000) {
        return res.status(422).json({
          success: false,
          message: error.errors[message]
        })
      }
      res.status(500).json({
        message: "Sorry something happenend on our end"
      })
    })
}

exports.getEstateLocation = (req, res, next) => {
    let estateId = req.resources.estate._id;
    Location.findOne(
        {
            estate: estateId
        }
    )
    .then(location => {
        if (!location) {
            return res.status(401).json({
                success: true,
                message: "Sorry we could not get your location :" + error
            })
        }
        req.resources.estateLocation = location;
        next();
    })
    .catch(error => {
      if(error.name == 'MongoError' && error.code === 11000) {
        return res.status(422).json({
          success: false,
          message: error.errors[message]
        })
      }
      res.status(500).json({
        message: "Sorry something happenend on our end"
      })
    })
};
