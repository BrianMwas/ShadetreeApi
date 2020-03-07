const Company = require('../model/company');
const Profile = require('../model/profile');
const Image = require('../model/images');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const LEAST_PREFERRED_RATING = 5;
const Company_name = "";
const isCompleted = true;
const _ = require('lodash');


exports.createCompany = (req, res, next) => {
    let companyInfo = req.body;
    let newCompany = new Company({
        owner: companyInfo.owner,
        name: companyInfo.name,
        description: companyInfo.description,
        email: companyInfo.email,
        website: companyInfo.website,
        phoneNumber: companyInfo.phoneNumber,
        fullyCompleted: true
    });
    newCompany.save()
    .then(company => {
      if(!company) {
        return res.json({
          message: "Sorry we could not add your company"
        })
      }

        res.status(200).json({
            success: true,
            message: "Company creation was successful",
            data: company
        });
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
    });
};

exports.getTotalCompanies = (req, res, next) => {
  Company.find()
  .then(totalCount => {
    if(totalCount.length <= 0) {
      return res.status(201).json({
        message: "No companies yet"
      })
    }
    req.resources.totalCompanies = totalCount.length;
    next()
  })
  .catch(error => {
    res.status(502).json({
      message: "Sorry something happened on our end "+ error
    })
  })
}

exports.getCompanyById = (req, res, next) => {
  let companyId = req.params.companyId;
  Company.findById(companyId)
  .populate('profile')
  .populate("agents")
  .then(company => {
    if(!company) {
      return res.status(200).json({
        success : true,
        message: "We could not find the company."
      })
    }
    req.resources.company = company;
    next();
  })
  .catch(error => {
    res.status(403).json({
      message: "Sorry we could not fetch the resource."
    })
  })
}

exports.getAllCompanies = (req, res, next) => {
    Company.find()
    .populate('agents')
    .populate('profile')
    .then(companies => {
        if (companies.length <= 0) {
            return res.status(404).json({
                success: false,
                message: "We could not find any. Be the first to add!!"
            });
        }
        req.resources.companies = companies;
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

exports.getAllCompaniesByQuery = (req, res, next) => {
    let { name, completed, category } = req.query;

    Company.find({
      $or: [
        {
          name: name
        },
        {
          fullyCompleted: completed
        }, 
        {
          category: category
        }
      ]
    })
    .populate('profile')
    .then(companies => {
        if (companies.length <= 0) {
            return res.status(404).json({
                success: false,
                message: "We could not find any"
            });
        }
        req.resources.companies = companies;
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

exports.getBySingleSearch = (req, res, next) => {
  let search = req.body.search;
  if(search.length < 0) {
    return res.json({
      message: "Please enter a valid search.."
    })
  }

    // Company.search({
    //   query_string: {
    //     query: search
    //   }
    // }, {
    //   hydrate: true
    // }
    // ).then(companies => {
    //   if(!companies) {
    //     return res.status(409).json({
    //       message: "Sorry but we could not find any company related to :"+search
    //     })
    //   }
    //
    //   req.resources.companies = companies;
    //   next();
    // })
    // .catch(error => {
    //   if(error.name == 'MongoError' && error.code === 11000) {
    //     return res.status(422).json({
    //       success: false,
    //       message: error.errors[message]
    //     })
    //   }
    //   res.status(500).json({
    //     message: "Sorry something happenend on our end"
    //   })
    // })

  Company.search({
    query_string : {
      query : search
    }
  },  { hydrate : true }, function (error, results) {
      if(error) throw error;
      req.resources.companies = results;
      next();
  })
}

exports.getCompanyBySlug = (req, res, next) => {
    let slug = req.params.companySlug;
    Company.findOne({slug : slug})
    .populate('profile')
    .then(company => {
        if(!company) {
            return res.status(404).json({
                success: false,
                message : "We could not find a company by that name"
            });
        }
        req.resources.company = company;
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

exports.updateCompany = async (req, res, next) => {
    var data = await _.pick(req.body, ['name', 'phoneNumber', 'email', 'website', 'description']);
    if(req.resources.company.fullyCompleted == false) {
        data.fullyCompleted = req.body.fullyCompleted;
    }

    await _.assign(req.resources.company, data);

    await req.resources.company.save()
    .then(updatedCompany => {
        req.resources.company = updatedCompany;
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
    });
};

exports.updateByPatch = (req, res, next) => {
  let company = req.resource.company;
  if(req.body._id) {
    delete req.body._id;
  }

  for(let prop in req.body) {
    company[prop] = req.body[prop];
  }

  company.save()
  .then(updatedCompany => {
    req.resources.company = updatedCompany;
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

exports.addAgents = async (req, res, next) => {
    // let includes = await _.includes(req.resources.company.agents, req.body.agent);
    // console.log("includes", includes)
    // if(includes) {
    //     return res.status(409).json({
    //         message: "User is already an agent at your company",
    //         type: "already_member"
    //     })
    // }
    for (var i = 0; i < req.resources.company.agents.length; i++) {
      if(req.body.agent == req.resources.company.agents[i]) {
        return res.status(409).json({
            message: "User is already an agent at your company",
            type: "already_member"
        })
      }
    }

    await req.resources.company.agents.push(req.body.agent)
    await req.resources.company.save()
    .populate("agents")
    .then(updatedCompany => {
        req.resources.company = updatedCompany;
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

exports.removeCompanyAgents = (req, res, next) => {
    // let includes = _.includes(req.resources.company.agents, req.body.agent);
    let includes;
    for (var i = 0; i < req.resources.company.agents.length; i++) {
      if(req.body.agent == req.resources.company.agents[i]) {
        includes = true
      } else {
        includes = false;
      }
    }
    if(!includes) {
        return res.status(409).json({
            success: false,
            message: 'User is not an agent of your company'
        });
    }

    Company.findOneAndUpdate(req.params.companyId, { $pull : { agents: req.body.agent } }, { safe: true, upsert: true }, (error, company) => {
        if(error) {
          if(error.name == 'MongoError' && error.code === 11000) {
            return res.status(422).json({
              success: false,
              message: error.errors[message]
            })
          }
          res.status(500).json({
            message: "Sorry something happenend on our end"
          })
        }
        res.status(200).json({
          success: true,
          message: "You have successfully removed the agent.."
        })
        req.resources.company = company;
        next();
    })
}
