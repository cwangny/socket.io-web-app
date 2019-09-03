//Server side

let express = require('express');
let app = express();
let http = require('http').createServer(app);
let PORT = 3000;
let io = require('socket.io')(http);
//Global Scope
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
    console.log('a user connected, username not set');
    socket.emit('connect');

    //The sever side catches the event named username and the data which is the value inside the input tag id #username.

    //Add username to userarray function:
    socket.on('username', function(userName){
		console.log('New User: ' + userName);
		socket.nickname = userName;
		
		userNamesArray.push(userName);
		console.log(userNamesArray);
		
		io.emit('updateduserlist', userNamesArray);
    })
    
    //Send Userlist 

    //Removes User from the userlist and returns a new list
    
    socket.on('remove user', function(data){
		console.log('Before Userlist: '+userNamesArray);
		for (let i = 0; i < userNamesArray.length; i++) {
			if (socket.nickname === userNamesArray[i]) {
				//console.log(socket.nickname);
				let index = userNamesArray.indexOf(userNamesArray[i]);
				//console.log(index);
				userNamesArray.splice(index);   
			} 
		}
		console.log('After Userlist: '+ userNamesArray);
		io.emit('updateduserlist', userNamesArray);
	})
	
	//Send usernick.name 
	socket.on('new pm', function(data, callback){
		for (let i = 0; i < userNamesArray.length; i++) {
			if (data === userNamesArray[i]) {
				console.log(data);
				console.log(userNamesArray);
				console.log('valid username')
				callback(true);
				break
				//io.emit('return pm', data);
			} else {
				callback(false);
			}
		}
		
	})
    

    //Disconnect message
    socket.on('disconnect', function(){
        io.emit('disconnect', socket.nickname);
        console.log(socket.nickname +' disconnected');
    });

    //Message function
    socket.on('chat message', function(data){
        console.log(`${socket.nickname}: ` + data);
        io.emit('chat message', {msg: data, nick: socket.nickname});
    });

});

http.listen(PORT, function(){
  	console.log(`Server Started on PORT: ${PORT}`);
});

/*
- Sign in instantly using a nickname
- Broadcast a message to connected users when someone connects or disconnects.
- Add support for nicknames.
- Add users to a user list.
- Remove user when they press the logout button.

- Add DMs
*/
