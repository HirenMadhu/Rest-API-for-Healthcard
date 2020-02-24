const nodemailer = require('nodemailer')
const generateMessage = require('./message')
async function sendMail(user,strUser)
{   
    var id =''
    var name = ''
    switch(strUser.toLowerCase()){
        case('patient'):
            id = user.HCID
            name = user.name.firstName
            break
        case('doctor'):
            id = user.DID
            name = user.name.firstName
            break
        case('labdoctor'):
            id = user.LDID
            name = user.name.firstName
            break
        case('lab'):
            id = user.LID
            name = user.name
            break
        case('medical'):
            id = user.MID
            name = user.name
            break
        case('hospital'):
            id = user.HID
            name = user.name
            break
    }
    msg = generateMessage(id,name)
    try{
        let transporter = nodemailer.createTransport({
            service:'gmail', 
            auth: {
            user: 'sgh.healthcard@gmail.com', // generated ethereal user
            pass: 'theblackpearl' // generated ethereal password
            },
            tls:{
                    rejectUnauthorized:false
            }  
        }    
     )
    
        let info = await transporter.sendMail({
            from: '"Health Card" <gsh.healthcard@gmail.com>', 
            to: user.email, 
            subject: "Welcome", 
            html: msg 
        })   
        console.log("Message sent: %s", info.messageId)
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info))
    }catch(e){
        console.log(e)
    }
}

module.exports = sendMail