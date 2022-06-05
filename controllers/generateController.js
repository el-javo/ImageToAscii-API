const { StatusCodes } = require("http-status-codes")
const CustomError = require("../errors")
const ImageGen = require('../models/ImageGen')
const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);
const path = require('path')
const cloudinary = require('cloudinary').v2
const fs = require('fs');

const generate = async (req,res)=>{
    const {image} = req.files
    let {invert, resolution, name, format,contrast,description,replace, backgroundColor, fontColor, upload} = req.body
    if(!format||!image){
        throw new CustomError.BadRequestError('Must provide image')
    }
    if(!name)name = 'noname'
    if(image.mimetype !== 'image/jpeg'&&image.mimetype !== 'image/jpg'){
        throw new CustomError.BadRequestError('Image type must be jpg/jpeg')
    }
    invert = invert == 'true'
    replace = replace == 'true'
    if(!resolution) resolution = 0.05
    if(!contrast)contrast = 1.5
    if(!description)description = 'no description'
    if(resolution<0 || resolution>1){
        throw new CustomError.BadRequestError('Resolutin must be between [0,1]')
    }
    if (format == 'img'){
        const colors = backgroundColor.concat(fontColor)
        if(colors.length == 6){
            for(let color of colors){
                if(Number(color) < 0 || Number(color) > 255){
                    throw new CustomError.BadRequestError('please introduce valid RGB color')
                }
            }
        }else{
            backgroundColor = [255,255,255]
            fontColor = [0,0,0]
        }
    }
    if(upload){
        const existingImg = await ImageGen.find({user:req.user.userId, name})//if upload
        if(existingImg.length > 0){
            if(replace){
                await existingImg[0].delete()
            }else{
                throw new CustomError.BadRequestError('Duplicated name, you already have a img w such name')
            }
        }
    }
    //move the img to the py folder
    let imgPath = path.join(__dirname,'..')
    imgPath = path.join(imgPath,'/py/in/imgin.jpg')
    await image.mv(imgPath)
    //run the py with all params
    const strinvert = invert ? 'true':'false'
    const command = `python py/ImageToAsciiOP.py py/in/imgin.jpg py/out/canvas.txt ${resolution} ${contrast} ${strinvert}`
    const img2ascii = await exec(command)
    let url = 'not defined'

    if(format == 'txt' && upload){
        //upload the txt to the platform
        // por que a veces se supone que wd es controllers y otras veces root? idk
        const result = await cloudinary.uploader.upload('py/out/canvas.txt', {folder:'txt', unique_filename:true, use_filename:true, resource_type: 'auto' })
        url = result.secure_url
        //delete temp files. we dont need to remoove the out file bc it overwrites
        fs.unlink('py/in/imgin.jpg',()=>{return})
    }
    if(format == 'img'){
        //txt -> jpg
        const command = `python py/asciiToImage.py py/out/canvas.txt py/out/canvas.jpg ${backgroundColor[0]} ${backgroundColor[1]} ${backgroundColor[2]} ${fontColor[0]} ${fontColor[1]} ${fontColor[2]}`
        const asciiToImage = await exec(command)
        //upload the jpg to the platform
        if(upload){
            let img_stats = fs.statSync('./py/out/canvas.jpg')
            // the max size of cloudinary........
            if(img_stats.size >10485760){
                throw new CustomError.BadRequestError('file too big to be uploadaded to cloud. Try with generateImgNoUp')
            }
            const result = await cloudinary.uploader.upload('py/out/canvas.jpg', {folder:'img', unique_filename:true, use_filename:true, resource_type: 'auto' })
            url = result.secure_url
        }
        //delete temp files
        fs.unlink('py/in/imgin.jpg',()=>{return})
    }
    const fileToSend = format == 'txt' ? './py/out/canvas.txt':'./py/out/canvas.jpg'
    if(upload){
        //save the imageGen
        const generatedImg = await ImageGen.create({url, name, resolution, invert, contrast, description, user:req.user.userId, format })
        res.status(StatusCodes.CREATED).json({imageGen:generatedImg})
    }else{
        //return the data
        const file = path.resolve(fileToSend)
        res.status(StatusCodes.CREATED).sendFile(file)
    }
}

// this is like a middleware but too little to be in middlewares... idk why i did that
const buildReqBody = ({format, upload})=>{
    return (req,res,next) =>{
        req.body.format = format
        req.body.upload = upload
        next()
    }
}


module.exports = {
    buildReqBody,
    generate
}