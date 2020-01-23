const express = require('express')
const LabDoctor = require('../models/labDoctor.js')

const router = new express.Router()

router.post('/labDoctor',async(req,res)=>{
    const labDoctor= new LabDoctor(req.body)
    console.log(labDoctor)
    try{
            await labDoctor.save()
            res.status(200).send(labDoctor)
    }catch(e){
            res.status(400).send()
            console.log(e)
    }
})

module.exports=router