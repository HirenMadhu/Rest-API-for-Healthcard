function generateMail(id,name){
    const msg =`<p>Welcome to the HealthCard family, ${name}</p><br>
    <p>Your unique ID is:</p>
    <h1>${id}</h1>
    <p>In order to start using our service you'll need to first complete a verification.</p><br>
    <p>Enter the password you like to login!</p>`
    return msg
}
module.exports = generateMail