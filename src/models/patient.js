const mongoose = require('mongoose')
const validator = require('validator')

const prefix = 'HC'
var nextID = 1
var ID = 'HC000000'

const patientSchema = new mongoose.Schema({
    HCID:{
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
     height:{
         type:Number,
         required:true
     },
     weight:{
         type: Number,
         required: true
     },
     dateOfBirth:{
         type:Date,
         required: true
     },
     bloodGroup:{
         type: String,
         required: true
     },
     allergies:[{
         type:String
     }],
     medicalHistory:[{
        problem_surgery: String,
        year: Number
     }],
     treatmentHistory:{
        type: Array,
        default:[]
     },
     labHistory:{
        type: Array,
        default:[]
     },
     medicineHistory:{
        type: Array,
        default:[]
     },
     ongoingMedicines:{
        type: Array,
        default:[]
     }
})

patientSchema.statics.getNextID = function(){
    if( nextID <10 ){
        ID = prefix+ '00000' + nextID.toString()
        nextID += 1
    }else if(nextID<100){
        ID = prefix+ '0000' + nextID.toString()
        nextID += 1
    }else if(nextID<1000){
        ID = prefix+ '000' + nextID.toString()
        nextID += 1
    }else if(nextID<10000){
        ID = prefix+ '00' + nextID.toString()
        nextID += 1
    }else if(nextID<100000){
        ID = prefix+ '0' + nextID.toString()
        nextID += 1
    }else if(nextID<1000000){
        ID = prefix + nextID.toString()
        nextID += 1
    }
    return ID
}

const Patient = new mongoose.model('Patient', patientSchema)

module.exports = Patient