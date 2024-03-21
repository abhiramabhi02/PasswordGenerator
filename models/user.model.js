const mongoose = require('mongoose')

const user = mongoose.Schema({
    Email:{
        type:String,
        required:true
    },
    Password:{
        type:String,
        required:true
    },
    Pass:{
        type:Array
    }
})

module.exports = mongoose.model('user', user)