const express = require('express')
const Doctor = require('../models/doctor')

const router = new express.Router()

router.post('/doctor',async (req,res)=>{
    const doctor = new Doctor(req.body)
    console.log(doctor)
    try{
        await doctor.save()
        res.status(200).send(doctor)
    }catch(e){
        res.status(400).send(e)
    }
})


module.exports = router