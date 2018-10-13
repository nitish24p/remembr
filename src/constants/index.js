//const BASE_URL = 'http://192.168.1.7:5000';
const BASE_URL = 'http://localhost:5000';

const URLS = {
  CREATE_ROOM: '/createRoom'
};

const SOCKET_EVENTS = {
  room: 'room'
};

module.exports = {
  BASE_URL,
  URLS,
  SOCKET_EVENTS
};