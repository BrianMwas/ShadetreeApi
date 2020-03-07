
const Profile = require('../model/profile');
const CompanyProfile = require('../model/companyProfile.model')
const { uploader } = require('../../config/imagesConfig/cloudinaryConfig');
const {  dataUri } = require('../../config/imagesConfig/multer');

exports.createUserProfile = (req, res, next) => {
    // console.log("Req file", req.file)
  let profileURL;
  if (req.file) {
    const file = dataUri(req).content;
    return uploader
      .upload(file)
      .then(result => {
        profileURL = result.url;
         let data = req.body;

        let userProfile = new Profile({
          userEntryId: req.resources.userData._id,
          firstName: data.firstName,
          secondName: data.secondName,
          profileImage: profileURL,
          description: data.description,
          telephoneNumber: data.telephoneNumber
        });

        console.log("profileURL", profileURL)
        userProfile.save()
        .then(profile => {
            if(!profile) {
                return res.status(400).json({
                    message: "Sorry we could not save the profile"
                });
            }
            req.resources.userProfile = profile;
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
            message: "Sorry something happenend on our end p:"+error
          });
        });
      })
      .catch(error => {
        if (error.name == 'MongoError' && error.code === 11000) {
          return res.status(422).json({
            success: false,
            message: error.errors[message]
          })
        }
        console.log("Error", error)
        res.status(500).json({

          message: "Sorry something happenend on our end :" + error
        })
      })
  } else if (!req.file) {
    res.json({
      message: "Please add the image"
    })
  }
}

exports.createCompanyProfile = (req, res, next) => {
    const companyEntryId = req.resources.company._id;
    let profileUrl;
    if(req.file) {
        const file = dataUri(req).content;
        return uploader
        .upload(file)
        .then(result => {
            profileUrl = result.url;
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
    const companyProfile = new CompanyProfile({
      fullName : req.body.fullName,
      companyWebsiteURL: req.body.companyURL,
      telephoneNumber: req.body.phoneNumber,
      description: req.body.description
    });
    companyProfile.companyEntryId = companyEntryId;
    companyProfile.profileImage = profileUrl;
    companyProfile.save()
    .then(companyProfile => {
        if(!companyProfile) {
            res.status(400).json({
                message: "Sorry we could not save the profile"
            });
        }

        req.resources.companyProfile = companyProfile;
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
    });
};

exports.showCompanyProfile = (req, res, next) => {
    const companyId = req.resources.company._id;
    Profile.findOne({ companyEntryId: companyId })
        .then(profile => {
            if (!profile) {
                res.status(400).json({
                    message: "Sorry but you don't have a profile"
                });
            } else {
                req.resources.companyProfile = profile;
                next();
            }
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
        });
};

exports.showEstateProfile = (req, res, next) => {
    const estateId = req.resources.estate._id;
    Profile.findOne({ estateEntryId: estateId })
        .then(profile => {
            if (!profile) {
                res.status(400).json({
                    message: "Sorry but you don't have a profile"
                });
            } else {
                req.resources.estateProfile = profile;
                next();
            }
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
        });
}

exports.createUnitProfile = (req, res, next) => {
    const unitId = req.resources.unit._id;
    let profileUrl;
    if (req.file) {
        const file = dataUri(req).content;
        return uploader
            .upload(file)
            .then(result => {
                profileUrl = result.url;
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
    const unitProfile = new Profile(req.body);
    unitProfile.unitEntryId = unitId;
    unitProfile.profileImage = profileUrl;
    unitProfile.save()
        .then(profile => {
            if (!companyProfile) {
                res.status(400).json({
                    message: "Sorry we could not save the profile"
                });
            }

            req.resources.unitProfile = profile;
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

exports.updateUserProfile = (req, res, next) => {
  let userId = req.resources.user._id;
  let profileURL;
  let { awards } = req.body;
  if (req.file) {
      const file = dataUri(req).content;
      return uploader
        .upload(file)
        .then(result => {
            profileURL = result.url;
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

  Profile.updateOne(
    {
      userEntryId: userId
    },
    {
        profileImage: profileURL,
        awards: awards
    },
    {
      new: true,
      upser: true
    }
  ).then(userProfile => {
    if(!userProfile) {
      return res.status(401).json({
        success: true,
        message : "Sorry we were unable to update..."
      })
    }
    req.resources.userProfile = userProfile;
    next();
  })
  .catch(error => {
    res.status(500).json({
      success: false,
      message: "Sorry we could not complete your request :"+error
    })
  })
}

exports.updateCompanyProfile = (req, res, next) => {
  let userId = req.resources.company._id;
  let profileURL;
  let { awards } = req.body;
  if (req.file) {
      const file = dataUri(req).content;
      return uploader
        .upload(file)
        .then(result => {
            profileURL = result.url;
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

  Profile.updateOne(
    {
      companyEntryId: userId
    },
    {
        profileImage: profileURL,
        awards: awards
    },
    {
      new: true,
      upsert: true
    }
  ).then(companyProfile => {
    if(!userProfile) {
      return res.status(401).json({
        success: true,
        message : "Sorry we were unable to update..."
      })
    }
    req.resources.companyProfile = companyProfile;
    next();
  })
  .catch(error => {
    res.status(500).json({
      success: false,
      message: "Sorry we could not complete your request :"+error
    })
  })
}
