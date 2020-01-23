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
require('../models/hospital')
require('../models/lab')
require('../models/labDoctor')
require('../models/labReport')
require('../models/medical')
require('../models/medicalBill')
require('../models/patient')
