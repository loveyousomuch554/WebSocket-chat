const app = require('express')();
const http = require('http')
const WebSocket = require('ws')
const path = require('path')

const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

wss.on('connection', function connection(ws, req) {
    ws.on('message', function incoming(message) {
        // console.log(message)
        ws.send(message)
    })

    console.log(req.socket.remoteAddress)
})


wss.on('close', function close() {
    console.log('connection closed')
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})

server.listen(8080)