const mongoose = require('mongoose')
const validator = require('validator')

const prefix = 'LD'
var nextID = 1
var ID = 'LD000000'


const labDoctorSchema = mongoose.Schema({
    LDID:{
        type: String,
        required: true,
        unique:true
    },
    name: {
        firstName:{type:String, required:true},
        lastName:{type:String, required:true}
     },
     contact_no:{
        type: Number,
        required: true,
        validate(value){

            if(value.toString().length!=10){
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
    LID:{
        type:String
    },
    reportHistory:{
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

labDoctorSchema.statics.getNextID = function(){
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

const LabDoctor = new mongoose.model('LabDoctor', labDoctorSchema)

module.exports = LabDoctor