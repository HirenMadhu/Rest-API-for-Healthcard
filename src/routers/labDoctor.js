const express = require('express')
const LabDoctor = require('../models/labDoctor.js')
const Lab = require('../models/lab')

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
            await labDoctor.save()
            res.status(200).send(labDoctor)
    }catch(e){
            res.status(400).send(e)
            console.log(e)
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