const express = require('express')
const Case = require('../models/case')
const Patient = require('../models/patient')
const Doctor = require('../models/doctor')
const Hospital = require('../models/hospital')

const router = new express.Router()

router.post('/case',async (req,res)=>{
    const case1 = new Case(req.body)
    
    console.log(case1)
    try{
        const patient = await Patient.findOne({"HCID":case1.HCID})
        const doctor = await Doctor.findOne({"DID":case1.DID})
        const hospital = await  Hospital.findOne({"HID":case1.HID})
        treatmentHistory = patient.treatmentHistory
        cases_handledDoc = doctor.cases_handled
        cases_handledHospital = hospital.cases_handled
        treatmentHistory.push(case1.CID)
        cases_handledDoc.push(case1.CID)
        cases_handledHospital.push(case1.CID)
        await Patient.findOneAndUpdate({"HCID":case1.HCID}, {treatmentHistory})
        await Doctor.findOneAndUpdate({"DID":case1.DID}, {"cases_handled":cases_handledDoc})
        await Hospital.findOneAndUpdate({"HID":case1.HID}, {"cases_handled":cases_handledHospital})
        await case1.save() 
        res.status(200).send(case1)
    }catch(e){
        res.status(400).send(e)
        console.log(e)
    }
})


module.exports = router