require('express-async-errors')
require('dotenv').config()
//basic
const express = require('express')
const connectDB = require('./db/connect')
const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);
// security middleware
const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
//middleware
const morgan = require('morgan')
const fileUpload = require('express-fileupload')
const errorHandler = require('./middleware/error-handler')
const notFound = require('./middleware/not-found')
const cookieParser = require('cookie-parser')
//routers
const authRouter = require('./routes/authRoutes')
const genRouter = require('./routes/generateRoutes')
const gensRouter = require('./routes/generationsRoutes')
//cloudinary
const cloudinary = require('cloudinary').v2
cloudinary.config({
  cloud_name:process.env.CLOUD_NAME,
  api_key:process.env.CLOUD_API_KEY,
  api_secret:process.env.CLOUD_API_SECRET
})

const app = express()

//security middleware
app.set('trust proxy', 1)
app.use(
    rateLimiter({ //max 60 reqs in 15 mins
        windowMs: 15*60*1000,
        max:60
    })
)
app.use(helmet())
app.use(cors())
app.use(xss())
app.use(mongoSanitize())

// use middleware
app.use(express.json())
app.use(morgan('tiny'))
app.use(fileUpload())
app.use(cookieParser(process.env.JWT_SECRET))
app.use(express.static('./public'))
//routing
app.get('/',(req,res)=>{
    res.send('<h1>Image2Ascii</h1><a href = "http://localhost:5000/docs/">docs</a>')
})
app.use('/api/v1/auth',authRouter)
app.use('/api/v1/gen',genRouter )
app.use('/api/v1/generations', gensRouter)
//use end middleware
app.use(notFound)
app.use(errorHandler)

const port = process.env.PORT||5000

const start = async ()=>{
    await connectDB(process.env.MONGO_URI)
    app.listen(port, ()=>{
        console.log(`Server listening on port ${port}...`);
    })
}
start()