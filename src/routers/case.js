const express = require('express')
const Case = require('../models/case')

const router = new express.Router()

router.post('/case',async (req,res)=>{
    const case1 = new Case(req.body)
    console.log(case1)
    try{
        await case1.save() 
        res.status(200).send(case1)
        
    }catch(e){
        res.status(401).send(e)
    }
})


module.exports = router