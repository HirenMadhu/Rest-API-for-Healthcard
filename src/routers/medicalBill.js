const express = require('express')
const MedicalBill = require('../models/medicalBill')

const router = new express.Router()

router.post('/medicalBill',async(req,res)=>{
    const medicalBill= new MedicalBill(req.body)
    console.log(medicalBill)
    try{
            await medicalBill.save()
            res.status(200).send(medicalBill)
    }catch(e){
            res.status(400).send()
    }
})

module.exports = router