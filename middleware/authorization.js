const User = require('../src/model/user');

function authorizeOnlyToCompanyMembers(req, res, next) {
    // check if user is member of company
    let agents = req.resources.company.agents;
    let isMember;
    if(agents.length <= 0) {
      isMember = req.resources.company.agents.find((member) => {
          return member.toString() === req.session.passport.user.toString();
      });
    }

    // console.log("Sessioned user :", req.session)
    const owner = req.resources.company.owner.toString() === req.session.passport.user.toString();

    if (!owner && !isMember) {
        return res.status(403).json({
            message: 'Unauthorized'
        });
    }

    next();
}


function authorizeOnlyToCompanyOwner(req, res, next) {
    const isOwner = req.resources.company.owner.toString() === req.user._id.toString();

    if (!isOwner) return res.status(403).json({ message: 'Unauthorized' })

    next()
}

function authorizeOnlySelf(req, res, next) {
    console.log("Session", req.session);
    const userId = req.session.passport.user;
    User.findById(userId)
    .then(user => {
        if (!user) return res.status(403).json({ message: 'Unauthorized' });
        req.resources.userData = user;
        next();
    })
    .catch(error => {
        next(error);
    })
}


function authorizationOnlyToSessionedOwners(req, res, next) {
    const userId = req.session.passport.user;
    User.findById(userId)
    .then(user => {
      const isOwner = user.roles[0] = "owner";
      if(!isOwner) return res.status(403).json({ message: "Unauthorized" });

      req.resources.userData = user;
      next();
    })
    .catch(error => {
        next(error);
    })

}

function authorizationOnlyToOwners(req, res, next) {
    console.log("session", req.session)
    const userId = req.session.passport.user;
    User.findById(userId)
    .then(user => {
      const isOwner = user.roles[0] = "owner";
      if(!isOwner) return res.status(403).json({ message: "Unauthorized" });

      req.resources.userData = user;
      next();
    })
    .catch(error => {
        next(error);
    })

}

function authorizationOnlyToCustomers(req, res, next) {
  if (!req.session.passport) {
      return res.json({
        success: false,
        message: "Please log in first"
      })
  }
  const userId = req.session.passport.user;

  User.findById(userId)
  .then(user => {
    const isOwner = user.roles[0] = "owner";
    const isAgent = user.roles[0] = "agent"

    if(user.roles == ['user']) {
      console.log('User', user)
    }
    if(user.roles == ['owner'] && user.roles == ['agent']){
       return res.status(403).json({ message: "You can't comment on your own work let other's do it for you..." });
    } else {
      req.resources.userData = user;
      next();
    }
  })
  .catch(error => {
    console.log("Auth error customer", error)
      next(error);
  })
}


function authorizeToAdmin(req, res, next) {
  let user = req.session.passport.user;

  User.findById(user)
  .then(user => {
    console.log("admin", user)
    if(!user.isAdmin) {
      return res.status(403).json({
        message: "Unauthorized."
      })
    } else {
      next()
    }
  })
  .catch(error => {
    console.log("Auth error admin", error)
      next(error);
  })
  
}

module.exports = {
    authorizeOnlyToCompanyMembers,
    authorizeOnlySelf,
    authorizeOnlyToCompanyOwner,
    authorizationOnlyToOwners,
    authorizationOnlyToSessionedOwners,
    authorizationOnlyToCustomers,
    authorizeToAdmin
}
