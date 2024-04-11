// Inicializo socket del lado del cliente
const socket = io();

let username;
let chatBox = document.querySelector("#chatBox");
let messagesLogs = document.querySelector('#messagesLogs');

Swal.fire({
    title: "Identificate",
    input: "text",
    inputLabel: "Ingresa tu usuario",
    allowOutsideClick: false,
    inputValidator: (value) => {
      return !value && "Es necesario que te identifiques para continuar!";
    },
}).then((result) => {
    username = result.value;
    console.log(`Hola ${username} bienvenido`);

    socket.emit("userConnect", user);
});


chatBox.addEventListener("keypress", e =>{
    if(e.key == "Enter"){
        if(chatBox.value.trim().length > 0){
            console.log(`Mensaje: ${chatBox.value}`);

            socket.emit("message", {
                user,
                message: chatBox.value
            });

            chatBox.value = "";
        }
    }
});

socket.on("messagesLogs", data =>{
    let messages = "";

    data.forEach(chat => {
        messages += `${chat.user}: ${chat.message} </br>`;
    });

    messagesLogs.innerHTML = messages;
});

socket.on("newUser", data =>{
    Swal.fire({
        text: `${data} se ha unido al chat`,
        toast: true,
        position: "top-right"
    });
});