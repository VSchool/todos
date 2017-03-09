var express = require("express");
var authRoutes = express.Router();
var User = require("../models/user");
var jwt = require("jsonwebtoken");
var config = require("../config");

authRoutes.post("/signup", function (req, res) {
    console.log(req.headers);
    User.find({email: req.body.email}, function (err, existingUser) {
        console.log(err);
        if (err) return res.status(500).send(err);
        if (existingUser.length) return res.send({success: false, message: "That email is already taken. Did you mean to log in?"});

        var newUser = new User(req.body);
        newUser.save(function (err) {
            if (err) return res.status(500).send(err);
            res.status(201).send({success: true, user: newUser, message: "Successfully created a new user!"});
        });
    });
});

authRoutes.post("/login", function (req, res) {
    User.findOne({email: req.body.email}, function (err, user) {
        if (err) return res.status(500).send(err);
        if (!user) {
            return res.status(401).send({success: false, message: "Invalid email or password"});
        }

        // Here we use the `checkPassword` method we added to the userSchema in `user.js` to check the incoming
        // password against the one saved in the database. If it matches, only then will we send the JWT.
        user.checkPassword(req.body.password, function (err, isMatch) {
            if (err) return res.status(403).send(err);
            if (!isMatch) return res.status(403).send({success: false, message: "Invalid email or password"});
            var token = jwt.sign(user.toObject(), config.secret, {expiresIn: "24h"});

            // Here we use the `withoutPassword` method we added to the userSchema so our client app doesn't even
            // receive the hashed version of the password.
            res.send({token: token, success: true, user: user.withoutPassword(), message: "Here's your token!"});
        });
    });
});

module.exports = authRoutes;