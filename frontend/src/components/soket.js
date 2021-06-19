import socketIOClient from 'socket.io-client';
const ENDPOINT =
  window.location.host.indexOf('localhost') >= 0
    ? 'http://127.0.0.1:5000'
    : window.location.host;

export const sk = socketIOClient(ENDPOINT);

