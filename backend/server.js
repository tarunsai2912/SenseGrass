const express = require('express')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cron = require('node-cron');
const userRoutes = require("./routes/userRoutes");
const fieldRoutes = require("./routes/fieldRoutes");
const analyticRoutes = require("./routes/analyticRoutes");
const User = require("./model/user")
const paymentRoutes = require("./routes/paymentRoutes");
const fs = require('fs')
const cors = require('cors')
dotenv.config()

const app = express()
const port = process.env.Port || 3003

app.use(cors({ origin: '*' }))

app.use((req, res, next) => {
    const log = `${req.method} - ${req.url} - ${req.ip} - ${new Date()}`
    fs.appendFile('log.txt', log, (err) => {
        if(err){
            console.log(err)
        }
    })
    next()
})

app.use(bodyParser.json())
app.get('/', (req, res) => {
    res.send('Hello! Welcome to Smart Agriculture Management System')
})

app.use("/api/user", userRoutes)
app.use("/api/field", fieldRoutes)
app.use("/api/analytic", analyticRoutes)
app.use("/api/payment", paymentRoutes)

app.use((err, req, res, next) => {
    let log = err.stack
    log += `/n${req.method} - ${req.url} - ${req.ip} - ${new Date()}`
    fs.appendFile('error.txt', log, (err) => {
        if(err){
            console.log(err)
        }
    })
    res.status(500).send("Something went wrong")
})

mongoose.connect(process.env.MONGO_URI)

mongoose.connection.on('connected', () => {
    console.log('MongoDb is connected...')
    cron.schedule('0 0 * * *', async () => { 
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); 
        await User.updateMany({ pro: true, proActivationDate: { $lte: thirtyDaysAgo } }, { $set: { pro: false } }); 
        console.log('Updated fields with expired pro status'); 
    })
})

app.listen(port, () => {
    console.log(`Server is running on ${port} port number`)
})