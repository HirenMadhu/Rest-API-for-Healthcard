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

const app = express()

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

app.listen(port,()=>{
    console.log('Listening to port '+port)
})