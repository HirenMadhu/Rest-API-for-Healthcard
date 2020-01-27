const mongoose = require('mongoose')
const validator = require('validator')

const prefix = 'M'
var nextID = 1
var ID = 'M000000'


const medicalSchema = new mongoose.Schema({
    MID:{
        type: String,
        required: true,
        unique:true
    },
    name:{
        type:String,
        required:true
    },
    phoneNo:{
        type: Number,
        required: true,
        validator(value){
            if(value.toString().length != 11){
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
    billHistory:{
        type: Array,
        default:[]
    },
    password:{
        type:Number,
        required: true,
        min: 100000,
        max: 999999
    }
})

medicalSchema.statics.getNextID = function(){
    if( nextID <10 ){
        ID = prefix+ '00000'.toString() + nextID.toString()
        nextID += 1
    }else if(nextID<100){
        ID = prefix+ '0000'.toString() + nextID.toString()
        nextID += 1
    }else if(nextID<1000){
        ID = prefix+ '000'.toString() + nextID.toString()
        nextID += 1
    }else if(nextID<10000){
        ID = prefix+ '00'.toString() + nextID.toString()
        nextID += 1
    }else if(nextID<100000){
        ID = prefix+ '0'.toString() + nextID.toString()
        nextID += 1
    }else if(nextID<1000000){
        ID = prefix + nextID.toString()
        nextID += 1
    }
    return ID
}

const Medical = new mongoose.model('Medical',medicalSchema)

module.exports = Medical