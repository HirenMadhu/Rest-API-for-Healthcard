const express = require('express')
const MedicalBill = require('../models/medicalBill')
const Medical = require('../models/medical')
const Patient = require('../models/patient')

const router = new express.Router()

router.post('/medicalBill',async(req,res)=>{
    const medicalBill= new MedicalBill(req.body)
    medicalBill.MBID = MedicalBill.getNextID()
    currentTime = Date.now()
    console.log(currentTime)
    try{
                const medical = await Medical.findOne({"MID":medicalBill.MID})
                const patient = await Patient.findOne({"HCID":medicalBill.HCID})
                console.log(patient)
                console.log(medical)
                billHistory = medical.billHistory
                medicineHistory = patient.medicineHistory
                billHistory.push(medicalBill.MBID)
                medicineHistory.push(medicalBill.MBID)
                await Medical.findOneAndUpdate({"MID":medicalBill.MID}, {billHistory})
                await Patient.findOneAndUpdate({"HCID":medicalBill.HCID}, {medicineHistory})
                switch(medicalBill.prescriptionPeriod.period.toLowerCase()){
                        case 'week':
                                    medicalBill.prescriptionTill = (medicalBill.prescriptionPeriod.amount * 604800000 + currentTime)
                                    break
                        case 'day':
                                    medicalBill.prescriptionTill = (medicalBill.prescriptionPeriod.amount * 86400000 + currentTime)
                                    break
                        case 'day':
                                    medicalBill.prescriptionTill = (medicalBill.prescriptionPeriod.amount * 2628000000 + currentTime)
                                    break    
                }
                console.log(medicalBill)
                await medicalBill.save()
                res.status(200).send(medicalBill)
        }
        catch(e){
                console.log(e)
                res.status(400).send(e)
        }    
    }
)

router.patch('/medicalBill/:id', async (req,res) => {
        const updates = Object.keys(req.body)
        const allowedUpdates = ['prescrivedBy', 'HCID','dosage', 'prescriptionPeriod']
        const isValidOperation = updates.every((update)=>allowedUpdates.includes(update))
    
        if(!isValidOperation){
            return res.status(404).send({error:'Invalid Updates!'})
        }
            
    
        try{
            const medicalBill = await MedicalBill.findOne({MBID: req.params.id})
            if(!medicalBill){
                return res.status(404).send({error:'Medical Bill not found'})
            }
            const patient = await Patient.findOne({"HCID":medicalBill.HCID})
            if(!patient){
                return res.status(404).send({error:'no patient with such patient ID found'})
            }
            updates.forEach((update)=> medicalBill[update] = req.body[update])
            patient.medicineHistory.push(req.params.id)
            await medicalBill.save()
            await patient.save()
            res.status(200).send(medicalBill)    
        }catch(e){
            res.status(400).send(e)
            console.log(e)
        }
    })

module.exports = router