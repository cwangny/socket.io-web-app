//Server side

let express = require('express');
let app = express();
let http = require('http').createServer(app);
let PORT = 3000;
let io = require('socket.io')(http);

let userNamesArray = [];
let nickname;


//Initalize and create a route
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

//Load static files: CSS
app.use('/static', express.static('static'));
//app.use(express.static(path.join(__dirname, 'public')));

//When client goes on port 3000 on the web browser, the client activates the 'connection' event and this event caught by the server and initiates the app.
//Similar to .addEventListener('eventname', function)  
io.on('connect', function(socket){
    console.log('a user connected');
    socket.emit('connect');

    //The sever side catches the event named username and the data which is the value inside the input tag id #username.
    socket.on('username', function(userName){
      console.log('New User: ' + userName);
      socket.nickname = userName;
      
      userNamesArray.push(userName);
      console.log(userNamesArray);
      io.emit('username', userNamesArray);
      //io.emit('name', data);
      
    })
    

    //Disconnect
    socket.on('disconnect', function(){
        io.emit('disconnect');
        console.log('user disconnected');
    });

    //Prints chat message to the console
    socket.on('chat message', function(data){
        console.log(`${socket.nickname}: ` + data);
        io.emit('chat message', {msg: data, nick: socket.nickname});
    });

});

http.listen(PORT, function(){
  console.log(`Server Started on PORT: ${PORT}`);
});

/*
- Broadcast a message to connected users when someone connects or disconnects.
- Add support for nicknames.
- Don’t send the same message to the user that sent it himself. Instead, append the message directly as soon as he presses enter.
- Add “{user} is typing” functionality.
- Show who’s online.
- Add private messaging.

- Add channels
- Add private channels
- Create an account or sign in instantly using a nickname
Test

*/
