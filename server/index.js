const app = require('express')()
const https = require('https').createServer(app)
const io = require('socket.io')(https)

io.on('connection', socket => {
  socket.on('paused', (paused) => {
    io.emit('paused', paused)
  })

  socket.on('seeked', (seek) => {
    io.emit('seeked', seek)
  })
  socket.on('urlChange', (url) => {
    io.emit('urlChange', url)
  })
})

http.listen(4000, function() {
  console.log('listening on port 4000')
})
