const express = require('express')
const LabDoctor = require('../models/labDoctor.js')
const Lab = require('../models/lab')

const router = new express.Router()

router.post('/labDoctor',async(req,res)=>{
    const labDoctor= new LabDoctor(req.body)
    console.log(labDoctor)
    labDoctor.LDID = LabDoctor.getNextID()
    if(labDoctor.LID){
        const lab = await Lab.findOne({"LID":labDoctor.LID})
        if(lab){
            const labDoctors = lab.labDoctors
            labDoctors.push(labDoctor.LID)
            try{
                await Lab.findOneAndUpdate({"LID":labDoctor.LID}, {labDoctors})
            }catch(e){
                console.log('cant update')
            }
        }else{
            throw new error('Lab not found with LID:'+ labDoctor.LID)
        }
    }
    try{
            await labDoctor.save()
            res.status(200).send(labDoctor)
    }catch(e){
            res.status(400).send(e)
            console.log(e)
    }
})

module.exports=router