const Seneca = require('seneca');
const idPlugin = require('./idPlugin')();
const deserializeArgs = require('./deserializeArgs');

Seneca()
    .add('role:fw,cmd:application',(msg, response) =>{
        const id = idPlugin;
        
        Seneca().add(`role:fw,cmd:createActor `,(msg, response) => {
            console.log('inside create actor');
            
            Seneca().add(`hello`,{id:msg.id},(msg,response) =>{
                console.log('hello id:', msg.id)                        
                console.log('Inside createActor')
                const m = deserializeArgs(msg.data);
                
                const {Subject} = require('rxjs');
                const s = new Subject();
                
                const arr1 = m.operations.map(o => {
                    const op = require('rxjs/operators')[o.operator];
                    return op.apply(op, o.args);                            // filter(i => i%2 === 0)
                });
                        
                let value= 'not odd';
                s.pipe.apply(s, arr1).subscribe((resp,err) => {
                    value = resp;
                });
                
                s.next(msg.value);
                s.complete();
                response({value:value,id:id});    
                })
                .use('mesh', {
                    isbase: false,
                    pin: `hello`
                })

            response({id:id});    
                              
        })
        .use('mesh', {
            isbase: false,
            pin: `role:fw,cmd:createActor`
        })
        
        response({x:`role:fw,cmd:createActor`,id:id})
    })
    .use('mesh', {
        isbase: false,
        pin: 'role:fw,cmd:application'
      })
