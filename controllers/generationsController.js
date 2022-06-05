const ImageGen = require('../models/ImageGen')
const {StatusCodes} = require('http-status-codes')
const {checkPermissions} = require('../utils')
const CustomError = require('../errors')


const getGenerations = async (req,res)=>{
    const {name, invert, format} = req.query
    let search = req.query.search
    let query ={}
    query.user = req.user.userId
    if(name) query.name = name
    if(invert !== undefined) query.invert = invert == 'true'
    if(format)query.format = format
    if(search){
        search = search.trim()
        search = search.replace(' ','|')
        query.description = {$regex :`${search}`, $options:'i'}
    }
    const gens = await ImageGen.find(query).select('-user')
    res.status(StatusCodes.OK).json({count : gens.length, generations: gens})
}

const getAllGenerations = async (req,res)=>{
    const {name, invert, format} = req.query
    let search = req.query.search
    let query ={}
    if(name) query.name = name
    if(invert !== undefined) query.invert = invert == 'true'
    if(format)query.format = format
    if(search){
        search = search.trim()
        search = search.replace(' ','|')
        query.description = {$regex :`${search}`, $options:'i'}
    }
    const gens = await ImageGen.find(query).populate({path:'user', select:'name'})
    res.status(StatusCodes.OK).json({count:gens.length, generations: gens})
}

const updateGeneration = async (req,res)=>{
    const{id} = req.params
    const {description, name} = req.body
    if(!description && !name){
        throw new CustomError.BadRequestError('please provide new description or name')
    }
    const gen = await ImageGen.findOne({_id:id})
    if(!gen){
        throw new CustomError('No generetion w such id')
    }
    checkPermissions(req.user, gen.user)
    if(description) gen.description = description
    if(name) gen.name = name

    await gen.validate()
    await gen.save()

    res.status(StatusCodes.OK).json({new_generation: gen})
}

const deleteGeneration= async (req,res)=>{
    const{id} = req.params
    const gen = await ImageGen.findOne({_id:id})
    if(!gen){
        throw new CustomError('No generetion w such id')
    }
    checkPermissions(req.user, gen.user)
    const name = gen.name
    await gen.delete()

    res.status(StatusCodes.OK).json({msg: `deleted ${name}`})
}

module.exports = {getAllGenerations,getGenerations, deleteGeneration, updateGeneration}