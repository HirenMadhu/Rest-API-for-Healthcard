const express = require('express')
const Hospital = require('../models/hospital')

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
module.exports=router