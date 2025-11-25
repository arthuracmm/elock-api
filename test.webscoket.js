const { io } = require('socket.io-client');
const HOST = 'http://localhost:8000';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQXJ0aHVyIENlc2FyIE1hcmNlbGlubyIsImVtYWlsIjoiYXJ0aHVyQGV4YW1wbGUuY29tIiwic3ViIjozLCJpYXQiOjE3NjQwMzYyOTUsImV4cCI6MTc2NDEyMjY5NX0.kyvDwP7zV4AI5cWAtu2j7gLv0YB_sybX28FofnGzwyM';
const LOCK_ID = 1;

const socket = io(HOST, { auth: { token: TOKEN }, transports: ['websocket'] });

socket.on('connect', () => {
    console.log('connected', socket.id);
    socket.emit('join-lock', { lockId: LOCK_ID });
});

socket.on('joined-lock', (d) => console.log('joined', d));
socket.on('door-lock-updated', (p) => console.log('door-lock-updated', p));
socket.on('door-lock-removed', (p) => console.log('door-lock-removed', p));
socket.on('disconnect', () => console.log('disconnected'));
socket.on('connect_error', (err) => console.log('connect_error', err.message));