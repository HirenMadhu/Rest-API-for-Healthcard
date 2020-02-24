const nodemailer = require('nodemailer')
const generateMessage = require('./message')
async function sendMail(user,strUser,rand)
{   
    var id =''
    var name = ''
    if(strUser=='patient'){
        id = user.HCID
        name = user.name.firstName
    }else if(strUser=='doctor'){
        id = user.DID
        name = user.name.firstName
    }else if(strUser=='hospital'){
        id = user.HID
        name = user.name
    }else if(strUser=='labdoctor'){
        id = user.LDID
        name = user.name.firstName
    }else if(strUser=='lab'){
        id = user.LID
        name = user.name
    }
    msg = generateMessage(id,name,rand)
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