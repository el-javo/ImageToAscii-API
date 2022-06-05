const sendEmail = require('./sendEmail')

const sendResetPasswordEmail = async ({name, email, passwordToken, origin, front}) =>{

    if(front){
        const resetLink = `${origin}/user/reset-password?token=${passwordToken}&email=${email}`
        const msg = `<p>Please follow the link to reset your password: <a href ="${resetLink}">Reset Password</a></p>`
    }else{
        const resetLink = `${origin}/api/v1/auth/reset-password?token=${passwordToken}&email=${email}`
        const msg = `<p>This is the  route link to reset your password, set your new password in the body of the POST request {"password":"yourNewPassword"}: <a href ="${resetLink}">${resetLink}</a></p>`
    }
    

    return sendEmail({
        to:email, 
        subject:'Password Reset', 
        html:`<h4>Hello, ${name}</h4> ${msg}`
    })
}

module.exports = sendResetPasswordEmail