const mongoose = require('mongoose')
const validator = require('validator')

const doctorSchema = new mongoose.Schema({
    name:{
       firstName:{type:String, required:true},
       lastName:{type:String, required:true}
    },
    contact_no:{
        type: Number,
        required: true,
        validate(value){
            if(value.length!=10){
                throw new Error('Invalid concact no!')
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
    address:{
        houseNumber: String,
        street: String,
        city: String
    },
    degree:{
        type: String,
        required: true,
        trim: true
    },
    HID:{
        type: String,
    },
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

const Doctor = mongoose.model('Doctor', doctorSchema)

module.exports = Doctor