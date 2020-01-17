const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://hiren:j5ZmZHQdO2DiLSqQ@healthcard-8awwz.mongodb.net/test?retryWrites=true&w=majority',{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log('connected to atlas')
}).catch(()=>{
    console.log('cant connect')
})


require('../models/doctor')