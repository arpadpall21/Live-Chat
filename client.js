import websocket from 'websocket';
import BoardHandler from './utils/boardHandler.js';

const WebSocketClient = websocket.client;
const client = new WebSocketClient();

client.on('connectFailed', (error) => {
  console.log(`Connect Error: ${error.toString()}`);
});

client.on('connect', (connection) => {
  console.log('connected');
  const board = new BoardHandler('client', 'server', './peers/client', connection);

  connection.on('error', (error) => {
    console.log(`$Connection Error: ${error.toString()}`);
  });

  connection.on('close', () => {
    console.log('basic-chat Connection Closed');
  });

  connection.on('message', (message) => {
    board.write(message);
  });
});

client.connect('ws://localhost:8080/', 'basic-chat');
