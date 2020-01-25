const express = require('express')
const LabReport = require('../models/labReport')
const Patient = require('../models/patient')
const LabDoctor = require('../models/labDoctor')
const Lab = require('../models/lab')

const router = new express.Router()

router.post('/labReport',async (req,res)=>{
    const labReport = new LabReport(req.body)
    console.log(labReport)
    const labDoctor = await LabDoctor.findOne({"LDID":labReport.LDID})
    if(labDoctor){
        const lab = await Lab.findOne({"LID":labReport.LID})
            if(lab){
                const patient = await Patient.findOne({"HCID":labReport.HCID})
                if(patient){
                    reportHistoryDoc = labDoctor.reportHistory.push(labReport.LRID)
                    reportHistoryLab = lab.reportHistory.push(labReport.LRID)
                    labHistory = patient.labHistory.push(labReport.LRID)
                    reportHistoryLab.push(labReport.LRID)
                    reportHistoryDoc.push(labReport.LRID)
                    labHistory.push(labReport.LRID)
                    try{
                        await Patient.findOneAndUpdate({"HCID":labReport.HCID}, {labHistory})
                        await LabDoctor.findOneAndUpdate({"LRID":labReport.LRID}, {"reportHistory":reportHistoryDoc})
                        await Lab.findOneAndUpdate({"LID":labReport.LID}, {"reportHistory":reportHistoryLab})

                    }catch(e){
                        console.log(e)
                    }
                }else{
                    throw new error('Invalid HCID')
                }
            }else{
                throw new error('Invalid LID')
            }
    }else{
        throw new error('Invalid LDID')
    }
    try{
        await labReport.save()
        res.status(200).send(labReport)
    }catch(e){
        res.status(400).send(e)
    }
})


module.exports = router