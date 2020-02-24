const express = require('express')
const Patient = require('../models/patient')
const jwt=require('jsonwebtoken')
const auth=require('../middleware/auth')
const sendMail = require('../emails/sendMail')

const router = new express.Router()

router.post('/patient',async (req,res)=>{
    const patient = new Patient(req.body)
    patient.HCID = Patient.getNextID()
    console.log(patient)
    try{
        await patient.save()
        sendMail(patient, 'patient')
        res.status(200).send(patient)
    }catch(e){
        res.status(400).send(e)
        console.log(e)
    }
})

router.post('/patient/verify',async (req,res)=>{
    try
    {
        const patient = await Patient.findOne({"DID":req.body.DID})
        if(patient && !patient.verificationDone){
            patient.password = req.body.password
            patient.verificationDone = true
            await patient.save()
            res.status(200).send({msg:"verified patient"})
        }else if(!patient){
            res.status(200).send({msg:"unable to verify, please enter correct DID"})
        }else{
            res.status(200).send({msg:"DID already verified"})
        }
    }catch(e){
        res.status(400).send(e)
        console.log(e)
    }
})

router.post('/patient/login',async (req,res)=>{
    try{
    const patient= await Patient.findByCredentials(req.body.email,req.body.password)
    const token = await patient.generateAuthToken()
    console.log(patient)
    console.log(token)
    res.send({patient,token})
    }catch(e){
        res.status(401).send(e)
    }
})

router.post('/patient/logout',auth.authPatient,async (req,res)=>{
    try{
        req.patient.tokens=req.patient.tokens.filter((token)=>{
            return token.token !== req.token 
        })
        await req.patient.save()
        res.send(req.patient)
    }catch(e){
        res.status(400).send()
    }
})

router.patch('/patient', auth.authPatient, async(req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'contact_no','email', 'address','height', 'weight','dateOfBirth','bloodGroup','allergies']
    const isValidOperation = updates.every((update)=>allowedUpdates.includes(update))

    if(!isValidOperation){
            return res.status(404).send({error:'Invalid Updates!'})
    }

    try{
            const patient = req.patient
            if(!patient){
                    res.status(404).send({error:'patient not found'})
            }
            updates.forEach((update)=> patient[update] = req.body[update])
            await patient.save()
            res.status(200).send()
    }catch(e){
            res.status(400).send(e)
    }
})


module.exports = router