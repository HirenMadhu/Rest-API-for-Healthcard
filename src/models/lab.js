const mongoose = require('mongoose')
const validator = require('validator')

const labSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
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
//     type:{
//         type:String,
//         required: true,
//    }, 
    labDoctors:[{
        type:String
    }],
    reportHistory:[{
        type:String
    }]
})

const Lab = mongoose.model('Lab', labSchema)

module.exports = Lab