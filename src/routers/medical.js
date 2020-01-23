const express = require('express')
const Medical = require('../models/medical')

const router = new express.Router()

router.post('/medical',async(req,res)=>{
    const medical= new Medical(req.body)
    console.log(medical)
    try{
            await medical.save()
            res.status(200).send(medical)
    }catch(e){
            res.status(400).send()
    }
})

module.exports=router