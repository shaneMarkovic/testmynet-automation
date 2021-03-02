
const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const testSpeed = require('./puppeteer');
const automatic = require('./automatic');
const port = 3000

app.use(bodyParser());

app.post('/', async (req, res) => {
    const body = req.body;
    if(!body.username || !body.password || !body.ip || !body.port || !body.mirror || !body.id) {
        res.status(400);
        res.send("Please provide id, mirror, username, password, ip, and port");
    }

    automatic(body.id, body.username, body.password, body.ip, body.port, body.mirror);
    res.send({done: true});
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
