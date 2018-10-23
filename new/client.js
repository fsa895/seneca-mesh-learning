const Seneca = require('seneca')
const serializeArgs = require('./serializeArgs');
const idPlugin = require('./idPlugin')();

const data = {
    operations: [{
        operator: 'filter',
        args: [i => i%2 !== 0]
    }, {
        operator: 'map',
        args: [i => i*2]
    }]
}

Seneca({log: 'test'})

  .use('mesh')
  .act('role:fw,cmd:application',(err, response) => {
    console.log('This is response X: ',response.x);
    
        Seneca({log: 'test'})
                .use('mesh')
                .act(response.x,{id:response.id},(err, res) => {
                    console.log('This is id: ',res.id);
                    [1,2,3,4].forEach(i => {
                        Seneca({log:'test'})
                          .use('mesh')
                          .act(`hello`,{id:res.id,value:i,data:serializeArgs(data)},(err,res) => {
                                console.log("hello res : ",res);          
                          })  
        });
    });
    console.log('Response of application is: ', response);
})
