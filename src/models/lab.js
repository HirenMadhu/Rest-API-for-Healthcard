const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')

const prefix = 'L'
var nextID = 1
var ID = 'L000000'


const labSchema = new mongoose.Schema({
    LID:{
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
    type:{
        type:String,
        required: true,
    },
    labDoctors:[{
        type:String
    }],
    reportHistory:{
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

labSchema.statics.getNextID = function(){
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

labSchema.methods.generateAuthToken= async function(){
    const lab = this
    const token=jwt.sign({_id:lab._id.toString()},'thisismynewcourse')
    lab.tokens=lab.tokens.concat({ token })
    await lab.save()
    return token
}

labSchema.statics.findByCredentials=async(email,password)=>{
    try{
        const lab=await Lab.findOne({email})

        if(!lab){
         throw new Error('unable to login')
        }

        const isMatch= await bcrypt.compare(password,lab.password)

        if(!isMatch){
            throw new Error('unable to login')
        }
        console.log(isMatch)
        return lab
    }catch(e){
        console.log(e)
    }
}

labSchema.pre('save',async function (next){
    const lab = this
    if(lab.isModified('password')){
        lab.password = await bcrypt.hash(lab.password,8)
    }
    next()
})

const Lab = mongoose.model('Lab', labSchema)

module.exports = Lab