var mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.pre('save', function (next) {
    //Trigger Function In Frameworks Called Hooks Or Middleware
    if (!this.created) {
        this.password = bcrypt.hashSync(this.password, saltRounds)
    }
    next();
});

userSchema.pre(['updateOne', 'findOneAndUpdate'], function (next) {
    //Trigger Function In Frameworks Called Hooks Or 
    //For Update Password Especially When U Want to Hashing The Password
    //Use _update.password to Access the Password in DB
    //Notes. Method Can be Changes Depend On when The Libray Updated 
    // console.log('modified', this._update.password)
    if (this._update.password) {
        this._update.password = bcrypt.hashSync(this._update.password, saltRounds)
    }
    next();
});

userSchema.methods.authenticate = function (password) {
    return bcrypt.compareSync(password, this.password); //this.password means the password that stored in the db
}

module.exports = mongoose.model('User', userSchema);
