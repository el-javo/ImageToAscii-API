const nodemailer = require('nodemailer')
const nodemailerConfig = require('./nodemailerConfig')
const sgMail = require('@sendgrid/mail')

const sendEmail = async ({to, subject,html}) =>{
    const msg = {
        to,
        from: 'javimuu99@gmail.com',
        subject,
        html
    }

    if(process.env.EMAIL_PROD == 'false'){
        const transporter = nodemailer.createTransport(nodemailerConfig)
        return transporter.sendMail(msg) 
    }
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    return await sgMail.send(msg)
}

module.exports = sendEmail