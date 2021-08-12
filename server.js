const express = require('express')
const fetch = require('node-fetch')
const redis = require('redis')


const app = express()

const PORT = process.env.PORT || 5000
const REDIS_PORT = process.env.REDIS_PORT || 6379

app.use(express.json())

const client = redis.createClient(REDIS_PORT)

const getProfile = async (req, res, next) => {

    try {
        console.log('Fetching Data...');

        const { username } = req.params;

        const response = await fetch(`https://api.github.com/users/${username}`)

        const data = await response.json();

        const name = data.name;

        // Set to Redis 
        client.setex(username, 3600, name)

        res.status(200).send(name)

    } catch (err) {
        console.log(err);
        res.status(500);
    }
}

const cache = async (req, res, next) => {

    const { username } = req.params;

    client.get(username, (err, data) => {

        if (err) throw err

        if (data) {
            res.status(200).send(data)
        } else {
            next()
        }
    })
}
//Route
app.get('/profile/:username', cache, getProfile)

app.listen(PORT, console.log(`App is listening on port ${PORT}`))