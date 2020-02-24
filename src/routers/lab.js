const express = require('express')
const Lab = require('../models/lab')
const jwt=require('jsonwebtoken')
const auth=require('../middleware/auth')
const sendMail = require('../emails/sendMail')

const router = new express.Router()

router.post('/lab',async(req,res)=>{
    const lab= new Lab(req.body)
    lab.LID = Lab.getNextID()
    console.log(lab)
    try{
            await lab.save()
            sendMail(lab, 'lab')
            res.status(200).send(lab)
    }catch(e){
            res.status(400).send(e)
    }
})

router.post('/lab/verify',async (req,res)=>{
        try
        {
            const lab = await Lab.findOne({"DID":req.body.DID})
            if(lab && !lab.verificationDone){
                lab.password = req.body.password
                lab.verificationDone = true
                await lab.save()
                res.status(200).send({msg:"verified lab"})
            }else if(!lab){
                res.status(200).send({msg:"unable to verify, please enter correct DID"})
            }else{
                res.status(200).send({msg:"DID already verified"})
            }
        }catch(e){
            res.status(400).send(e)
            console.log(e)
        }
    })

router.post('/lab/login',async (req,res)=>{
        try{
        const lab= await Lab.findByCredentials(req.body.email,req.body.password)
        const token = await lab.generateAuthToken()
        console.log(lab)
        console.log(token)
        res.send({lab,token})
        }catch(e){
            res.status(401).send(e)
        }
})
    
router.post('/lab/logout',auth.authLab,async (req,res)=>{
        try{
            req.lab.tokens=req.lab.tokens.filter((token)=>{
                return token.token !== req.token 
            })
            await req.lab.save()
            res.send(req.lab)
        }catch(e){
            res.status(400).send()
        }
})

router.patch('/lab/:id', async(req,res)=>{
        const updates = Object.keys(req.body)
        const allowedUpdates = ['name', 'phoneNo','email', 'address','type', 'password']
        const isValidOperation = updates.every((update)=>allowedUpdates.includes(update))

        if(!isValidOperation){
                return res.status(404).send({error:'Invalid Updates!'})
        }

        try{
                const lab = await Lab.findOne({LID:req.params.id})
                if(!lab){
                        res.status(404).send({error:'Lab not found'})
                }
                updates.forEach((update)=> lab[update] = req.body[update])
                await lab.save()
                res.status(200).send()
        }catch(e){
                res.status(400).send(e)
        }
})

module.exports=router