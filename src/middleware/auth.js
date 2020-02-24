const jwt=require('jsonwebtoken')
const Doctor=require('../models/doctor')
const Hospital=require('../models/hospital')
const LabDoctor = require('../models/labDoctor')
const Patient = require('../models/patient')
const Lab = require('../models/lab')
const Medical = require('../models/medical')
const Admin = require('../models/admin')


const authDoctor=async(req,res,next)=>{
    try{
        const token=req.header('Authorization').replace('Bearer ','')
        const decoded= jwt.verify(token,'thisismynewcourse')
        const doctor=await Doctor.findOne({_id:decoded._id,'tokens.token':token})
        console.log(token)
        if(!doctor){
             throw new Error('please authenticate')
        }else if(!doctor.verificationDone){
            throw new Error('please verify first')
        }
        req.doctor=doctor
        req.token = token
        next()
    }catch(e){
        res.status(401).send(e)
    }
}

const authHospital=async(req,res,next)=>{
    try{
        const token=req.header('Authorization').replace('Bearer ','')
        const decoded= jwt.verify(token,'thisismynewcourse')
        const hospital=await Hospital.findOne({_id:decoded._id,'tokens.token':token})

        if(!hospital){
             throw new Error('please authenticate')
        }else if(!hospital.verificationDone){
            throw new Error('please verify first')
        }
        req.hospital=hospital
        req.token = token
        next()
    }catch(e){
        res.status(401).send(e)
    }
}

const authLabDoctor=async(req,res,next)=>{
    try{
        const token=req.header('Authorization').replace('Bearer ','')
        const decoded= jwt.verify(token,'thisismynewcourse')
        const labDoctor=await LabDoctor.findOne({_id:decoded._id,'tokens.token':token})

        if(!labDoctor){
             throw new Error('please authenticate')
        }else if(!labDoctor.verificationDone){
             throw new Error('please verify first')
        }
        req.labDoctor=labDoctor
        req.token = token
            next()
    }catch(e){
        res.status(401).send(e)
    }
}

const authLab=async(req,res,next)=>{
    try{
        const token=req.header('Authorization').replace('Bearer ','')
        const decoded= jwt.verify(token,'thisismynewcourse')
        const lab=await Lab.findOne({_id:decoded._id,'tokens.token':token})

        if(!lab){
             throw new Error('please authenticate')
        }else if(!lab.verificationDone){
            throw new Error('please verify first')
       }
        req.lab=lab
        req.token = token
        next()
    }catch(e){
        res.status(401).send(e)
    }
}

const authPatient=async(req,res,next)=>{
    try{
        const token=req.header('Authorization').replace('Bearer ','')
        console.log(token)
        const decoded= jwt.verify(token,'thisismynewcourse')
        const patient=await Patient.findOne({_id:decoded._id,'tokens.token':token})
        console.log(patient)
        if(!patient){
             throw new Error('please authenticate')
        }else if(!patient.verificationDone){
            throw new Error('please verify first')
       }
        req.patient = patient
        req.token = token
        next()
    }catch(e){
        res.status(401).send(e)
    }
}

const authMedical=async(req,res,next)=>{
    try{
        const token=req.header('Authorization').replace('Bearer ','')
        const decoded= jwt.verify(token,'thisismynewcourse')
        const medical=await Medical.findOne({_id:decoded._id,'tokens.token':token})

        if(!medical){
             throw new Error('please authenticate')
        }else if(!medical.verificationDone){
            throw new Error('please verify first')
       }
        req.medical = medical
        req.token = token
        next()
    }catch(e){
        res.status(401).send(e)
    }
}

const authAdmin=async(req,res,next)=>{
    try{
        const token=req.header('Authorization').replace('Bearer ','')
        console.log(token)
        const decoded= jwt.verify(token,'thisismynewcourse')
        const admin=await Admin.findOne({_id:decoded._id,'tokens.token':token})
        console.log(admin)
        if(!admin){
             throw new Error('please authenticate')
        }else if(!admin.verificationDone){
            throw new Error('please get verified first')
        }
        req.admin = admin
        req.token = token
        next()
    }catch(e){
        res.status(401).send(e)
    }
}

module.exports= {
    authDoctor,
    authHospital,
    authLabDoctor,
    authLab,
    authPatient,
    authMedical,
    authAdmin
}
