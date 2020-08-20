const express = require('express'), app = express()
const http = require('http')
const WebSocket = require('ws')
const path = require('path')
const config = require('config')
const { saveMessage, getPreviousMsgs } = require('./controllers/messageController')
const PORT = config.get('port')

// connect mongoDB
const mongoose = require('mongoose')
mongoose.connect(config.get('mongoID') , {useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
    if(err) throw err;
})

const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

app.use('/chat', express.static(path.join(__dirname, '/public')))

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// sign in 
app.use('/auth', require('./routes/signin'))
// sign up
app.use('/auth', require('./routes/signup'))
app.get('/', (req, res) => {
    res.redirect(`http://localhost:${PORT}/chat`)
})
app.use('/chat/room', require('./routes/chatRoom'))

wss.on('connection', async function connection(ws, req) {
    // receive data from client
    ws.on('message', async function incoming(message) {
        let rawMessage = JSON.parse(message)

        if(rawMessage.type === 'setUserData') {
            /**
             * After downloading the client, the client sends the user's data to the server,
             * the server sets the data and sends the previous messages to the client
             */
            ws.user = rawMessage
            return await sendPreviousMessages(ws)
        }
        
        message = JSON.stringify( { type: 'message', ...rawMessage } )

        sendMessages(ws, message)
        let response = await saveMessage(message)
    })
})

wss.on('close', function close() {
    console.log('connection closed')
})

/**
 * @param {object} ws 
 * @param {string} message - JSON object from received message
 */
function sendMessages(ws, message) {
    wss.clients.forEach(client => {
        client.send(message);
    })
}

async function sendPreviousMessages(ws) {
    let rawPreviousMsgs = await getPreviousMsgs()
    let previousMsgs = rawPreviousMsgs.map(messageObj => messageObj.message) 
    ws.send( JSON.stringify({ type: 'previousMsgs', previousMsgs }) )
}

server.listen(PORT)