const User = require('../model/user');
const _ = require('lodash');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Review = require('../model/review');
const MAX_LIMIT = 0;
const SKIP = 0;

exports.activateAccount = (req, res, next) => {
  let userId = req.params.userId;
  User.findById(userId)
  .where('isDeleted', false)
  .select('-isDeleted')
  .then(user => {
    if (user.isActivated) {
      return res.status(304).json({
        message: "Sorry but your account is already activated."
      })
    } else {
      user.isActivated = true;

      user.save()
      .then(result => {
        if(result) {
          return res.json({
            message: "Your account is activated and you can proceed."
          })
        }
      })
      .catch(error => {
        console.log("Error from activating", error);
        res.json({
          message: "Sorry we were unable to activate your account. Please try again later."
        })
      })
    }
  })
  .catch(error => {
    console.log("Error from user", error)
    res.json({
      message: "Sorry but an error occurred."
    });
  });

};

exports.getAllUsers = (req, res, next) => {
    User.find()
    .where('roles', ["user"])
    .then(users => {
        if(users <= 0) {
            res.status(201).json({
                message: "We have zero users for now."
            })
        }
        req.resources.allUsers = users.length;
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

exports.getTotalUsers = (req, res, next) => {
  User.find()
  .where('roles', ["user"])
  .then(totalCount => {
    if(totalCount.length <= 0) {
      return res.status(201).json({
        message: "Sorry you dont have any users"
      })
    }
    req.resources.totalRegularUsers = totalCount.length;
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
            success: false,
            message: "Sorry something happenend on our end :"+error
          })
        })
}

exports.getTotalAgents = (req, res, next) => {
  User.find()
  .where('roles', ["agent"])
  .then(totalCount => {
    if(totalCount.length <= 0) {
      return res.status(201).json({
        message: "Sorry you dont have any agents"
      })
    }
    req.resources.totalAgents = totalCount.length;
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
            success: false,
            message: "Sorry something happenend on our end :"+error
          })
        })
}

exports.getTotalOwners = (req, res, next) => {
  User.find()
  .where('roles', ["owner"])
  .then(totalCount => {
    if(totalCount.length <= 0) {
      return res.status(201).json({
        message: "Sorry you dont have any owners"
      })
    }
    req.resources.totalOwners = totalCount.length;
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
            success: false,
            message: "Sorry something happenend on our end :"+error
          })
        })
}

exports.getAllAgents = (req, res, next) => {
    User.find()
        .where('isDeleted', false)
        .select('-isDeleted')
        .where('roles', ["agent"])
        .where('isActivated', true)
        .populate('profile')
        .populate('reviews')
        .then(agents => {
            console.log("Agents", agents)
            if(agents.length <= 0) {
              return res.json({
                message: "Sorry there aren't any agents yet.."
              })
            }
            req.resources.agents = agents;
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
            success: false,
            message: "Sorry something happenend on our end :"+error
          })
        });
};

exports.getAgentById = (req, res, next) => {
    if(!ObjectId.isValid(req.params.agentId)) {
        return res.status(404).json({
            message: "Sorry we could not find the agent",
            success: false
        })
    }
    let agentId = req.params.agentId;
    User.findOne({
      _id: agentId
    })
    .select('isDeleted')
    .where('isDeleted').equals(false)
    .where('roles', ["agent"])
    .populate('profile')
    .populate({
      path: 'reviews',
      select: '-_id rating message',
      options: { limit : 5},
      populate :{
        path: 'userEntryId'
      }
    })
    .then(agent => {
      if(!agent) {
        return res.status(403).json({
          success: true,
          message: "We could not find the agent."
        })
      }
      req.resources.agent = agent;
      next();
    })
    .catch(error => {
      if (error.name == 'MongoError' && error.code === 11000) {
        return res.status(422).json({
          success: false,
          message: error.errors[message]
        });
      }
      res.status(500).json({
        success: false,
        message: "Sorry something happenend on our end :" + error
      })
    })
}

exports.addAgentReview = (req, res, next) => {
    let { message, rate } = req.body;
    let agentId = req.resources.agent._id;
    let userId = req.session.passport.user
    let agent = req.resources.agent;
    if (agent.reviews.length > 0 && agent.reviews.map(r => r.userEntryId).contains(userEntryId)) {
        return err(
            new Error("Sorry you already added a review"),
            { detail: 'Sorry you can not add another review..' }
        );
    }

    let newReview = new Review({
        agentEntryId: agentId,
        userEntryId: userId,
        rating: rate,
        message: message
    });

    newReview.save()
        .then(review => {
            if (!review) {
                return res.status(401).json({
                    success: true,
                    message: "Sorry we could not add your review"
                });
            }
            req.resources.agentReview = review;
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

exports.getByQuery = (req, res, next) => {
    let query = req.query;
    let skip = req.query.skip || SKIP;
    let limit = req.query.limit || MAX_LIMIT;
    // console.log("Query", query);
    User.find({
      $or : [{
        firstName: query.firstName
      }, {
        secondName: query.secondName
      }]
    })
    // .select('isDeleted')
    .where('isDeleted').equals(false)
    .where('roles', ['agent'])
    .populate('profile')
    .skip(skip)
    .limit(limit)
    .then(agents => {
        if(agents.length <= 0) {
          return res.status(309).json({
            message : "We could not find any agent by the search"
          });
        }
        req.resources.agents = agents;
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

};

exports.getUserById = (req, res, next) => {
    if(!ObjectId.isValid(req.params.userId)) {
        return res.status(404).json({
            success: false,
            message : "Sorry we didnt't find the resource"
        });
    }
    User.findById({_id: req.params.userId})
    .then(user => {
      if(!user) {
        return res.status(409).json({
          message: "Sorry we could not find you..."
        })
      }
        req.resources.user = user;
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

exports.updateUser = (req, res, next) => {
   let AuthUser = req.resources.userData;
    if (req.body._id) {
      delete req.body._id;
    }
    let data = _.pick(req.body, ["firstName", "secondName", "email", "telephone"]);


  _.assign(AuthUser, data);

    AuthUser.save()
    .then(user => {
      req.resources.user = user;
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
};

exports.deleteUser = (req, res, next) => {
    let user = req.resources.user;
    User.findByIdAndUpdate(user._id, '+isDeleted', { isDeleted: true} ,{new : true})
    .then(deletedUser => {
        res.status(200).json({
            success: true,
            message: "You have successfully deleted the user."
        });
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
