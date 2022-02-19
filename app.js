// modules import
const express = require("express")
const dotenv = require("dotenv")
var cors = require('cors')
const app =express()
dotenv.config({path:'./config.env'})

// importing db connection
require("./db/conn")

// linking the router = middleware
app.use(express.json())
app.use(cors())
app.use(require('./router/auth'));

// envs definition
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`connection is setup at ${PORT}`)
})