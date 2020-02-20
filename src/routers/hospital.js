const express = require('express')
const Hospital = require('../models/hospital')
const nodemailer = require('nodemailer')
const router = new express.Router()

router.post('/hospital',async(req,res)=>{
    const hospital= new Hospital(req.body)
    hospital.HID = Hospital.getNextID()
    console.log(hospital)
    try{
            await hospital.save()
            res.status(200).send(hospital)
    }catch(e){
            res.status(400).send(e)
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

router.post('/sendMail', async(req,res)=>{
        try{
                const rand = Math.floor(Math.random() * 10)

                let transporter = nodemailer.createTransport({
                        service:'gmail', 
                        auth: {
                        user: 'sgh.healthcard@gmail.com', // generated ethereal user
                        pass: 'theblackpearl' // generated ethereal password
                        },
                        tls:{
                                rejectUnauthorized:false
                        }  
                }    
                );
                
                let info = await transporter.sendMail({
                        from: '"Health Card" <gsh.healthcard@gmail.com>', 
                        to: "harshsodha90@gmail.com", 
                        subject: "Welcome", 
                        text: "Good morning", 
                        html: output 
                })
                
                console.log("Message sent: %s", info.messageId)
                console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info))
        }catch(e){
                console.log(e)
        }
})
module.exports=router