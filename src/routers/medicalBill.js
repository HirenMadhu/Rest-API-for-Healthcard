const express = require('express')
const MedicalBill = require('../models/medicalBill')
const Medical = require('../models/medical')
const Patient = require('../models/patient')

const router = new express.Router()

router.post('/medicalBill',async(req,res)=>{
    const medicalBill= new MedicalBill(req.body)
    if(medicalBill.MID){
            try{
                const medical = await Medical.findOne({"MID":medicalBill.MID})
                if(medical){
                        try{
                                const patient = await Patient.findOne({"HCID":medicalBill.HCID})
                                if(patient){
                                        console.log(patient)
                                        console.log(medical)
                                        billHistory = medical.billHistory
                                        medicineHistory = patient.medicineHistory
                                        billHistory.push(medicalBill.MBID)
                                        medicineHistory.push(medicalBill.MBID)
                                        try{
                                                await Medical.findOneAndUpdate({"MID":medicalBill.MID}, {billHistory})
                                                await Patient.findOneAndUpdate({"HCID":medicalBill.HCID}, {medicineHistory})
                                        }catch(e){
                                                console.log(e)
                                        }
                                }
                                else{
                                        throw new error('Cant find Patient with given ID')
                                }
                        }catch(e){
                                console.log(e)
                        }
                }
                else{
                        throw new error('Cant find medical with given ID')
                }
            }catch(e){
                console.log(e)
            }
    }
    console.log(medicalBill)
    try{
            await medicalBill.save()
            res.status(200).send(medicalBill)
    }catch(e){
            res.status(400).send()
    }
})

module.exports = router