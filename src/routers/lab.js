const express = require('express')
const Lab = require('../models/lab')

const router = new express.Router()

router.post('/lab',async(req,res)=>{
    const lab= new Lab(req.body)
    lab.LID = Lab.getNextID()
    console.log(lab)
    try{
            await lab.save()
            res.status(200).send(lab)
    }catch(e){
            res.status(400).send(e)
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
                        res.status(404).send({error:'Hospital not found'})
                }
                updates.forEach((update)=> lab[update] = req.body[update])
                await lab.save()
                res.status(200).send()
        }catch(e){
                res.status(400).send(e)
        }
})

module.exports=router