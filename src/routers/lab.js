const express = require('express')
const lab = require('../models/lab')

const router = new express.Router()

router.post('/lab',async(req,res)=>{
    const Lab= new lab(req.body)
    try{
            await Lab.save()
            res.status(200).send(Lab)
    }catch(e){
            res.status(400).send()
    }
})

module.exports=router