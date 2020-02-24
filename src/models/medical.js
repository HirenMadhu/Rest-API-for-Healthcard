const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')

const prefix = 'M'
var nextID = 1
var ID = 'M000000'


const medicalSchema = new mongoose.Schema({
    MID:{
        type: String,
        required: true,
        unique:true
    },
    name:{
        type:String,
        required:true
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
    billHistory:{
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

medicalSchema.statics.getNextID = function(){
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

medicalSchema.methods.generateAuthToken= async function(){
    const medical = this
    const token=jwt.sign({_id:medical._id.toString()},'thisismynewcourse')
    medical.tokens=medical.tokens.concat({ token })
    await medical.save()
    return token
}

medicalSchema.statics.findByCredentials=async(email,password)=>{
    try{
        const medical=await Medical.findOne({email})

        if(!medical){
         throw new Error('unable to login')
        }

        const isMatch= await bcrypt.compare(password,medical.password)

        if(!isMatch){
            throw new Error('unable to login')
        }
        console.log(isMatch)
        return medical
    }catch(e){
        console.log(e)
    }
}

medicalSchema.pre('save',async function (next){
    const medical = this
    if(medical.isModified('password')){
        medical.password = await bcrypt.hash(medical.password,8)
    }
    next()
})

const Medical = new mongoose.model('Medical',medicalSchema)

module.exports = Medical