const express = require('express')
const Medical = require('../models/medical')
const jwt=require('jsonwebtoken')
const auth=require('../middleware/auth')
const sendMail = require('../emails/sendMail')

const router = new express.Router()

router.post('/medical',async(req,res)=>{
    const medical= new Medical(req.body)
    medical.MID = Medical.getNextID()
    console.log(medical)
    try{
            await medical.save()
            sendMail(medical, 'medical')
            res.status(200).send(medical)
    }catch(e){
            res.status(400).send(e)
    }
})

router.post('/medical/verify',async (req,res)=>{
        try
        {
            const medical = await Medical.findOne({"DID":req.body.DID})
            if(medical && !medical.verificationDone){
                medical.password = req.body.password
                medical.verificationDone = true
                await medical.save()
                res.status(200).send({msg:"verified medical"})
            }else if(!medical){
                res.status(200).send({msg:"unable to verify, please enter correct DID"})
            }else{
                res.status(200).send({msg:"DID already verified"})
            }
        }catch(e){
            res.status(400).send(e)
            console.log(e)
        }
    })

router.post('/medical/login',async (req,res)=>{
        try{
        const medical= await Medical.findByCredentials(req.body.email,req.body.password)
        const token = await medical.generateAuthToken()
        console.log(medical)
        console.log(token)
        res.send({medical,token})
        }catch(e){
            res.status(401).send(e)
        }
})
    
router.post('/medical/logout',auth.authMedical,async (req,res)=>{
        try{
            req.medical.tokens=req.medical.tokens.filter((token)=>{
                return token.token !== req.token 
            })
            await req.medical.save()
            res.send(req.medical)
        }catch(e){
            res.status(400).send()
        }
})

router.patch('/medical/:id', async(req,res)=>{
        const updates = Object.keys(req.body)
        const allowedUpdates = ['name', 'phoneNo','email', 'address', 'password']
        const isValidOperation = updates.every((update)=>allowedUpdates.includes(update))

        if(!isValidOperation){
                return res.status(404).send({error:'Invalid Updates!'})
        }

        try{
                const medical = await Medical.findOne({MID:req.params.id})
                if(!medical){
                        res.status(404).send({error:'medical not found'})
                }
                updates.forEach((update)=> medical[update] = req.body[update])
                await medical.save()
                res.status(200).send()
        }catch(e){
                res.status(400).send(e)
        }
})

module.exports=router