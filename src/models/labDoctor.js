const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')

const prefix = 'LD'
var nextID = 1
var ID = 'LD000000'


const labDoctorSchema = mongoose.Schema({
    LDID:{
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
    LID:{
        type:String
    },
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

labDoctorSchema.statics.getNextID = function(){
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

labDoctorSchema.methods.generateAuthToken= async function(){
    const labdoctor = this
    const token=jwt.sign({_id:labdoctor._id.toString()},'thisismynewcourse')
    labdoctor.tokens=labdoctor.tokens.concat({ token })
    await labdoctor.save()
    return token
}

labDoctorSchema.statics.findByCredentials=async(email,password)=>{
    try{
        const labdoctor=await LabDoctor.findOne({email})

        if(!labdoctor){
         throw new Error('unable to login')
        }

        const isMatch= await bcrypt.compare(password,labdoctor.password)

        if(!isMatch){
            throw new Error('unable to login')
        }
        console.log(isMatch)
        return labdoctor
    }catch(e){
        console.log(e)
    }
}

labDoctorSchema.pre('save',async function (next){
    const labdoctor = this
    if(labdoctor.isModified('password')){
        labdoctor.password = await bcrypt.hash(labdoctor.password,8)
    }
    next()
})

const LabDoctor = new mongoose.model('LabDoctor', labDoctorSchema)

module.exports = LabDoctor