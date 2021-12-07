

import React, {Component} from 'react';
import io from 'socket.io-client';
let socket = io('http://172.17.150.112' + ':7980', {
    transports: ['websocket'],
  });

  export default {socket}