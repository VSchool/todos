var express = require("express");
var profileRoutes = express.Router();
var User = require("../models/user");

profileRoutes.put("/me", function (req, res) {
    User.findById(req.user._id, function (err, user) {
        if (err) return res.status(500).send(err);
        if (!user) return res.status(403).send({success: false, message: "No valid user found"});

        for (var key in req.body) {
            if (user.toObject().hasOwnProperty(key)) {
                user[key] = req.body[key] || user[key];
            }
        }

        user.save(function (err) {
            if (err) return res.status(500).send(err);
            res.send({success: true, message: "Updated the user object", user: user.withoutPassword()});
        });
    });
});

module.exports = profileRoutes;