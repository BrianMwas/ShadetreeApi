const mongoose = require('mongoose');
const Estate = require('../model/estate');
const Image = require('../model/images');
const { uploader } = require('../../config/imagesConfig/cloudinaryConfig');
const { dataUri } = require('../../config/imagesConfig/multer');
const moment = require('moment');

exports.getEstates = (req, res, next) => {
    Estate.find()
    .where('isDeleted', false)
    .populate({
      path: "images",
      match: { 'isDeleted' : false }
    })
    .populate('profile')
    .populate('units')
    .then(estates => {
        if(estates.length <= 0) {
            return res.status(401).json({
                success: false,
                message: "Sorry we don't have any estates yet"
            })
        }
        req.resources.estates = estates;
        next();
    })
    .catch(error =>{
      // console.log("error", error)
      if(error.name == 'MongoError' && error.code === 11000) {
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

exports.getEstatesTotal = (req, res, next) => {
  console.log("estate")
  Estate.find()
  .where('isDeleted', false)
  .estimatedDocumentCount()
  .then(totalEstates => {
    if(totalEstates <= 0) {
      return res.status(201).json({
        message: "Sorry no estate yet..."
      })
    }

    req.resources.totalEstates = totalEstates;
    next()
  })
  .catch(error => {
      if(error.name == 'MongoError' && error.code === 11000) {
        return res.status(422).json({
          success: false,
          message: error.errors[message]
        })
      }
      res.status(500).json({
        message: "Sorry something happenend on our end 4:"+error
      })
    })
}

exports.getEstateByQuery = (req, res, next) => {
    let { name, street} = req.query;
    Estate.find({
      $or: [
        {
          name: name
        },
        {
          street : street
        }
      ]
    })
    // .select('isDeleted')
    // .where('isDeleted', false)
    .populate('images')
    .populate('profile')
    .populate('units')
    .populate('location')
    .then(estates => {
        if(!estates) {
            return res.status(401).json({
                success: true,
                message: "Sorry we could not find any"
            })
        }
        req.resources.estates = estates;
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
        message: "Sorry something happenend on our end :"+error
      })
    })

}

exports.getAllEstateLocation = (req, res, next) => {
    let location = req.resources.userLocation;
    Estate.find()
        .select('isDeleted')
        .where('isDeleted', false)
        .populate('location')
        .within(location)
        .then(locations => {
            if (!locations) {
                return res.status(404).json({
                    success: false,
                    message: "We could not find any"
                });
            }
            req.resources.estateLocations = locations;
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
            message: "Sorry something happenend on our end 1"
          })
        })
}

exports.getEstateById = (req, res, next) => {
    Estate.findById(req.params.estateId)
    // .select('isDeleted')
    .where('isDeleted', false)
    .populate('images')
    .populate('profile')
    .populate('units')
    .populate('location')
    .then(estate => {
        if(!estate) {
            return res.status(401).json({
                success: false,
                message: "Sorry we could not find the estate details."
            })
        }
        req.resources.estate = estate;
        next()
    })
    .catch(error => {
      if(error.name == 'MongoError' && error.code === 11000) {
        return res.status(422).json({
          success: false,
          message: error.errors[message]
        })
      }
      res.status(500).json({
        message: "Sorry something happenend on our end "+error
      })
    })
}

exports.getEstateBySlug = (req, res, next) => {
    Estate.findOne({
        slug: req.params.estateSlug
    })
    .populate('images')
    .populate('profile')
    .populate('units')
    .populate('location')
    .then(estate => {
        if (!estate) {
            return res.status(401).json({
                success: false,
                message: "Sorry we could not find the estate details."
            })
        }
        req.resources.estate = estate;
        next()
    })
    .catch(error => {
      // console.log("Error", error);
      if(error.name == 'MongoError' && error.code === 11000) {
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

exports.getEstateTotal =(req, res, next) => {
  // console.log("We have arrived...")
    Estate.find({
      $where : {
        isDeleted: false
      }
    })
    // .where('isDeleted', false)
    .estimatedDocumentCount()
    .then(total => {
        if(total <= 0) {
            return res.status(201).json({
                success: true,
                message: "We have no estates yet."
            })
        }

        req.resources.totalEstates = total;
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
        message: "Sorry something happenend on our end :" + error
      })
    })
}

exports.addEstate = (req, res, next) => {
    let userId = req.resources.userData._id;
    let { name, parking, street, built, areaSafety } = req.body;
    if(!moment(built).isValid()) {
      return res.status(403).json({
        message: "Sorry you have entered an invalid built date."
      })
    }
    let newEstate = new Estate({
        userIdEntry: userId,
        name: name,
        parking: parking,
        street: street,
        built: moment(built, "yyyy-mm-dd"),
        areaSafety: areaSafety
    });

    newEstate.save()
    .then(result => {
        if(!result) {
            return res.status(400).json({
                success: true,
                message: "Sorry but we could not save the estate"
            })
        }
        res.status(201).json({
            success: true,
            message : "We have successfully added the estate"
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
        message: "Sorry something happenend on our end 1 :"+error
      })
    })
};

exports.addCompanyEstate = (req, res, next) => {
    let companyId = req.resources.company._id;
    let { name, parking, street, built, areaSafety } = req.body;
    let newEstate = new Estate({
        companyIdEntry: companyId,
        name: name,
        parking: parking,
        street: street,
        built: built,
        areaSafety: areaSafety
    });

    newEstate.save()
    .then(result => {
        if (!result) {
            return res.status(400).json({
                success: true,
                message: "Sorry but we could not save the estate"
            })
        }
        res.status(201).json({
            success: true,
            message: "We have successfully added the estate"
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
        message: "Sorry something happenend on our end 1 1"
      })
    })
}

exports.addEstateImage = (req, res, next) => {
    let estate = req.resources.estate;
    let { tags } = req.body;
    let estateImageUrl;
    if (req.file) {
        const file = dataUri(req).content;
        return uploader
            .upload(file)
            .then(result => {
                estateImageUrl = result.url;
            })
            .catch(error => {
              if(error.name == 'MongoError' && error.code === 11000) {
                return res.status(422).json({
                  success: false,
                  message: error.errors[message]
                })
              }
              res.status(500).json({
                message: "Sorry something happenend on our end 1 1"
              })
            })
    }
    let newEstateImage = new Image({
        estateEntryId: estate._id,
        tags: tags,
        url: estateImageUrl
    })

    newEstateImage.save()
    .then(result => {
        if(!result) {
            return res.status(401).json({
                success: true,
                message: "Sorry we could not save the image."
            })
        }

        res.status(200).json({
            success: true,
            message:"We successfully added the estate image."
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
        message: "Sorry something happenend on our end 1 1"
      })
    })
}

exports.updateEstate = (req, res, next) => {
    let estate = req.resources.estate;
    let update = { name: req.body.name, parking: req.body.parking, street: req.body.parking, areaSafety: req.body.safety } = req.body;
    estate.updateOne(update)
    .then(result => {
        if (!result) {
            return res.status(401).json({
                success: true,
                message: "Sorry we could not save the estate."
            })
        }
        res.status(201).json({
            success: true,
            message: "You have successfully updated the estate"
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
        message: "Sorry something happenend on our end 1 1"
      })
    })
}

exports.removeEstate = (req, res, next) => {
    let estateID = req.resources.estate._id;
    Estate.findOneAndUpdate(
        {
        _id: estateID
          },
          {
              isDeleted: true
          }, {
              safe: true,
              upsert: true
          }
    ).then(result => {
        if (!result) {
            return res.status(401).json({
                success: true,
                message: "Sorry we could not save the estate."
            })
        }
        res.status(201).json({
            success: true,
            message: "You have successfully deleted the estate"
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
        message: "Sorry something happenend on our end 1 1"
      })
    })
}
