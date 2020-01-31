const express = require('express')
const Patient = require('../models/patient')

const router = new express.Router()

router.post('/patient',async (req,res)=>{
    const patient = new Patient(req.body)
    patient.HCID = Patient.getNextID()
    console.log(patient)
    try{
        await patient.save()
        res.status(200).send(patient)
    }catch(e){
        res.status(400).send(e)
        console.log(e)
    }
})

router.patch('/patient/:id', async(req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'contact_no','email', 'address','height', 'weight','dateOfBirth','bloodGroup','allergies']
    const isValidOperation = updates.every((update)=>allowedUpdates.includes(update))

    if(!isValidOperation){
            return res.status(404).send({error:'Invalid Updates!'})
    }

    try{
            const patient = await Patient.findOne({HCID:req.params.id})
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


module.exports = router