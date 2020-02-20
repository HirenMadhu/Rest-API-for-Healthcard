function genrateMail(id,name,random){
    const msg =`<p>Welcome to the HealthCard family, ${name}</p><br>
    <p>Your unique ID is:</p>
    <h1>${id}</h1>
    <p>In order to start using our service you'll need to first complete a verification.</p><br>
    <p>Enter the following OTP to get verified:</p>
    <h3>${random}</h3>`
    return msg
}
module.exports = genrateMail