const express = require('express')
const LabReport = require('../models/labReport')
const Patient = require('../models/patient')
const LabDoctor = require('../models/labDoctor')
const Lab = require('../models/lab')

const router = new express.Router()

router.post('/labReport',async (req,res)=>{
    const labReport = new LabReport(req.body)
    console.log(labReport)
    labReport.LRID = LabReport.getNextID()
    try{
        const lab = await Lab.findOne({"LID":labReport.LID})
        const patient = await Patient.findOne({"HCID":labReport.HCID})
        console.log(labDoctor)
        console.log(lab)
        console.log(patient)
        reportHistoryDoc = labDoctor.reportHistory
        reportHistoryLab = lab.reportHistory
        labHistory = patient.labHistory
        reportHistoryLab.push(labReport.LRID)
        reportHistoryDoc.push(labReport.LRID)
        labHistory.push(labReport.LRID)
        await Patient.findOneAndUpdate({"HCID":labReport.HCID}, {labHistory})
        await LabDoctor.findOneAndUpdate({"LRID":labReport.LRID}, {"reportHistory":reportHistoryDoc})
        await Lab.findOneAndUpdate({"LID":labReport.LID}, {"reportHistory":reportHistoryLab})
        const labDoctor = await LabDoctor.findOne({"LDID":labReport.LDID})
        await labReport.save()
        res.status(200).send(labReport)
    }catch(e){
        res.status(400).send(e)
    }
})

router.patch('/labReport/:id', async (req,res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['LDID', 'HCID','byReferenceOf', 'statisticReport']
    const isValidOperation = updates.every((update)=>allowedUpdates.includes(update))

    if(!isValidOperation){
        return res.status(404).send({error:'Invalid Updates!'})
    }
        

    try{
        const labReport = await LabReport.findOne({LRID: req.params.id})
        if(!labReport){
            return res.status(404).send({error:'Lab Report Report not found'})
        }
        const patient = await Patient.findOne({"HCID":labReport.HCID})
        if(!patient){
            return res.status(404).send({error:'no patient with such patient ID found'})
        }
        const labDoctor = await LabDoctor.findOne({"LDID":labReport.LDID})
        if(!labDoctor){
            return res.status(404).send({error:'no Lab Doctor with such labDoctor ID found'})
        }
        updates.forEach((update)=> labReport[update] = req.body[update])
        labDoctor.reportHistory.push(req.params.id)
        patient.labHistory.push(req.params.id)
        await labReport.save()
        await labDoctor.save()
        await patient.save()
        res.status(200).send(labReport)    
    }catch(e){
        res.status(400).send(e)
        console.log(e)
    }
})

module.exports = router