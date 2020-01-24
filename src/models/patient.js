const mongoose = require('mongoose')
const validator = require('validator')

const patientSchema = new mongoose.Schema({
    HCID:{
        type: String,
        required: true
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
     treatmentHistory:[{
        type:String
     }],
     labHistory:[{
        type:String
     }],
     medicineHistory:[{
         type:String
     }],
     ongoingMedicines:[{
         type:String
     }]
})

const Patient = new mongoose.model('Patient', patientSchema)

module.exports = Patient