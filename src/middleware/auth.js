const jwt=require('jsonwebtoken')
const Doctor=require('../models/doctor')
const Hospital=require('../models/hospital')
const LabDoctor = require('../models/labDoctor')
const Patient = require('../models/patient')
const Lab = require('../models/lab')
const Medical = require('../models/medical')


const authDoctor=async(req,res,next)=>{
    try{
        const token=req.header('Authorization').replace('Bearer ','')
        const decoded= jwt.verify(token,'thisismynewcourse')
        const doctor=await Doctor.findOne({_id:decoded._id,'tokens.token':token})

        if(!doctor){
             throw new Error('please authenticate')
        }
        req.doctor=doctor
        req.token = token
        next()
    }catch(e){
        res.status(401).send({error:'please authenticate.'})
    }
}

const authHospital=async(req,res,next)=>{
    try{
        const token=req.header('Authorization').replace('Bearer ','')
        const decoded= jwt.verify(token,'thisismynewcourse')
        const hospital=await Hospital.findOne({_id:decoded._id,'tokens.token':token})

        if(!hospital){
             throw new Error('please authenticate')
         }
        req.hospital=hospital
        req.token = token
        next()
    }catch(e){
        res.status(401).send({error:'please authenticate.'})
    }
}

const authLabDoctor=async(req,res,next)=>{
    try{
        const token=req.header('Authorization').replace('Bearer ','')
        const decoded= jwt.verify(token,'thisismynewcourse')
        const labDoctor=await LabDoctor.findOne({_id:decoded._id,'tokens.token':token})

        if(!labDoctor){
             throw new Error('please authenticate')
        }
        req.labDoctor=labDoctor
        req.token = token
            next()
    }catch(e){
        res.status(401).send({error:'please authenticate.'})
    }
}

const authLab=async(req,res,next)=>{
    try{
        const token=req.header('Authorization').replace('Bearer ','')
        const decoded= jwt.verify(token,'thisismynewcourse')
        const lab=await Lab.findOne({_id:decoded._id,'tokens.token':token})

        if(!lab){
             throw new Error('please authenticate')
        }
        req.lab=lab
        req.token = token
        next()
    }catch(e){
        res.status(401).send({error:'please authenticate.'})
    }
}

const authPatient=async(req,res,next)=>{
    try{
        const token=req.header('Authorization').replace('Bearer ','')
        const decoded= jwt.verify(token,'1')
        const patient=await Patient.findOne({_id:decoded._id,'tokens.token':token})
        console.log(patient)
        if(!patient){
             throw new Error('please authenticate')
        }
        req.patient = patient
        req.token = token
        next()
    }catch(e){
        res.status(401).send({error:'please authenticate.'})
    }
}

const authMedical=async(req,res,next)=>{
    try{
        const token=req.header('Authorization').replace('Bearer ','')
        const decoded= jwt.verify(token,'thisismynewcourse')
        const medical=await Medical.findOne({_id:decoded._id,'tokens.token':token})

        if(!medical){
             throw new Error('please authenticate')
        }
        req.medical = medical
        req.token = token
        next()
    }catch(e){
        res.status(401).send({error:'please authenticate.'})
    }
}

module.exports= {
    authDoctor,
    authHospital,
    authLabDoctor,
    authLab,
    authPatient,
    authMedical
}
