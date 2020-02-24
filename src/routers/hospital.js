const express = require('express')
const Hospital = require('../models/hospital')
const jwt=require('jsonwebtoken')
const auth=require('../middleware/auth')
const sendMail = require('../emails/sendMail')

const router = new express.Router()

router.post('/hospital',async(req,res)=>{
    const hospital= new Hospital(req.body)
    hospital.HID = Hospital.getNextID()
    console.log(hospital)
    try{
            await hospital.save()
            sendMail(hospital, 'hospital')
            res.status(200).send(hospital)
    }catch(e){
            res.status(400).send(e)
    }
})

router.post('/hospital/verify',async (req,res)=>{
        try
        {
            const hospital = await Hospital.findOne({"DID":req.body.DID})
            if(hospital && !hospital.verificationDone){
                hospital.password = req.body.password
                hospital.verificationDone = true
                await hospital.save()
                res.status(200).send({msg:"verified hospital"})
            }else if(!hospital){
                res.status(200).send({msg:"unable to verify, please enter correct DID"})
            }else{
                res.status(200).send({msg:"DID already verified"})
            }
        }catch(e){
            res.status(400).send(e)
            console.log(e)
        }
})

router.post('/hospital/login',async (req,res)=>{
        try{
        const hospital= await Hospital.findByCredentials(req.body.email,req.body.password)
        const token = await hospital.generateAuthToken()
        console.log(hospital)
        console.log(token)
        res.send({hospital,token})
        }catch(e){
            res.status(401).send(e)
        }
})
    
router.post('/hospital/logout',auth.authHospital,async (req,res)=>{
        try{
            req.hospital.tokens=req.hospital.tokens.filter((token)=>{
                return token.token !== req.token 
            })
            await req.hospital.save()
            res.send(req.hospital)
        }catch(e){
            res.status(400).send()
        }
})

router.patch('/hospital/:id', async(req,res)=>{
        const updates = Object.keys(req.body)
        const allowedUpdates = ['name', 'phoneNo','email', 'address','type', 'password']
        const isValidOperation = updates.every((update)=>allowedUpdates.includes(update))

        if(!isValidOperation){
                return res.status(404).send({error:'Invalid Updates!'})
        }

        try{
                const hospital = await Hospital.findOne({HID:req.params.id})
                if(!hospital){
                        res.status(404).send({error:'Hospital not found'})
                }
                updates.forEach((update)=> hospital[update] = req.body[update])
                await hospital.save()
                res.status(200).send()
        }catch(e){
                res.status(400).send(e)
        }
})

module.exports=router