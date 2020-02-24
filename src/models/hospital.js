const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')

const prefix = 'H'
var nextID = 1
var ID = 'H000000'


const hospitalSchema = new mongoose.Schema({
    HID:{
        type: String,
        required: true,
        unique:true,
        index:true
    },
    name:{
        type: String,
        required : true,
    },
    phoneNo:{
        type: Number,
        required: true,
        validator(value){
            if(value.toString().length != 11){
                throw new error('Invalid Phone Number')
            }
        }
    },
    email:{
        type: String,
        required: true,
        trim:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Invalid email adresss!')
            }
        }
    },
    address:{
        addressLine1:String,
        addressLine2:String,
        area:String,
        city:String,
        pincode: Number,
    },
    type:{
        type:String,
        required: true,
    },
    doctors:[{
        type:String
    }],
    cases_handled:{
        type: Array,
        default:[]
    },
    password:{
        type:Number,
        required: true,
        min: 100000,
        max: 999999
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})

hospitalSchema.statics.getNextID = function(){
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

hospitalSchema.methods.generateAuthToken= async function(){
    const hospital = this
    const token=jwt.sign({_id:hospital._id.toString()},'thisismynewcourse')
    hospital.tokens=hospital.tokens.concat({ token })
    await hospital.save()
    return token
}

hospitalSchema.statics.findByCredentials=async(email,password)=>{
    try{
        const hospital=await Hospital.findOne({email})

        if(!hospital){
         throw new Error('unable to login')
        }

        const isMatch= await bcrypt.compare(password,hospital.password)

        if(!isMatch){
            throw new Error('unable to login')
        }
        console.log(isMatch)
        return hospital
    }catch(e){
        console.log(e)
    }
}

hospitalSchema.pre('save',async function (next){
    const hospital = this
    if(hospital.isModified('password')){
        hospital.password = await bcrypt.hash(hospital.password,8)
    }
    next()
})

const Hospital = new mongoose.model('Hospital', hospitalSchema)

module.exports = Hospital