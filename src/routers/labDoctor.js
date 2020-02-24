const express = require('express')
const LabDoctor = require('../models/labDoctor.js')
const Lab = require('../models/lab')
const jwt=require('jsonwebtoken')
const auth=require('../middleware/auth')
const sendMail = require('../emails/sendMail')

const router = new express.Router()

router.post('/labDoctor',async(req,res)=>{
    const labDoctor= new LabDoctor(req.body)
    console.log(labDoctor)
    labDoctor.LDID = LabDoctor.getNextID()
    try{
            const lab = await Lab.findOne({"LID":labDoctor.LID})
            const labDoctors = lab.labDoctors
            labDoctors.push(labDoctor.LID)
            await Lab.findOneAndUpdate({"LID":labDoctor.LID}, {labDoctors})
            sendMail(labdoctor, 'labdoctor')
            await labDoctor.save()
            res.status(200).send(labDoctor)
    }catch(e){
            res.status(400).send(e)
            console.log(e)
    }
})

router.post('/labdoctor/verify',async (req,res)=>{
    try
    {
        const labdoctor = await LabDoctor.findOne({"DID":req.body.DID})
        if(labdoctor && !labdoctor.verificationDone){
            labdoctor.password = req.body.password
            labdoctor.verificationDone = true
            await labdoctor.save()
            res.status(200).send({msg:"verified labdoctor"})
        }else if(!labdoctor){
            res.status(200).send({msg:"unable to verify, please enter correct DID"})
        }else{
            res.status(200).send({msg:"DID already verified"})
        }
    }catch(e){
        res.status(400).send(e)
        console.log(e)
    }
})

router.post('/labdoctor/login',async (req,res)=>{
    try{
    const labdoctor= await LabDoctor.findByCredentials(req.body.email,req.body.password)
    const token = await labdoctor.generateAuthToken()
    console.log(labdoctor)
    console.log(token)
    res.send({labdoctor,token})
    }catch(e){
        res.status(401).send(e)
    }
})

router.post('/labdoctor/logout',auth.authLabDoctor,async (req,res)=>{
    try{
        req.labdoctor.tokens=req.labdoctor.tokens.filter((token)=>{
            return token.token !== req.token 
        })
        await req.labdoctor.save()
        res.send(req.labdoctor)
    }catch(e){
        res.status(400).send()
    }
})

router.patch('/labDoctor/:id', async (req,res) => {
        const updates = Object.keys(req.body)
        const allowedUpdates = ['name', 'contact_no','email', 'address','degree', 'HID', 'password','LID']
        const isValidOperation = updates.every((update)=>allowedUpdates.includes(update))
    
        if(!isValidOperation){
            return res.status(404).send({error:'Invalid Updates!'})
        }
        try{
            const labDoctor = await LabDoctor.findOne({LDID: req.params.id})
            if(!labDoctor){
                return res.status(404).send({error:'Lab Doctor not found'})
            }
            if(labDoctor.LID){
                const lab = await Lab.findOne({"LID":labDoctor.LID})
                if(!lab){
                    return res.status(404).send({error:'no lab with such lab ID found'})
                }
                console.log(lab)
                lab.labDoctors.push(req.params.id)
                await lab.save()
            }
            updates.forEach((update)=> labDoctor[update] = req.body[update])
            await labDoctor.save()
            res.status(200).send(labDoctor)    
        }catch(e){
            res.status(400).send(e)
            console.log(e)
        }
    })

module.exports=router