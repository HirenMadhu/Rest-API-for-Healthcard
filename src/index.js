const express = require('express')
require('./db/mongoose')

const port = process.env.PORT

const doctorRouter = require('./routers/doctor')
const caseRouter=require('./routers/case')
const hospitalRouter=require('./routers/hospital')
const labRouter=require('./routers/lab')
const labDoctorRouter=require('./routers/labDoctor')
const labReportRouter=require('./routers/labReport')
const medicalRouter=require('./routers/medical')
const medicalBillRouter=require('./routers/medicalBill')
const patientRouter=require('./routers/patient')
const adminRouter=require('./routers/admin')
const verifyAdmin = require('./emails/adminVerification')
const Admin = require('./models/admin')

const app = express()
const superAdminPassword = 'theblackpearl'

app.use((req,res,next) => {
    const isUnderMaintenence = false
    if(isUnderMaintenence){
        return res.status(503).send('Site is temporarily down for maitenence. Check back soon!')
    }
    next()
})
app.use(express.json())
app.use(doctorRouter)
app.use(caseRouter)
app.use(labDoctorRouter)
app.use(hospitalRouter)
app.use(labRouter)
app.use(labReportRouter)
app.use(medicalRouter)
app.use(medicalBillRouter)
app.use(patientRouter)
app.use(adminRouter)

app.post('/adminVerification', async (req,res)=>{
    try{
        const admin = await Admin.findOne({"AID":req.body.AID})
        if(admin && !admin.verficationDone){
            console.log(req.body.password)
            console.log(superAdminPassword)
            if(req.body.password === superAdminPassword){
                admin.verficationDone == true
                await admin.save()
                verifyAdmin.afterVerification(admin)
                res.status(200).send({msg:"Verification done"})
            }else{
                res.send({msg:"enter correct password!"})
            }
        }else if(!admin){
            res.send({msg:"No such AIDs exist"})
        }else{
            res.send({msg:"admin already verified"})
        }
    }catch(e){
        res.status(400).send(e)
    }
})

app.listen(port,()=>{
    console.log('Listening to port '+port)
})