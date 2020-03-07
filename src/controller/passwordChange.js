
const Token = require('../model/token');
const User = require('../model/user');



exports.forgotPassword = (req, res, next) => {
    let { newPassword, repeatPassword } = req.body;

    if(!newPassword || !repeatPassword ) return res.status(422).json({ message : "Please fill in all fields for full change"});

    if(newPassword !== repeatPassword) {
        return res.json({
            success: false,
            message: "Sorry your passwords don't match"
        })
    }
    Token.findOne({
        hash : req.params.resetToken
    })
    .where('expiresAt').gt(Date.now())
    .then(result => {
        let user = result.user;

        delete result.hash;
        delete result.expiresAt;

        console.log("Result", result);
        
        User.forgotPassword(user, newPassword, (error, result) => {
            if (error) return res.status(401).json({ success: false, message: "Sorry but " + error });
            res.status(200).json(result);
        })

        // User.changePassword(user, oldPassword, newPassword, function(error, result) {
        //     if (error) return res.status(401).json({ success: false, message : "Sorry but "+error});
        //     res.status(200).json(result);
        // })

        // user.changePassword(oldPassword, newPassword, function(error, result) {
        //     if (error) return res.status(401).json({ success: false, message : "Sorry but "+error});

        //     res.status(200).json(result);
        // })
    })
    .catch(error => {
        console.log("Password change error", error)
        res.status(422).json({
            success: false,
            message: "Sorry something happenend on our end..."
        })
    })
}


exports.changePassword = (req, res, next) => {
    let user = req.resources.userData;

    let { oldPassword, newPassword } = req.body;

    User.changedPassword(user.id, oldPassword, newPassword, (error, result) => {
        if (error) return res.status(401).json({ success: false, message: "Sorry but " + error });

        res.status(201).json(result);
    })
}