const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const port = 4000

// server config
app.use(express.static('static'))
app.set('views', './templates')
app.set('view engine', 'pug')

// routes
app.get('/', (request, response) => response.render('whiteboard', {title: 'Student Soup Study Group'}))

const onConnect = (conn) => {
  console.log('DRAWING')
  conn.on('drawing', (data) => conn.broadcast.emit('drawing', data))
}

// socket stuff
io.on('connection', onConnect)

server.listen(port, () => console.log(`Student soup server listening on ${port}!`))

