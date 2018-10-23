// color-client.js
var Seneca = require('seneca')

Seneca({log: 'test'})

  // load the mesh plugin
  .use('mesh')

  // send a message out into the network
  // the network will know where to send format:hex messages
  .act( {format: 'hex', color: 'red'}, function (err, out) {

    // prints #FF0000
    console.log(out.color)
  })