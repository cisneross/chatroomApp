// Load the express module and store it in the variable express (Where do you think this comes from?)
var express = require("express");
// path module -- try to figure out where and why we use this
// invoke express and store the result in the variable app
var app = express();
// this is the line that tells our server to use the "/static" folder for static content
app.use(express.static(__dirname + "/static"));
const server = app.listen(1337);
const io = require('socket.io')(server);
var messages = [];

app.set('views', __dirname + '/views'); 
// Now lets set the view engine itself so that express knows that we are using ejs as opposed to another templating engine like jade
app.set('view engine', 'ejs');
// tell the express app to listen on port 8000, always put this at the end of your server.js file

// use app's get method and pass it the base route '/' and a callback
// app.get('/', function(request, response){
//     response.render('index');
// })
app.get('/', function(request, response){
    response.render('index');
})
io.on('connection', function (socket) { 
    //listens for the name of client who just connected
    socket.on('got_new_name', function (data) { 
        //sends name back to trigger "user" joined chat
        socket.emit('new_user',{name:data.name});
        console.log(data.name);
        //emits all the messages to clients
        // io.emit('all_messages', {all_messages:messages});
    });
    //receives message from server
    socket.on('msg_to_server', function (data) { 
        //store message and name in vars(don't have to)
        var message = data.msg;
        var name = data.name;
        console.log(data.msg,data.name);
        //send the message and name back to the client
        io.emit('message', {mesg:message,name:name});
    });

});