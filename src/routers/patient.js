const express = require('express')
const Patient = require('../models/patient')

const router = new express.Router()

router.post('/patient',async (req,res)=>{
    const patient = new Patient(req.body)
    console.log(patient)
    try{
        await patient.save()
        res.status(200).send(patient)
    }catch(e){
        res.status(400).send(e)
        console.log(e)
    }
})


module.exports = router