var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require("bcrypt");

var userSchema = new Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        default: false
    }
});

/*
* This "pre hook" will run before a .save() operation completes. We're going to use it to hash the password
* for a user before it gets saved to the database, so that way we don't have plain text passwords sitting
* there all vulnerable-to-attack.
* */
userSchema.pre("save", function (next) {
    // Save an outer reference to `this` so we can reference it from inside the bcrypt callback function
    var user = this;

    // Check if the password property is being modified in any way. If this is the first time we're saving
    // a new user, since the "password" is brand new, it is considered as being modified.
    // If the password isn't being changed, we can move along without hashing anything.
    if (!user.isModified("password")) return next();

    // Turn the provided password into a hashed version of itself, and reset the provided
    // password to its hashed version
    bcrypt.hash(user.password, 10, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
    });
});

// Since we've hashed the password, we wouldn't be able to log in again because the passwords wouldn't match
// anymore. This method uses bcrypt's `compare` method to see if the password provided by the user during login
// matches the hashed version of the password from the database. If it does, `isMatch` will be true.
// Check `authRoutes.js` to see the callback function we provide.
userSchema.methods.checkPassword = function (passwordAttempt, callback) {
    bcrypt.compare(passwordAttempt, this.password, function (err, isMatch) {
        if (err) return callback(err);
        callback(null, isMatch);
    });
};

// We don't have much use for sending the password over the wire to the client-side application since
// it's been hashed and is unrecognizable anyway. It also introduces a security flaw to send it over the wire,
// in case someone intercepts it and has a way to decrypt it. This method helps us remove it from the user object
// which we'll use right before sending it to the client-side application.
userSchema.methods.withoutPassword = function () {
    var user = this.toObject();
    delete user.password;
    return user;
};

module.exports = mongoose.model("User", userSchema);