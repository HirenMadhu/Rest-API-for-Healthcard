const mongoose = require('mongoose')
const validator = require('validator')

const caseSchema = new mongoose.Schema({
    CID:{
        type: String,
        required: true
    },
    HCID : {
        type: String,
        required: true
    },
    DID: {
        type: String,
        required: true
    },
    HID : {
        type: String,
        required: true
    },
    Date_time:{
        type: Date,
    },
    probelm_description:{
        type: String,
        required: true
    },
    eval_and_cure:{
        type: String,
        required: true
    },
    viral_disease:{
        type: String,
        default: "None"
    },
    instructions:[{
        type: String
    }],
    precribed_medicines:[{
        medicineName:String,
        dosage: String,
        extra:String
    }],
    nextOPDDate:{
        type: Date
    }
})

const Case = new mongoose.model('Case',caseSchema)
  
module.exports = Case