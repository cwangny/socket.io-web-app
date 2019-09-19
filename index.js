//Server side

//HIW = How It works.

//Import express.js for setting up the server. 
let express = require('express');
let app = express();
let http = require('http').createServer(app);
//Heroku assigns a random port so 3000 wont work. 
let PORT = process.env.PORT || 3000;
let io = require('socket.io')(http);
//Global scopes variables.
let userNamesArray = [];
let nickname;

//Initalize and create a route using express.
app.get('/', function(req, res){
  	res.sendFile(__dirname + '/index.html');
});

//Load static files: CSS
app.use('/static', express.static('static'));
//app.use(express.static(path.join(__dirname, 'public')));

//HIW: When client goes on port 3000 on the web browser, the client activates the 'connection' event and this event is caught by the server and initiates the app.
//Similar to .addEventListener('eventname', function)  
io.on('connect', function(socket){
    console.log('a user connected, username not set');
    socket.emit('connect');

	//Adds users to an array and emmits the new array to the cliet side.
	//HIW: The sever side catches the event named username and the data which is the value inside the input tag id #username.
    socket.on('username', function(userName){
		console.log('New User: ' + userName);
		socket.nickname = userName;

		userNamesArray.push(userName);
		console.log(userNamesArray);
		
		io.emit('updateduserlist', userNamesArray);
    }) 

    //Removes user from the array when log out button is clicked on the client UI. Also reuturns an updated array.
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

    //When a user closes the tab, the disconnect event is fired from the server. 
    //Removes user from the array when user closes the tab. 
    socket.on('disconnect', function(){
        //io.emit('disconnect', socket.nickname);
		console.log(socket.nickname +' disconnected');
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
    });

    //Receives message and username form the client and returns it. 
    socket.on('chat message', function(data){
        console.log(`${socket.nickname}: ` + data);
        io.emit('chat message', {msg: data, nick: socket.nickname});
    });

});

http.listen(PORT, function(){
  	console.log(`Server Started on PORT: ${PORT}`);
});

/*
App Features:
- Sign in instantly using a nickname
- Broadcast a message to connected users when someone connects or disconnects.
- Add support for nicknames.
- Add users to a user list.
- Remove user when they press the logout button.

- Implement database using MongoDB or SQL
*/
