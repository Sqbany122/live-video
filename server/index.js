const app = require('express')()
const https = require('https')
const io = require('socket.io')(server)

var options = {
  key: fs.readFileSync('/etc/letsencrypt/live/codepush.pl/privkey.pem'),     
  cert: fs.readFileSync('/etc/letsencrypt/live/codepush.pl/cert.pem'),     
  ca: fs.readFileSync('/etc/letsencrypt/live/codepush.pl/chain.pem'),

  requestCert: false,
  rejectUnauthorized: false
}

var server = https.createServer(options, app);
    server.listen(8080);

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
