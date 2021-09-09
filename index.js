const app = require('express')();
var fs = require('fs');
var privateKey  = fs.readFileSync('privkey.pem', 'utf8');
var certificate = fs.readFileSync('fullchain.pem', 'utf8');
var credentials = {key: privateKey, cert: certificate};
const https = require('https').Server(credentials, app);
const io = require('socket.io')(https);
const port = process.env.PORT || 443;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  socket.on('chat message', msg => {
    io.emit('chat message', msg);
  });
});

https.listen(port, () => {
  console.log(`Socket.IO server running at https://0.0.0.0:${port}/`);
});
