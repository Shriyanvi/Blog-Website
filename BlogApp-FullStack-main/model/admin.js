const mongoose = require('mongoose');

let adminSchema = new mongoose.Schema({
    username : String,
    password : String,
    email: String
})

module.exports = mongoose.model('Admin', adminSchema);