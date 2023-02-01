const socket = io();
const form = document.getElementById("sendcont");
const messageInput = document.getElementById("send_msg");
const messageContainer = document.getElementById("messagebox");
let audio1 = new Audio("/Sounds/notification.mp3");
let audio2 = new Audio("/Sounds/notifyrecieve.mp3");
let audio3 = new Audio("/Sounds/sendtone.mp3");


const append = (message,position) => {
    const messageElement = document.createElement("div");
    messageElement.innerText = message;
    messageElement.classList.add("message");
    messageElement.classList.add(position);
    messageContainer.appendChild(messageElement);

    // if(position == "left"){
    //     audio1.play();
    // }
    // if(position == "center"){
    //     audio2.play();
    // }
}

form.addEventListener('submit',(event)=>{
    event.preventDefault();
    const message = messageInput.value;
    append(`You : ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = "";
})

const username = prompt("Enter your Name and start Chating");
socket.emit("new_user_joined",username);

socket.on("user-joined",(username)=>{
    append(`${username} joined the party 🥳`, "center");
    audio1.play();
})

socket.on('recieve',(data)=>{
    append(`${data.username} : ${data.message}`,"left");
    audio2.play();
})

socket.on("user-left",(username)=>{
    append(`${username} left the party 🏃`, "center");
    audio3.play();
})
