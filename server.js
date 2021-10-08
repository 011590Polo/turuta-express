const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const listUserconnect =[];

app.use(express.static(__dirname + '/public/'));

//settings
app.set('port',process.env.PORT || 5000);

app.get('/', (req, res) => {
  res.send('Hello World!')
})
  
io.on('connection', (socket) => { 
  const user = {
    usuario: '',
    token: '',
    sala:'',    
    ruta:'',
    placa:''
  }

  const idHandShake = socket.id;

  const { usuarioRoom } = socket.handshake.query;

  const { nameRoom } = socket.handshake.query; 
  
  const { nameRuta } = socket.handshake.query; 

  const { busRoom } = socket.handshake.query;
  

  //guardar usuarios entrantes
  user.token =   idHandShake;

  user.usuario = usuarioRoom;  
  user.sala  =   nameRoom;
  user.ruta  =   nameRuta;
  user.placa  =   busRoom; 
  

  //enlazar conexiones a la sala
  // if (usuarioRoom != '' && usuarioRoom != null) {
    socket.join(nameRoom);
  // }
  

  console.log('--');
  for (let index = 0; index < listUserconnect.length; index++) {
    console.log(`usuario: ${listUserconnect[index].usuario} ->> token-dispositivo: ${listUserconnect[index].token} sala: ${listUserconnect[index].sala} ruta: ${listUserconnect[index].ruta} placa: ${listUserconnect[index].placa } `);
  }

  console.log(`Hola dispositivo: ${idHandShake}  se unio sala ${nameRoom} usuario ${usuarioRoom}`);

  //server escucha al front 
  socket.on('event', (res) => {
    console.log(res);
    //SERVER ENVIA AL FRONT
    socket.to(nameRoom).emit('event', res);
  });



   //server escucha al front 
  socket.on('eventActivos', (res) => {
    //agregar y actualizar lista
  let entro=true;    
  if (listUserconnect.length ===0 && res.usuario != '' && res.usuario != null) {
     listUserconnect.push(user);      
   }else{
     if (res.usuario != '' && res.usuario != null){
      for (let index = 0; index < listUserconnect.length; index++) {
        if (listUserconnect[index].usuario === res.usuario) {
            //listUserconnect[index].token=idHandShake;
            entro=false;
        }   
      }
      if (entro) {
       listUserconnect.push(user);  
      }
     }   
   }  
    console.log(res);
    //server envia al front   cuando conecta alguno
    socket.to(nameRoom).emit('eventActivos', listUserconnect); 
  });

  

  //escuchar al front me pide el listado de activos
  // socket.on('eventActivosTraermelista', (res) => {
  //   console.log(res);
  //   //SERVER ENVIA AL FRONT
  //   socket.emit(nameRoom).emit('eventActivosTraermelista', res);
  // });

})

server.listen(app.get('port'),() => {
  console.log('listo y escuchando: puerto 5000');
})
