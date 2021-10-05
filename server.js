const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const listUserconnect =[];

app.use(express.static(__dirname + '/public/'));

app.get('/', (req, res) => {
  res.send('Hello World!')
})
  
io.on('connection', (socket) => { 
  const user = {
    usuario: '',
    token: '',
    sala:'',
    bus:''
  }

  const idHandShake = socket.id;

  const { nameRoom } = socket.handshake.query;

  const { usuarioRoom } = socket.handshake.query;

  const { busRoom } = socket.handshake.query;


  

  //guardar usuarios entrantes
  user.usuario = usuarioRoom;
  user.token =   idHandShake;
  user.sala  =   nameRoom;
  user.bus   =   busRoom;

 
  //agregar y actualizar lista
  let entro=true;;
  if (listUserconnect.length===0) {
     listUserconnect.push(user);      
   }else{
     for (let index = 0; index < listUserconnect.length; index++) {
       if (listUserconnect[index].usuario === usuarioRoom) {
           listUserconnect[index].token=idHandShake;
           entro=false;
       }   
     }
     if (entro) {
      listUserconnect.push(user);  
     }
   }  

  //enlazar conexiones a la sala
  socket.join(nameRoom);

  console.log('--');
  for (let index = 0; index < listUserconnect.length; index++) {
    console.log(`usuario: ${listUserconnect[index].usuario} ->> token-dispositivo: ${listUserconnect[index].token} sala: ${listUserconnect[index].sala}`);
  }

  //console.log(`Hola dispositivo: ${idHandShake}  se unio sala ${nameRoom} usuario ${usuarioRoom}`);

  //server escucha al front 
  socket.on('event', (res) => {
    console.log(res);
    //SERVER ENVIA AL FRONT
    socket.to(nameRoom).emit('event', res);
  });

})

server.listen(5000, () => {
  console.log('listo y escuchando: puerto 5000');
})




  


