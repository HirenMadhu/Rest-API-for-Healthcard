const mongoose = require('mongoose')
const validator = require('validator')

var nextID=1
const prefix = 'C'
var ID = 'C000000'


const caseSchema = new mongoose.Schema({
    CID:{
        type: String,
        required: true,
        unique:true
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

caseSchema.statics.getNextID = function(){
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

const Case = new mongoose.model('Case',caseSchema)
  
module.exports = Case