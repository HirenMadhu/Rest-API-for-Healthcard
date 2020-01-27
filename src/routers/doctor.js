const express = require('express')
const Doctor = require('../models/doctor')
const Hospital = require('../models/hospital')

const router = new express.Router()

router.post('/doctor',async (req,res)=>{
    const doctor = new Doctor(req.body)
    doctor.DID = Doctor.getNextID()
    if(doctor.HID){
        const hospital = await Hospital.findOne({"HID":doctor.HID})
        if(hospital){
            const doctors = hospital.doctors
            doctors.push(doctor.DID)
            try{
                await Hospital.findOneAndUpdate({"HID":doctor.HID}, {doctors})
            }catch(e){
                res.status(400).send()
            }
        }else{
            throw new error('Hospital not found with HID:'+ doctor.HID)
        }
    }
    console.log(doctor)
    try{
        await doctor.save()
        res.status(200).send(doctor)
    }catch(e){
        res.status(400).send(e)
    }
})


module.exports = router