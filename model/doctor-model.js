const mongoose = require('mongoose')

const Doctor = new mongoose.Schema({
    name: String,
    password: String,
    imageURL: String,
    patients: { type: [String], default: Array() },
})

module.exports = mongoose.model('Doctor', Doctor);