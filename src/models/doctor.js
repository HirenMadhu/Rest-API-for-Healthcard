const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')


const prefix = 'D'
var nextID = 1
var ID = 'D000000'


const doctorSchema = new mongoose.Schema({
    DID:{
        type: String,
        required: true,
        unique:true
    },
    name: {
       firstName:{type:String, required:true},
       lastName:{type:String, required:true}
    },
    contact_no:{
        type: Number,
        required: true,
        validate(value){
            if(value.toString().length!=10){
                throw new Error('Invalid concact no!')
            }
        }
    },
    email:{
        type: String,
        required: true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Invalid email adresss!')
            }
        }
    },
    address:{
        houseNumber: String,
        street: String,
        city: String
    },
    degree:{
        type: String,
        required: true,
        trim: true
    },
    HID:{
        type: String,
    },
    cases_handled:{
        type: Array,
        default:[]
    },
    password:{
        type:String,
        minlength:6,
        required: true,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('password cannot contain "password"')
            }
        }
    },
    rand:{
        type:Number
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})

doctorSchema.statics.getNextID = function(){
    if( nextID <10 ){
        ID = prefix+ '00000' + nextID.toString()
        nextID += 1
    }else if(nextID<100){
        ID = prefix+ '0000' + nextID.toString()
        nextID += 1
    }else if(nextID<1000){
        ID = prefix+ '000' + nextID.toString()
        nextID += 1
    }else if(nextID<10000){
        ID = prefix+ '00' + nextID.toString()
        nextID += 1
    }else if(nextID<100000){
        ID = prefix+ '0' + nextID.toString()
        nextID += 1
    }else if(nextID<1000000){
        ID = prefix + nextID.toString()
        nextID += 1
    }
    return ID
}

doctorSchema.methods.generateAuthToken= async function(){
    const doctor = this
    const token=jwt.sign({_id:doctor._id.toString()},'thisismynewcourse')
    doctor.tokens=doctor.tokens.concat({ token })
    await doctor.save()
    return token
}

doctorSchema.statics.findByCredentials=async(email,password)=>{
    try{
    const doctor=await Doctor.findOne({email})
    //console.log(doctor)

    if(!doctor){
        throw new Error('unable to login')
    }

    const isMatch= await bcrypt.compare(password,doctor.password)

    if(!isMatch){
        throw new Error('unable to login')
    }
    console.log(isMatch)
    return doctor
}catch(e){
    console.log(e)
}
}

doctorSchema.pre('save',async function (next){

    const doctor = this

    if(doctor.isModified('password')){
        doctor.password = await bcrypt.hash(doctor.password,8)
       
    }
    console.log(doctor.password)
    next()

})

const Doctor = mongoose.model('Doctor', doctorSchema)

module.exports = Doctor