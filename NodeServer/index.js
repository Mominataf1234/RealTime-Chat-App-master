let express = require("express");
let app = express();
const port = process.env.PORT || 8000;

var http = require("http").Server(app);
var io = require("socket.io")(http);

const path = require("path");
const { message } = require('statuses');
const mainFile = path.join(__dirname, "../");
app.use(express.static(mainFile));

app.get("/",function(req, res){
    res.sendFile(mainFile, "/index.html");
})

const activeusers = {};

io.on("connection",(socket)=>{
    socket.on("new_user_joined",(username)=>{
        console.log("new user ", username);
        activeusers[socket.id] = username;
        socket.broadcast.emit("user-joined", username)

        socket.on("disconnected",()=>{
            console.log("user left", username);
            socket.broadcast.emit("user-left", username)
        })
    })
    socket.on("send",(message)=>{
        // console.log(message);
        socket.broadcast.emit("recieve",{
            message : message,
            username : activeusers[socket.id]
        })
    })
})

http.listen(port, function(err){
    if(err) throw err;

    console.log(`Server running at port ${port}`);
})