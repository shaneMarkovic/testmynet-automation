
const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const testSpeed = require('./puppeteer');
const port = 3000

app.use(bodyParser());

app.post('/', async (req, res) => {
    const body = req.body;
    if(!body.username || !body.password || !body.ip || !body.port) {
        res.status(400);
        res.send("Please provide username, password, ip, and port");
    }

    try {
        const results = await testSpeed(body.username, body.password, body.ip, body.port);
        res.send(results);
    } catch (e) {
        res.status(400);
        res.send(e.message);
    }
    
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
