const express = require('express')
require('./db/mongoose')
const doctorRouter = require('./routers/doctor')

const app = express()

app.use((req,res,next) => {
    const isUnderMaintenence = false
    if(isUnderMaintenence){
        return res.status(503).send('Site is temporarily down for maitenence. Check back soon!')
    }
    next()
})

app.use(doctorRouter)

app.listen(3000,()=>{
    console.log('Listening to port 3000')
})