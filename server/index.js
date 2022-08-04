const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

io.on('connection', socket => {
  socket.on('paused', (paused) => {
    io.emit('paused', paused)
  })

  socket.on('seeked', (seek) => {
    io.emit('seeked', seek)
  })
})

http.listen(4000, function() {
  console.log('listening on port 4000')
})
