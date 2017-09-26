const http = require('http');

const fs = require('fs');

const socketio = require('socket.io');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const index = fs.readFileSync(`${__dirname}/../client/index.html`);

const onRequest = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

const app = http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);

const io = socketio(app);

const onJoined = (sock) => {
  const socket = sock;
  socket.join('room');
  socket.on('newDraw', (data) => {
    console.log(`${data.time}: ${data.coords.x}`);
    io.sockets.in('room').emit('newDraw', data);
  });
};

io.sockets.on('connection', (sock) => {
  onJoined(sock);
});


io.sockets.on('disconnnect', (sock) => {
  sock.leave('room');
});

