const express = require('express')
const lab = require('../models/medical')

const router = new express.Router()

router.post('/medical',async(req,res)=>{
    const Lab= new lab(req.body)
    try{
            await medical.save()
            res.status(200).send(Lab)
    }catch(e){
            res.status(400).send()
    }
})

module.exports=router