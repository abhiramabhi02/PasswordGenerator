const mongoose = require('mongoose')

let connectionString = "mongodb://0.0.0.0:27017/PassGen"

const connectDb = mongoose.connect(connectionString)

module.exports = {
    connectDb
}