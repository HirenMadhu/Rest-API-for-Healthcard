const express = require('express')
const Patient = require('../models/patient')
const jwt=require('jsonwebtoken')
const auth=require('../middleware/auth')
const sendMail = require('../emails/sendMail')
const multer = require('multer')
const sharp = require('sharp')

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
        res.status(401).send({"error":"Enter correct credentials"})
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

const profilePic = multer({
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload an image!'))
        }

        cb(undefined, true)
    }
})

router.post('/patient/avatar', auth.authPatient, profilePic.single('avatar'), async(req,res)=>{
    const buffer =  await sharp(req.file.buffer).resize({width:250, height:250}).png().toBuffer()
    req.patient.avatar = buffer
    await req.patient.save()
    res.send()
}, (error, req,res,next)=>{
    res.status(400).send({error:error.message})
})

router.post('/patient/avatar', auth.authPatient, async(req,res)=>{
    req.patient.avatar = undefined
    await req.patient.save()
    res.send()
}, (error, req,res,next)=>{
    res.status(400).send({error:error.message})
})

router.get('/patient/:id/avatar', auth.authPatient, async(req,res)=>{
    try{
        const patient  = await Patient.findById(req.params.id)
        if(!patient || !patient.avatar){
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(patient.avatar)
    }catch(e){
        res.status(404).send()
    }
})

router.get('/test',(req,res)=>{
    const data={"msg":"Good morning!"}
    console.log("hello")
    res.send(data)
})

module.exports = router