const express = require('express')
const Doctor = require('../models/doctor')
const Hospital = require('../models/hospital')
const sendMail = require('../emails/sendMail')
const jwt=require('jsonwebtoken')
const auth=require('../middleware/auth')

const router = new express.Router()

router.post('/doctor',async (req,res)=>{
    const doctor = new Doctor(req.body)
    doctor.DID = Doctor.getNextID()
    console.log(doctor)
    try{
        const hospital = await Hospital.findOne({"HID":doctor.HID})
        const doctors = hospital.doctors
        const rand = Math.floor(Math.random() * 10)
        doctor.rand = rand
        doctors.push(doctor.DID)
        console.log(doctor)
        await Hospital.findOneAndUpdate({"HID":doctor.HID}, {doctors})
        await doctor.save()
        sendMail(doctor, 'doctor', doctor.rand)
        res.status(200).send(doctor)
    }catch(e){
        res.status(400).send(e)
    }
})

router.post('/doctor/verify',async (req,res)=>{
    try
    {
        const doctor = await Doctor.findOne({"DID":req.body.DID})
        console.log(doctor.rand)
        if(doctor.rand==req.body.rand){
            delete doctor.rand
            console.log(doctor)
            await doctor.save()
            res.status(200).send({msg:"verified doctor"})
        }else{
            await Doctor.findOneAndDelete({"DID":doctor.DID})
            res.status(200).send({msg:"unable to verify, please re register"})
        }
    }catch(e){
        res.status(400).send(e)
        console.log(e)
    }
})

router.post('/doctor/login',async (req,res)=>{
    try{
    const doctor= await Doctor.findByCredentials(req.body.email,req.body.password)
    const token = await doctor.generateAuthToken()
    console.log(doctor)
    console.log(token)
    res.send({doctor,token})
    }catch(e){
        res.status(401).send(e)

    }
})

router.post('/doctor/logout',auth.authDoctor,async (req,res)=>{
    try{
        req.doctor.tokens=req.doctor.tokens.filter((token)=>{
            return token.token !== req.token 
        })
        await req.doctor.save()
        res.send(req.doctor)
    }catch(e){
        res.status(400).send()

    }
})

router.patch('/doctor/:id', auth.authDoctor,async (req,res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'contact_no','email', 'address','degree', 'HID', 'password']
    const isValidOperation = updates.every((update)=>allowedUpdates.includes(update))

    if(!isValidOperation){
        return res.status(404).send({error:'Invalid Updates!'})
    }
    try{
        const doctor = await Doctor.findOne({DID: req.params.id})
        if(!doctor){
            return res.status(404).send({error:'doctor not found'})
        }
        if(doctor.HID){
            const hospital = await Hospital.findOne({"HID":doctor.HID})
            if(!hospital){
                return res.status(404).send({error:'no hospital with such hospital ID found'})
            }
            hospital.doctors.push(req.params.id)
            await hospital.save()
        }
        console.log(doctor)
        updates.forEach((update)=> doctor[update] = req.body[update])
        await doctor.save()
        res.status(200).send(doctor)    
    }catch(e){
        res.status(400).send(e)
        console.log(e)
    }
})

router.delete('/doctor/:id', async (req,res)=>{
    try{
        const doctor = await Doctor.findOneAndDelete({DID:req.params.id})
        if(!doctor){
            return res.status(404).send({error:'Cant find the Doctor!'})
        }
        if(doctor.HID){
            const hospital = await Hospital.findOne({HID:doctor.HID})
            if(!hospital){
                return res.status(404).send({error:'Cant find the Hospital!'})
            }
            index = hospital.doctors.indexOf(doctor.DID)
            if(index > -1){
                hospital.doctors.splice(index, 1)
            }       
        }
        await hospital.save()
        res.status(200).send(doctor)
    }catch(e){
        res.status(400).send(e)
    }
})

router.get('/doctor/profile', async(req,res)=>{
    try{
        const doctor = await Doctor.findOne({DID:req.body.DID})
        var docstr = JSON.stringify(doctor)
        res.status(200).send(doctor)
    }catch(e){
        res.status(404).send(e)
        console.log(e)
    }
})

module.exports = router