//Server side

let express = require('express');
let app = express();
let http = require('http').createServer(app);
let PORT = 3000;
let io = require('socket.io')(http);

//Initalize and create a route
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

//Load static files: CSS
app.use('/static', express.static('static'));

//When client goes on port 3000 on the web browser, the client activates the 'connection' event and this event caught by the server and prints the message.
//Similar to .addEventListener('eventname', function)  
io.on('connection', function(socket){
    console.log('a user connected');

    //Disconnect
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });

    //Prints chat message to the console
    socket.on('chat message', function(msg){
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    });
});

http.listen(PORT, function(){
  console.log(`Server Started on PORT: ${PORT}`);
});
