const nodemailer = require('nodemailer')

async function verificationRequest(admin){
    msg = `<p>A new user by the name ${admin.name.firstName} is trying to login. Do you wish to allow him to become an Admin?</p>
    <p>Out system has assigned him the ID:</p>
    <h1>${admin.AID}</h1>
    <p>If you wish to make him an admin, click on the link below and enter you their AID and password in the given link below!</p>
    <a href="">Verification Link</a>`
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
            to: 'hirenmadhu16@yahoo.com', 
            subject: "New admin request", 
            html: msg 
        })   
        console.log("Message sent: %s", info.messageId)
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info))
    }catch(e){
        console.log(e)
    }
}

async function afterVerification(admin){
    msg = `<p>Hey, ${admin.name.firstName}!</p>
    <p>You have been verified by our super admin.</p>
    <p>Our system has assigned you AID:</p>
    <h1>${admin.AID}</h1>
    <p>Hope you'll do good. We expect big things from you!</p>`
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
            to: admin.email, 
            subject: "Welcome to the club", 
            html: msg 
        })   
        console.log("Message sent: %s", info.messageId)
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info))
    }catch(e){
        console.log(e)
    }

}

module.exports = {
    afterVerification,
    verificationRequest
}