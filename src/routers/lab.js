const express = require('express')
const Lab = require('../models/lab')

const router = new express.Router()

router.post('/lab',async(req,res)=>{
    const lab= new Lab(req.body)
    console.log(lab)
    try{
            await lab.save()
            res.status(200).send(lab)
    }catch(e){
            res.status(400).send(e)
    }
})

module.exports=router