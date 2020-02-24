const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')


const prefix = 'A'
var nextID = 1
var ID = 'D000000'


const adminSchema = new mongoose.Schema({
    AID:{
        type: String,
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
    qualification:{
        type: String,
        required: true,
        trim: true
    },
    password:{
        type:String,
        minlength:6,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('password cannot contain "password"')
            }
        }
    },
    verificationDone:{
        type:Boolean,
        default:false
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})

adminSchema.statics.getNextID = function(){
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

adminSchema.methods.generateAuthToken= async function(){
    const admin = this
    const token=jwt.sign({_id:admin._id.toString()},'thisismynewcourse')
    admin.tokens=admin.tokens.concat({ token })
    await admin.save()
    return token
}

adminSchema.statics.findByCredentials=async(email,password)=>{
    try{
    const admin=await Admin.findOne({email})
    if(!admin){
        throw new Error('unable to login')
    }

    const isMatch= await bcrypt.compare(password,admin.password)

    if(!isMatch){
        throw new Error('unable to login')
    }
    console.log(isMatch)
    return admin
}catch(e){
    console.log(e)
}
}

adminSchema.pre('save',async function (next){

    const admin = this

    if(admin.isModified('password')){
        admin.password = await bcrypt.hash(admin.password,8)
       
    }
    console.log(admin.password)
    next()

})

const Admin = mongoose.model('Admin', adminSchema)

module.exports = Admin