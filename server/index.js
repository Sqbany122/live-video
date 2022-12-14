const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

io.on('connection', socket => {
  socket.on('paused', (paused) => {
    socket.broadcast.emit('paused', paused)
  })

  socket.on('seeked', (seek) => {
    socket.broadcast.emit('seeked', seek)
  })
  socket.on('urlChange', (url) => {
    socket.broadcast.emit('urlChange', url)
  })
})

http.listen(4000, function() {
  console.log('listening on port 4000')
})