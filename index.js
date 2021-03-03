
const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const testSpeed = require('./puppeteer');
const Queue = require('./Queue');
const port = 3000

app.use(bodyParser());
const queue = new Queue();

app.post('/', async (req, res) => {
    const body = req.body;
    if(!body.username || !body.password || !body.ip || !body.port || !body.mirror || !body.id) {
        res.status(400);
        res.send("Please provide id, mirror, username, password, ip, and port");
    }

    queue.addTest(body.id, body.username, body.password, body.ip, body.port, body.mirror);
    
    res.send({done: true});
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
