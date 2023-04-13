import { server as WebSocketServer } from 'websocket';
import http from 'http';
import BoardHandler from './utils/boardHandler.js';

const server = http.createServer((request, response) => {
  response.writeHead(404);
  response.end();
});

server.listen(8080, () => {
  console.log('server listening on port 8080');
});

const wsServer = new WebSocketServer({ httpServer: server, autoAcceptConnections: false });

wsServer.on('request', (request) => {
  const connection = request.accept('basic-chat', request.origin);
  console.log('Connection accepted');
  const board = new BoardHandler('server', 'client', './peers/server', connection);

  connection.on('message', (message) => {
    board.write(message);
  });

  connection.on('close', () => {
    console.log(`Peer ${connection.remoteAddress} disconnected`);
  });
});
