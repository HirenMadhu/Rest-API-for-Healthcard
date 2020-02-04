const mongoose = require('mongoose')
const validator = require('validator')

const prefix = 'MB'
var nextID = 1
var ID = 'MB000000'

const medicalBillSchema = mongoose.Schema({
    MBID:{
        type: String,
        required: true,
        unique:true
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
    prescriptionPeriod:{
        amount: Number,
        period: String
    },
    prescriptionTill:{
        type: Number
    }
})

medicalBillSchema.statics.getNextID = function(){
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

const MedicalBill = new mongoose.model('MedicalBill',medicalBillSchema)

module.exports = MedicalBill