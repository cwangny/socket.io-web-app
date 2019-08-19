//Server
 
//Importing new modules in old js. ES6 hasn't not been implemented yet in node
//Importing modules and libraries
const express = require('express');
const app = express();
const port = 3000;
const path = require('path')
//Importing http library
const http = require('http').createServer(app);

//Importing socket.io library
const io = require('socket.io')(http);

users = [];
connections = [];

//Initilize and create a route
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

//Use static files: CSS
app.use('/static', express.static('static'));

//VERY IMP: Example of events are connection, disconnect. They are native events. You can use .emit to create custom events. If you misspell it will not work.
//Open a connection with Socket.io
io.on('connection', function(socket) {
    //Connect
    //When a 'connection' event is detected, connections array is incremented by 1.
    connections.push(socket);
    console.log(`Connected: ${connections.length} sockets connected`);

    //Disconnect
    //When a 'disconnect' event is detected, connections array is incremented by -1.
    socket.on('disconnect', function(data) {
      connections.splice(connections.indexOf(socket), 1);
      console.log(`Disconnected: ${connections.length} sockets still connected`);
    })
    
    //Send Messages
    //When the send button is clicked, the client side will send 'send message' event, this function will catch that and return a new event 'new message'
    socket.on('send message', function(data){
      console.log(data)
      io.emit('new message', { msg: data });
    });
});

//Run the server
http.listen(port);
console.log(`Server started in port: ${port}`);




