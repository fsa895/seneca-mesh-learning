const Seneca = require('seneca')
const serializeArgs = require('./serializeArgs');
const idPlugin = require('./idPlugin');

const data = {
    operations: [{
        operator: 'filter',
        args: [i => i%2 !== 0]
    }, {
        operator: 'map',
        args: [i => i*2]
    }]
}

values = [{'next':1},{'next':2},{'next':3},{'next':4},{'complete':true}];

id = idPlugin();

Seneca({log: 'test'})
  .use('mesh')
    .act('role:fw,cmd:createActor',(err, response) => {
        values.forEach(i => {
            Seneca({log: 'test'})
                    .use('mesh')
                    .ready(function(){
                        this.act(`role:fw,cmd:actor,id:${response.id}`,{value:i,data:serializeArgs(data),clientActorid:id}, (err, res) => {
                        console.log(res);
                        });
                    })
        });
        console.log('Response of application is: ', response);
    })
    
Seneca()
    .add(`role:fw,cmd:actorResponse,id:${id}`, (msg, response) => {
        response({val:'ok'});
        console.log(msg.value);
    }) 
    .use('mesh', {
        isbase: false,
        pin: `role:fw,cmd:actorResponse,id:${id}`
    })
