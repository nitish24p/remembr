//const BASE_URL = 'http://192.168.1.7:5000';
const BASE_URL = process.env.NODE_ENV === 'production' ? 'https://remembr.now.sh':'http://192.168.1.4:5000';

const URLS = {
  CREATE_ROOM: '/createRoom',
  JOIN: '/join'
};

const SOCKET_EVENTS = {
  room: 'room',
  start: 'start'
};

module.exports = {
  BASE_URL,
  URLS,
  SOCKET_EVENTS
};