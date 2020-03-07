const Address = require('../model/address.model');

exports.getAddress = function (req, res, next) {
  let user = req.resources.user;
  return Promise.all([
    Address.find({user: user})
    .limit(Number(req.pageSize))
    .skip(Number((req.page - 1) * req.pageSize))
    .sort({createdAt: 'desc'})
    .exec(),
    Address.count({user: req.user}).exec()
  ]).then(function (results) {
    const address = results[0];
    const addressCount = results[1];

    return res.json({
      message: "Success",
      data : {
        count: addressCount,
        address
      }
    })
  }).catch((error) => {
    return res.json(error);
  })
}


exports.createAddress = (req, res, next) => {
  const errors = [];
  const { zipCode, city, country, address } = req.body;


  if(!city || city.trim() == "")
    errors.push("City name is required");

  if(!zipCode || zipCode.trim() == "")
      errors.push("Zip code is required");

  if(!country || country.trim() == "")
      errors.push("Country is required");

  if(!address || address.trim() == "")
      errors.push("Address is required");


  let userId = req.resources.userData._id;



  if(errors.length > 0) {
    res.status(401).json({
      success: false,
      message : errors
    })
  } else {
    const addr = new Address({
      user: userId,
      zipCode: zipCode,
      country: country,
      city: city
    });

    addr.save()
    .then(result => {
      if(!result) {
          return res.status(400).json({
              message: "Sorry we could not save your address"
          });
      }
      res.status(200).json({
        message: "Address added successfully."
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
        message: "Sorry something happenend on our end :"+error
      });
    });
    })
  }
}

exports.getAddressDetails = (req, res, next) => {
  let order = req.resource.order;


}
