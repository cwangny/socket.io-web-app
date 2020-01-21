// Backend.

let express = require('express');
let app = express();
let http = require('http').createServer(app);

// Heroku assigns a random port, port 3000 is only for local server. 
let PORT = process.env.PORT || 3000;
let io = require('socket.io')(http);

let userNamesArray = [];

// Settingup database. 
let mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/chat', (err)=>{
	if(err) {
		console.log(err);
	}
});

let chatSchema = mongoose.Schema({
	nick: String,
	msg: String,
	created: {type: Date, default: Date.now}
})

let Chat = mongoose.model('Message', chatSchema);

// Routing using express.
app.get('/', function(req, res){
  	res.sendFile(__dirname + '/index.html');
});

// Load static files: CSS
app.use('/static', express.static('static'));
// app.use(express.static(path.join(__dirname, 'public')));

// When client goes on port 3000 on the web browser, the client activates the 'connection' event and this event is caught by the server and initiates the app.
// Similar to .addEventListener('eventname', function)  
io.on('connect', function(socket){
	console.log('a user connected, username not set');
	
	Chat.find({}, (err, docs)=> {
		if(err) throw err;
		socket.emit('load old msgs', docs);
	});

    socket.emit('connect');

	// Adds users to an array and emmits the new array to the cliet side.
	// The sever side catches the event named username and the data which is the value inside the input tag id #username.
    socket.on('username', function(userName){
		console.log('New User: ' + userName);
		
		socket.nickname = userName;
		
		userNamesArray.push(userName);
		console.log(userNamesArray);
		
		io.emit('updateduserlist', userNamesArray);
    }) 

    // Removes user from the array when log out button is clicked on the client UI. Also reuturns an updated array.
    socket.on('remove user', function(data){
		for (let i = 0; i < userNamesArray.length; i++) {
			if (socket.nickname === userNamesArray[i]) {
				let index = userNamesArray.indexOf(userNamesArray[i]);
				userNamesArray.splice(index);   
			} 
		}
		io.emit('updateduserlist', userNamesArray);
	})

    // When a user closes the tab, the disconnect event is fired from the server. 
    // Removes user from the array when user closes the tab. 
    socket.on('disconnect', function(){
		console.log(socket.nickname +' disconnected');

		for (let i = 0; i < userNamesArray.length; i++) {
			if (socket.nickname === userNamesArray[i]) {
				let index = userNamesArray.indexOf(userNamesArray[i]);
				userNamesArray.splice(index);   
			} 
		}

		io.emit('updateduserlist', userNamesArray);
    });

    // Receives message and username form the client and returns it. 
    socket.on('chat message', function(data){
		console.log(`${socket.nickname}: ` + data);
		
		// Emmits data from the database to the client.
		let newMsg = new Chat({msg: data, nick: socket.nickname});

		newMsg.save((err)=>{ 
			if (err) throw err;
			io.emit('chat message', {msg: data, nick: socket.nickname});
		});
    });

});

http.listen(PORT, function(){
  	console.log(`Server Started on PORT: ${PORT}`);
});

/*
App Features:
- Sign in instantly using a nickname.
- Broadcast a message to connected users when someone connects or disconnects.
- Add support for nicknames.
- Add users to a user list.
- Remove user when they press the logout button.
- Implemented database using MongoDB.
*/
