const mongoose = require('mongoose')
const validator = require('validator')

const medicalBillSchema = mongoose.Schema({
    MBID:{
        type: String,
        required: true
    },
    MID:{
        type:String,
        required:true
    },
    HCID:{
        type:String,
        required: true
    },
    date_time:{
        type:Date
    },
    prescrivedBy:{
        type:String,
        default:"SELF"
    },
    dosage:{
        dosage:String,
        extra:String
    },
    pescriptionPeriod:{
        amount: Number,
        period: String
    }
})

const MedicalBill = new mongoose.model('MedicalBill',medicalBillSchema)

module.exports = MedicalBill