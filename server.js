const express = require('express')
const fetch = require('node-fetch')
const redis = require('redis')


const app = express()


const PORT = process.env.PORT || 5000 
const REDIS_PORT = process.env.REDIS_PORT || 6379 

app.listen(PORT, console.log(`App is listening on port ${PORT}`))