const express = require('express')
const LabReport = require('../models/labReport')

const router = new express.Router()

router.post('/labReport',async (req,res)=>{
    const labReport = new LabReport(req.body)
    console.log(labReport)
    try{
        await labReport.save()
        res.status(200).send(labReport)
    }catch(e){
        res.status(400).send(e)
    }
})


module.exports = router