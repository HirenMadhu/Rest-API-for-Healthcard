const express = require('express')
const medicalBill = require('../models/medicalBill')

const router = new express.Router()

router.post('/lab',async(req,res)=>{
    const medicalBill= new lab(req.body)
    try{
            await medicalBill.save()
            res.status(200).send(Lab)
    }catch(e){
            res.status(400).send()
    }
})

module.exports=router