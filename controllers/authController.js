const User = require("../models/User")
const {attachCookiesToResponse, createTokenUser, sendVerificationEmail, sendResetPasswordEmail} = require('../utils')
const crypto = require('crypto')
const CustomError = require('../errors')
const Token = require("../models/Token")
const { StatusCodes } = require("http-status-codes")


const login = async (req, res)=>{
    const {email, password} = req.body

    if(!email || !password){
        throw new CustomError.BadRequestError('Please provide email and password creadentials')
    }
    // get the user from the db
    const user = await User.findOne({email: email})
    if(!user){
        throw new CustomError.UnauthorizedError('Please provide valid email')
    }
    if(!user.comparePassword(password)){
        throw new CustomError.UnauthorizedError('Invalid Credentials')
    }
    if(!user.isVerified){
        throw new CustomError.UnauthorizedError('Please Verify your email')
    }
    // check if is already logged (exist a token for the user)
    const dbToken = await Token.findOne({user:user._id})
    if(dbToken && !dbToken.isValid){
        throw new CustomError.UnauthorizedError('No permission')
    }
    const tokenUser = createTokenUser(user)
    if(dbToken){
        const refreshToken = dbToken.refreshToken
        attachCookiesToResponse({res, user:tokenUser, refreshToken:refreshToken })
        res.status(StatusCodes.OK).json({msg:`Logged In: Welcome ${user.name}`})
    }else{
        const refreshToken = crypto.randomBytes(40).toString('hex')
        const userAgent = req.headers['user-agent']
        const ip = req.ip
        const newdbToken = await Token.create({refreshToken, ip, userAgent, user: user._id, })
        // no metes el user entero claro, metes lo que has creado que no tiene datos redundantes o sensibles
        attachCookiesToResponse({res, user: tokenUser, refreshToken})
        res.status(StatusCodes.OK).json({msg:`Logged In: Welcome ${user.name}`})
    }
}

const register = async (req, res)=>{
    const {name, email, password, front} = req.body
    if(!name || !email || !password){
        throw new CustomError.BadRequestError('Please provide all credentials')
    }
    const isFirstAccount = (await User.countDocuments({})) === 0
    const role = isFirstAccount ? 'admin' : 'user'
    const verificationToken = crypto.randomBytes(40).toString('hex')
    const user = await User.create({name, email, password, verificationToken, role})
    // when sending our verification email we have to distiguise if the user is working from frontend or directly on the api
    // (becouse for now idk any frontend but in the future i will)
    const origin = process.env.ORIGIN_BACK
    if(front){
        origin = process.env.ORIGIN_FRONT
    }
    sendVerificationEmail({name, email, verificationToken, origin, front}) // this need to be changed when in production ethereal for some real email
    res.status(StatusCodes.CREATED).json({msg:'Please check your mail to verify your account'})
}

const verifyEmail = async (req,res) =>{
    const {token, email} = req.query
    if(!token || ! email){
        throw new CustomError.BadRequestError('No email or token, you are lost i think')
    }
    const user = await User.findOne({email})
    if(!user|| user.verificationToken !== token){
        throw new CustomError.UnauthorizedError('Not authorized, Bad email/token')
    }
    user.isVerified = true
    user.verified = new Date(Date.now())
    user.verificationToken = null
    await user.validate()
    await user.save()
    res.status(StatusCodes.OK).send(`<h2>Congrats ${user.name}, account verified</h2>`)
}
const forgotPassword = async (req,res)=>{
    //recibe front para modelar el comportamiento y el link si es para uso de front+api o solo api
    const {email, front} = req.body
    if(!email){
        throw new CustomError.BadRequestError('please provide email')
    }
    const user = await User.findOne({email})
    if(!user){
        throw new CustomError.UnauthenticatedError('invalid email')
    }
    const passwordToken = crypto.randomBytes(70).toString('hex')
    if(front){
        const origin = 'http://localhost:3000'
    }else{
        const origin = 'http://localhost:5000'
    }
    sendResetPasswordEmail({name: user.name, email, passwordToken, origin, front})

    res.status(StatusCodes.OK).json({msg: 'Please check your email'})
}

const resetPassword = async (req,res)=>{
    const {email, token} = req.query
    const {password} = req.body
    if(!password||!email||!token){
        throw new CustomError.BadRequestError('Please provide all credentials')
    }
    const user = await User.findOne({email})
    if(!user){
        throw new CustomError.UnauthorizedError('invalid Credentials')
    }
    // check for the password token and the expiration
    if(user.passwordToken !== token || user.passwordTokenExpirationDate < new Date(Date.now)){
        throw new CustomError.UnauthorizedError('invalid/expired Token')
    }
    user.password = password
    user.passwordToken=null
    user.passwordTokenExpirationDate = null
    await user.validate()
    await user.save()
    res.status(StatusCodes.OK).json({msg:'Awesome, password updated!!'})
}

const logout = async (req, res)=>{
    // we delete the token from the db so no refresh is possible now
    await Token.findOneAndDelete({user:req.user.userId})
    res.cookie('refreshToken', 'logout',{
        httpOnly: true,
        expires: new Date(Date.now()+1000)
    })
    res.cookie('accessToken', 'logout',{
        httpOnly:true,
        expires: new Date(Date.now()+1000)
    })
    res.status(StatusCodes.OK).json({msg:`logged out, goodbye ${req.user.name}`})
}

const showMe = (req, res)=>{
    res.status(StatusCodes.OK).json({msg:`hi ${req.user.name}`})
}

module.exports = {login,register,logout,verifyEmail,resetPassword,forgotPassword, showMe}