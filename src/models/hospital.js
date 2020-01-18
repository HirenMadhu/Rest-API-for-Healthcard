const mongoose = require('mongoose')
const validator = require('validator')

const hospitalSchema = new mongoose.Schema({
    name:{
        type: String,
        required : true,
    },
    phoneNo:{
        type: Number,
        required: true,
        validator(value){
            if(value.length != 11){
                throw new error('Invalid Phone Number')
            }
        }
    },
    email:{
        type: String,
        required: true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Invalid email adresss!')
            }
        }
    },
    Address:{
        addressLine1:String,
        addressLine2:String,
        area:String,
        city:String,
        pincode: Number,
    },
    type:{
        type:String,
        required: true,
    },
    doctors:[{
        type:String
    }],
    cases_handled:[{
        type: String
    }],
    password:{
        type:Number,
        required: true,
        min: 100000,
        max: 999999
    }
}) 

const Hospital = new mongoose.model('Hospital', hospitalSchema)

module.exports = Hospital