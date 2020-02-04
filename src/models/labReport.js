const mongoose = require('mongoose')
const validator = require('validator')

const prefix = 'LR'
var nextID = 1
var ID = 'LR000000'


const labReportSchema = new mongoose.Schema({
    LRID:{
        type: String,
        required: true,
        unique:true
    },
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

labReportSchema.statics.getNextID = function(){
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

const LabReport = new mongoose.model('LabReport', labReportSchema)

module.exports = LabReport