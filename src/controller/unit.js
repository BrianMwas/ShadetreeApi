const Unit = require('../model/unit');
const Image = require('../model/images');
const { uploader } = require('../../config/imagesConfig/cloudinaryConfig');
const { dataUri } = require('../../config/imagesConfig/multer');
let Review = require('../model/review');
const err = require('err-code');
const _ = require('lodash');
const defaultPage = 1;
const defaultLimit = 6;


exports.getTotalUnits = (req, res, next) => {
  Unit.find()
  .select('isDeleted')
  .where('isDeleted', false)
  .estimatedDocumentCount()
  .then(totalCount => {
    if(totalCount <= 0) {
     return res.json({
        message: "No company has added a unit yet."
      })
    }
    req.resources.totalUnits = totalCount;
    next()
  })
  .catch(error => {
    res.status(502).json({
      success: false,
      message: "Sorry something happenend on our end " + error
    })
  })
}

exports.getUnits = (req, res, next) => {
  let { pageNumber, sortBy } = req.query;
  let resultsPerPage = 6;
  let options = {
    sortBy: sortBy
  }

  if(pageNumber) {
    pageNumber = parseInt(pageNumber, 10);
  }

  let latest = {
    createdOn: '1'
  }

    Unit
    .paginate({}, pageNumber, resultsPerPage, function(error, pageCount, results) {
      if(error) {
        return res.status(302).json({
          message: "Sorry something happenend on our end.." + error
        })
      }
      console.log("Pagecount", pageCount)
      req.resources.unitsData = {
        pageNumber,
        resultsPerPage,
        pageCount,
        results
      }
      next();
    }, options);
}

//Uses elastic search but requires connection.
exports.getUnitsBySearch = (req, res, next) => {
  let { page, latest } = req.query;
  let resultsPerPage = 6;
    let search = req.body.search;
    if(search.length < 0) {
      return res.json({
        message: "Please enter a valid search.."
      })
    }
    Unit.find({
      $text : {
        $search: search
      }
    })
    .skip((page * resultsPerPage) - resultsPerPage)
    .limit(resultsPerPage)
    .sort(latest)
    .where('occupied', false)
    .where('isDeleted', false)
    .select('-isDeleted')
    .then(results=> {
        if (!results) {
            return res.status(401).json({
                success: true,
                message: "Sorry we could not find any info about :"+ search
            })
        }
        req.resources.searchResults = results;
        next();
    })
    .catch(error => {
      if(error.name == 'MongoError' && error.code === 11000) {
        return res.status(422).json({
          success: false,
          message: error.errors[message]
        })
      }

      // console.log("Error", error)
      res.status(500).json({
        message: "Sorry something happenend on our end :"+error
      })
    })
}

exports.getUnitByQuery = (req, res, next) => {
    let { price, rating, term, bathrooms, noOfRooms, area, name } = req.query;
    Unit.find()
    .where('name', name)
    .where('price', price)
    .where('rooms', noOfRooms)
    .where('rating', rating)
    .where('bathrooms', bathrooms)
    .where('term', term)
    .where('area', area)
    .populate('images')
    .exec()
    .then(unitsQ => {
        if(unitsQ.length <= 0) {
            return res.status(401).json({
                success: true,
                message: "Sorry we could not find any"
            })
        }
        req.resources.units = unitsQ;
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

exports.getUnitsByCategory =(req, res, next) => {
  let { category } = req.query;

  Unit.find({ category: category })
  .populate("images")
  .then(unitsQ => {
        if(unitsQ.length <= 0) {
            return res.status(401).json({
                success: true,
                message: "Sorry we could not find any"
            })
        }
        req.resources.units = unitsQ;
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

exports.getAllUnitLocations = (req, res, next) => {
    let location = req.resources.userLocation;
    Unit.find()
    .populate('location')
    .within(location)
    .then(locations => {
        if (!locations) {
            return res.status(404).json({
                success: false,
                message: "We could not find any"
            });
        }
        req.resources.unitLocations = locations;
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

exports.getUnitById = (req, res, next) => {
    let unitId = req.params.unitId;
    Unit.findOne({ _id : unitId })
    .where('isDeleted', false)
    .select('-isDeleted')
    .populate('images')
    .populate({
        path: 'reviews',
        select: 'rating message',
        populate: {
          path: 'userEntryId',
          select: 'name'
        }
    })
    .then(unit => {
        if (!unit) {
            return res.status(401).json({
                success: true,
                message: "Sorry we could not find more info"
            })
        }
        req.resources.unit = unit;
        next()
    })
    .catch(error => {
      if(error.name == 'MongoError' && error.code === 11000) {
        return res.status(422).json({
          success: false,
          message: error.errors[message]
        })
      }
      // console.log('error unit by id', error)
      res.status(500).json({
        message: "Sorry something happenend on our end"
      })
    })
}

exports.addUnitImages = async (req, res, next) => {
    let unit = req.resources.unit;
    let unitUrl;
    
    if (req.file) {
        const file = dataUri(req).content;
        return uploader
            .upload(file)
            .then(result => {
                unitUrl = result.url;
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
    let newUnitImage = new Image({
    
        unitEntryId: unit._id,
        url: unitUrl
    });
    newUnitImage.save()
    .then(result => {
        if(!result) {
            return res.status(401).json({
                success: true,
                message: "Sorry but we could not save the image"
            })
        }
        res.status(200).json({
            success: true,
            message: "Image saved successfully"
        })
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

exports.addUnit = (req, res, next) => {
    let wantedTerm;
    let { 
      name, 
      area, 
      street, 
      bathrooms, 
      category, 
      priceAnnual, 
      priceMonth, 
      noOfRooms, 
      term, 
      description, 
      completionYear, 
      securityLevel, 
      parking,
      company,
      unitNumber
    } = req.body;
    console.log("body", req.body);
    if(term == "rent") {
      wantedTerm = ['rental']
    } else if (term == "morgage") {
      wantedTerm = ['morgage']
    } else {
      wantedTerm = ['purchase']
    }
    // console.log("You have arrived here")
    let newUnit = new Unit({
        company,
        name: name,
        description: description,
        rooms: noOfRooms,
        term: wantedTerm,
        area: area,
        category,
        bathrooms: bathrooms,
        price: priceAnnual,
        priceMonth: priceMonth,
        streetname: street,
        completionYear: parseInt(completionYear), 
        securityLevel,
        parking,
        unitNumber: parseInt(unitNumber)
    });

    newUnit.save()
    .then(result => {
        if(!result) {
          return res.json({
            message : "Sorry we could not add the unit"
          })
        }
        req.resources.newUnit = result;
        next()
    })
    .catch(error => {
      // console.log("Error unit", error)
      if(error.errors.name == 'ValidatorError' && error.errors.kind == 'required') {
        return res.status(422).json({
          success: false,
          message: error.errors[message]
        })
      }
      res.status(500).json({
        message: "Sorry something happenend on our end :"+error
      })
    })
}

exports.addUnitReview = (req, res, next) => {
    let { message, rating } = req.body;
    let unitId = req.resources.unit._id;
    let userId = req.resources.userData._id;
    let unit = req.resources.unit;
    if (unit.reviews.length > 0 && unit.reviews.map(r => r.userEntryId).contains(userId)) {
        return err(
            new Error("Sorry you already added a comment"),
            { detail : 'Sorry you can not add another review..'}
        )
    }

    let newReview = new Review({
        unitEntryId: unitId,
        userEntryId: userId,
        rating: rating,
        message: message
    })

    newReview.save()
    .then(review => {
        if(!review) {
            return res.status(401).json({
                success: true,
                message: "Sorry we could not add your review"
            })
        }
        req.resources.unitReview = review;
        next()
    })
    .catch(error => {
      if(error.name == 'MongoError' && error.code === 11000) {
        return res.status(422).json({
          success: false,
          message: error.errors[message]
        })
      }
      // console.log("Unit review error", error)
      res.status(500).json({
        message: "Sorry something happenend on our end"
      })
    })
}

exports.updateUnit = (req, res, next) => {
    let unit = req.resources.unit;

    if(req.body._id) {
        delete req.body._id;
    }

    for(let prop in req.body) {
        unit[prop] = req.body[prop];
    }

    unit.save()
    .then(updatedUnit => {
        req.resources.unit = updatedUnit;
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


exports.deleteUnit = (req, res, next) => {
  let unit = req.resources.unit;

  unit.isDeleted = true;

  unit.save()
  .then(update => {
    res.json({
      success: true,
      message: "Successfully deleted the unit"
    })
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


exports.getUnitsByCategory = (req, res, next) => {
  let category = req.query.category;

  Unit.find({ category: category })
  .populate("images")
  .populate("location")
  .populate("reviews")
  .then(results => {
    if(!results) {
      res.status(303).json({
        success: true,
        message: "Sorry we could not get the category."
      })
    }
    req.resources.units = results;
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
