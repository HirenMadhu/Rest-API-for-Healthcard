const express = require('express')
const Case = require('../models/case')
const Patient = require('../models/patient')
const Doctor = require('../models/doctor')
const Hospital = require('../models/hospital')

const router = new express.Router()

router.post('/case',async (req,res)=>{
    const case1 = new Case(req.body)
    
    // const patient = new Patient.findOne({"HCID":case1.HCID}).then( () =>{
    //     console.log('Patient Found')
    //     treatmentHistory = patient.treatmentHistory
    //     treatmentHistory.push(case1.id)
    //     patient.findOneAndUpdate({"HCID":case1.HCID}, {treatmentHistory}).then(()=>{
    //         console.log('Patient updated')
    //     }).catch((e)=>{
    //         console.log('Cant update patient')
    //     })
    // }).catch((e)=>{
    //     console.log('Cant find patient')
    // })

    // const doctor = new Doctor.findOne({"DID":case1.DID}).then( () =>{
    //     console.log('Patient Found')
    //     cases_handledDoc = doctor.cases_handled
    //     cases_handledDoc.push(case1.id)
    //     doctor.findOneAndUpdate({"DID":case1.DID}, {"cases_handled":cases_handledDoc}).then(()=>{
    //         console.log('Doctor updated')
    //     }).catch((e)=>{
    //         console.log('Cant update doctor')
    //     })
    // }).catch((e)=>{
    //     console.log('Cant find doctor')
    // })

    // const hospital = new Hospital.findOne({"HID":case1.HID}).then( () =>{
    //     console.log('Hospital Found')
    //     cases_handledHospital = hospital.cases_handled
    //     cases_handledHospital.push(case1.id)
    //     hospital.findOneAndUpdate({"HID":case1.HID}, {"cases_handled":cases_handledHospital}).then(()=>{
    //         console.log('Hospital updated')
    //     }).catch((e)=>{
    //         console.log('Cant update Hospital')
    //     })
    // }).catch((e)=>{
    //     console.log('Cant find Hospital')
    // })

    console.log(case1)
    try{
        const patient = await new Patient.findOne({"HCID":case1.HCID})
        const doctor = await new Doctor.findOne({"DID":case1.DID})
        const hospital = await new Hospital.findOne({"HID":case1.HID})
        treatmentHistory = patient.treatmentHistory
        cases_handledDoc = doctor.cases_handled
        cases_handledHospital = hospital.cases_handled
        treatmentHistory.push(case1.id)
        cases_handledDoc.push(case1.id)
        cases_handledHospital.push(case1.id)
        await patient.findOneAndUpdate({"HCID":case1.HCID}, {treatmentHistory})
        await doctor.findOneAndUpdate({"DID":case1.DID}, {"cases_handled":cases_handledDoc})
        await hospital.findOneAndUpdate({"HID":case1.HID}, {"cases_handled":cases_handledHospital})
        await case1.save() 
        res.status(200).send(case1)
    }catch(e){
        res.status(400).send(e)
        console.log(e)
    }
})


module.exports = router