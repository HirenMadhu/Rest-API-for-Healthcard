const nodemailer = require('nodemailer')
const generateMessage = require('./message')
async function sendMail(user,strUser,rand)
{   
    var id ='something'
    if(strUser=='patient'){
        id = user.HCID
    }else if(strUser=='doctor'){
        id = user.DID
    }else if(strUser=='hospital'){
        id = user.HID
    }else if(strUser=='labdoctor'){
        id = user.LDID
    }else if(strUser=='lab'){
        id = user.LID
    }
    if(strUser.includes("doctor patient labdoctor")){
        msg = generateMessage(id,user.name.firstName,rand)
    }else{
        msg = generateMessage(id,user.name,rand)
    }
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