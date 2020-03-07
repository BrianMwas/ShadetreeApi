const Review = require('../model/review');
const Unit = require('../model/unit')
exports.addGlobalReview = async (req, res, next) => {
    let review = req.body.review;
    let user = req.resources.userData;
    let typeOfReview;
    if(req.body.type == "overall") {
        typeOfReview = ['global']
    }
    let reviewUser = await Review.findOne({ userEntryId : user._id });

    if(!reviewUser) {
      let newReview = new Review({
          userEntryId: user._id,
          message: review,
          type: typeOfReview
      });


      newReview.save()
      .then(review => {
          req.resources.globalReview = review;
          next();
      })
      .catch(error =>{
        if(error.name == 'MongoError' && error.code === 11000) {
          return res.status(422).json({
            success: false,
            message: error
          })
        }
        console.log("Error", error);
        res.status(500).json({
          message: "Sorry something happenend on our end"
        })
      })
    } else {
      res.status(403).json({
        success: false,
        message: "Sorry the user already reviewed..."
      })
    }



}

exports.getSiteReviews = (req, res, next) => {
    Review.find()
    .where('type', "['global']")
    .populate('user')
    .then(siteReview => {
        req.resources.siteReviews = siteReview;
        next();
    })
    .catch(error=> {
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

exports.getUnitReviews = async (req, res, next) => {
  let id = req.params.unitId
  await Unit.findById(id)
  .populate({
    path: 'reviews',
    select: 'rating message -_id -unitEntryId',
    populate: {
      path: 'userEntryId',
      select: 'firstName lastName email -_id'
    }
  })
  .populate('images')
  .populate('location')
  .then(unit => {
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
    // console.log("Error unit", error)
    res.status(500).json({
      message: "Sorry something happenend on our end :"+error
    })
  })
}
