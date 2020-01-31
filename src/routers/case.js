const express = require('express')
const Case = require('../models/case')
const Patient = require('../models/patient')
const Doctor = require('../models/doctor')
const Hospital = require('../models/hospital')

const router = new express.Router()

router.post('/case',async (req,res)=>{
    const case1 = new Case(req.body)
    case1.CID = Case.getNextID()
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

router.patch('/case/:id', async (req,res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['DID', 'HCID','probelm_description', 'eval_and_cure','viral_disease', 'instructions', 'precribed_medicines','nextOPDDate']
    const isValidOperation = updates.every((update)=>allowedUpdates.includes(update))

    if(!isValidOperation){
        return res.status(404).send({error:'Invalid Updates!'})
    }
        

    try{
        const case1 = await Case.findOne({CID: req.params.id})
        if(!case1){
            return res.status(404).send({error:'Case not found'})
        }
        const patient = await Patient.findOne({"HCID":case1.HCID})
        if(!patient){
            return res.status(404).send({error:'no patient with such patient ID found'})
        }
        const doctor = await Doctor.findOne({"DID":case1.DID})
        if(!doctor){
            return res.status(404).send({error:'no doctor with such doctor ID found'})
        }
        updates.forEach((update)=> case1[update] = req.body[update])
        doctor.cases_handled.push(req.params.id)
        patient.treatmentHistory.push(req.params.id)
        await case1.save()
        await doctor.save()
        await patient.save()
        res.status(200).send(case1)    
    }catch(e){
        res.status(400).send(e)
        console.log(e)
    }
})


module.exports = router