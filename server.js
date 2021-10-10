const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const listUserconnect = [];

app.use(express.static(__dirname + '/public/'));

//settings
app.set('port', process.env.PORT || 5000);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

io.on('connection', (socket) => {
  const user = {
    usuario: '',
    token: '',
    sala: '',
    ruta: '',
    placa: ''
  }

  const idHandShake = socket.id;

  const { usuarioRoom } = socket.handshake.query;

  const { nameRoom } = socket.handshake.query;

  const { nameRuta } = socket.handshake.query;

  const { busRoom } = socket.handshake.query;


  //guardar usuarios entrantes
  user.token = idHandShake;

  user.usuario = usuarioRoom;
  user.sala = nameRoom;
  user.ruta = nameRuta;
  user.placa = busRoom;

  //enlazar conexiones a la sala
  // if (usuarioRoom != '' && usuarioRoom != null) {
  socket.join(nameRoom);
  // }

  // console.log('--');
  // for (let index = 0; index < listUserconnect.length; index++) {
  //   console.log(`usuario: ${listUserconnect[index].usuario} ->> token-dispositivo: ${listUserconnect[index].token} sala: ${listUserconnect[index].sala} ruta: ${listUserconnect[index].ruta} placa: ${listUserconnect[index].placa } `);
  // }

  console.log(`Hola dispositivo: ${idHandShake}  se unio sala ${nameRoom} usuario ${usuarioRoom}`);

  //server escucha al front 
  socket.on('event', (res) => {
    //SERVER ENVIA AL FRONT
    socket.to(nameRoom).emit('event', res);
  });



  //server escucha al front esperando que transmita alguien
  socket.on('eventActivos', (res) => {
    console.log(res);
    //agregar y actualizar lista
    if (listUserconnect.length === 0 && res.usuario != '' && res.usuario != null) {
      listUserconnect.push(res);
    } else {
      let data = listUserconnect.filter((f) => f.usuario.toUpperCase().includes(res.usuario.toUpperCase().trim()));
      if (data.length === 0) {
        listUserconnect.push(res);
      }
    }
    console.log(listUserconnect);
    //server envia al front  listado de los que trasmiten
    socket.to(nameRoom).emit('eventActivos', listUserconnect);
  });

  // server escucha front cando carga home
  socket.on('eventActivosconectados', () => {
    //SERVER ENVIA AL FRONT cuando carga home
    socket.emit(nameRoom).emit('eventActivosconectados', listUserconnect);  
  }); 

})

server.listen(app.get('port'), () => {
  console.log('listo y escuchando: pppuerto 5000');
})

//version3.0
