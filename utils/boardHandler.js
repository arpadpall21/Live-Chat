import { watchFile, readFile, appendFile } from 'node:fs';

export default class BoardHandler {
  constructor(currentPeerName, targetPeerName, boardFile, connection) {
    this.currentPeerName = currentPeerName;
    this.targetPeerName = targetPeerName;
    this.connection = connection;
    this.board = boardFile;
    this.watch();
  }

  watch() {
    watchFile(this.board, () => {
      readFile(this.board, (err, data) => {
        const decodedMessage = data.toString();

        if (decodedMessage.slice(-6) === '<send>') {
          const regexpPattern = `(?<=${this.currentPeerName}: ).*(?=<send>$)`;
          const message = RegExp(regexpPattern, 'g').exec(decodedMessage);
          this.connection.sendUTF(message);

          appendFile(this.board, `\n${this.currentPeerName}: `, (err) => {
            if (err) {
              console.error(`Failed to write message on board: ${err}`);
            }
          });
        }
      });
    });
  }

  write(message) {
    const _message = `\n${this.targetPeerName}: ${message.utf8Data}\n${this.currentPeerName}: `;
    appendFile(this.board, _message, (err) => {
      if (err) {
        console.error(`Failed to write message on board: ${err}`);
      }
    });
  }
}
