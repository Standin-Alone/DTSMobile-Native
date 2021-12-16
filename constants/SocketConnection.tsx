
window.navigator.userAgent = 'react-native';
import React, {Component} from 'react';
import io from 'socket.io-client/dist/socket.io';

//localhost
// let socket = io('http://172.17.150.112' + ':7980', {
//     transports: ['websocket'],
//   });

// ssl
let socket = io.connect('wss://devsysadd.da.gov.ph:8080');

  

  
  
  socket.on('connect_failed', function(err) {
    console.warn(err.message);
  });
  socket.on('connect_error', function(err) {
  
    console.warn(JSON.stringify(err.message));
  });

  socket.on("disconnect", (reason) => {
    console.warn(reason);
  });


  export default {socket}