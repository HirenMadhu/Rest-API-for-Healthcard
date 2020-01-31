const express = require('express')
const Medical = require('../models/medical')

const router = new express.Router()

router.post('/medical',async(req,res)=>{
    const medical= new Medical(req.body)
    medical.MID = Medical.getNextID()
    console.log(medical)
    try{
            await medical.save()
            res.status(200).send(medical)
    }catch(e){
            res.status(400).send(e)
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