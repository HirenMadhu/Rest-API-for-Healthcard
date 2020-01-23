const express = require('express')
const Hospital = require('../models/hospital')

const router = new express.Router()

router.post('/hospital',async(req,res)=>{
    const hospital= new Hospital(req.body)
    try{
            await hospital.save()
            res.status(200).send(hospital)
    }catch(e){
            res.status(400).send()
    }
})

module.exports=router