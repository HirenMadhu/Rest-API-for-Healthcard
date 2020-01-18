const mongoose = require('mongoose')
const validator = require('validator')

const labReportSchema = new mongoose.Schema({
    HCID:{
        type:String,
        required: true
    },
    LID:{
        type:String,
        required: true
    },
    LDID:{
        type:String,
        required: true
    },
    date_time:{
        type:Date,
        required: true
    },
    byReferenceOf:{
        type:String,
        default: "SELF"
    },
    statisticReport:[{
        no: Number,
        name: String,
        result: Number,
        ideal: String,
    }]
})