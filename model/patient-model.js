const mongoose = require('mongoose')

const Patient = new mongoose.Schema({
    name: String,
    password: String,
    imageURL: String,
    email: String,
    doctors: { type: [String], default: Array() },
    appointments: { type: [{ doctor: String, date: Date }], default: Array() },
    medSchedule: { type: [{ med: String, quantity: Number, period: Number, next: Date }], default: Array() },
    credit: { type: Number, default: 0 }
})

module.exports = mongoose.model('Patient', Patient);