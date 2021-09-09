var express = require('express');
var app = express();
var fs = require('fs');
var privateKey  = fs.readFileSync('privkey.pem', 'utf8');
var certificate = fs.readFileSync('fullchain.pem', 'utf8');
var credentials = {key: privateKey, cert: certificate};
const server = require('https').Server(credentials, app);
const io = require('socket.io')(server);
const port = process.env.PORT || 443;

app.use(express.static(__dirname + '/'));
// app.use(bodyParser.urlencoded({extend:true}));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.set('views', __dirname);

app.get('/', (req, res) => {
  var messages = [];
  if(fs.existsSync("messages.json")) {
    let rawdata = fs.readFileSync('messages.json');
    messages = JSON.parse(rawdata);
  }
  if (messages.length > 10) {
    messages = messages.slice(messages.length - 10, messages.length);
  }
  res.render('index', {items: messages})
});

io.on('connection', (socket) => {
  socket.on('chat message', msg => {
    var messages = [];
    if(fs.existsSync("messages.json")) {
      let rawdata = fs.readFileSync('messages.json');
      messages = JSON.parse(rawdata);
    }
    messages.push(msg);
    fs.writeFile("messages.json", JSON.stringify(messages), err => {});
    io.emit('chat message', msg);
  });
});

server.listen(port, () => {
  console.log(`Socket.IO server running at https://0.0.0.0:${port}/`);
});
