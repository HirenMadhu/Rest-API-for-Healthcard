const express = require('express')
const Admin = require('../models/admin')
const jwt=require('jsonwebtoken')
const auth=require('../middleware/auth')
const verifyAdmin = require('../emails/adminVerification')

const router = new express.Router()

router.post('/admin',async(req,res)=>{
    const admin= new Admin(req.body)
    admin.AID = Admin.getNextID()
    console.log(admin)
    try{
            await admin.save()
            verifyAdmin.verificationRequest(admin)
            res.status(200).send(admin)
    }catch(e){
            res.status(400).send(e)
    }
})

router.post('/admin/login',async (req,res)=>{
        try{
        const admin= await Admin.findByCredentials(req.body.email,req.body.password)
        const token = await admin.generateAuthToken()
        console.log(admin)
        console.log(token)
        res.send({admin,token})
        }catch(e){
            res.status(401).send(e)
        }
})
    
router.post('/admin/logout',auth.authAdmin,async (req,res)=>{
        try{
            req.admin.tokens=req.admin.tokens.filter((token)=>{
                return token.token !== req.token 
            })
            await req.admin.save()
            res.send(req.admin)
        }catch(e){
            res.status(400).send()
        }
})

router.patch('/admin/:id',auth.authAdmin, async(req,res)=>{
        const updates = Object.keys(req.body)
        const allowedUpdates = ['name', 'phoneNo','email', 'address','type', 'password']
        const isValidOperation = updates.every((update)=>allowedUpdates.includes(update))

        if(!isValidOperation){
                return res.status(404).send({error:'Invalid Updates!'})
        }

        try{
                const admin = await Admin.findOne({HID:req.params.id})
                if(!admin){
                        res.status(404).send({error:'Admin not found'})
                }
                updates.forEach((update)=> admin[update] = req.body[update])
                await admin.save()
                res.status(200).send()
        }catch(e){
                res.status(400).send(e)
        }
})

module.exports=router