const sendEmail = require('./sendEmail')

const sendVerificationEmail = async ({name, email, verificationToken, origin, front}) =>{
    let verifyLink = ''
    if(front){
        //when clicking the link user go to this frontend page and the frontend automatically do a call to the api to verify
        verifyLink = `${origin}/user/verify-email?token=${verificationToken}&email=${email}`
    }else{
        //when clicking the link user make a call to the api and verify the email
        verifyLink = `${origin}/api/v1/auth/verify-email?token=${verificationToken}&email=${email}`
    }
    const msg = `<p>please confirm your email by clicking on the following link: <a href ="${verifyLink}">Verify Email</a></p>`
    
    return sendEmail({
        to:email, 
        subject:'Email verification', 
        html:`<h4>Hello, ${name}</h4> ${msg}`
    })
}

module.exports = sendVerificationEmail