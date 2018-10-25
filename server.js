const Seneca = require('seneca');
const idPlugin = require('./idPlugin');
const deserializeArgs = require('./deserializeArgs');


Seneca()
    .add('role:fw,cmd:createActor',(msg, response) =>{
        const id = idPlugin();
            
        const m = deserializeArgs(msg.data);
        
        const {Subject} = require('rxjs');
        const s = new Subject();
        
        const arr1 = m.operations.map(o => {
            const op = require('rxjs/operators')[o.operator];
            return op.apply(op, o.args);                            // filter(i => i%2 === 0)
        });
        
        let value= 'odd number';
        
        const s2 = s.pipe.apply(s,arr1);
        s2.subscribe((resp)=> {
            value = resp;
            Seneca()
            .use('mesh')
            .act(`role:fw,cmd:actorResponse,id:${msg.clientActorid}`,{value:value},(req,resp)=>{
                console.log("inside actorResponse: ",resp)
            })
        },
        (err) => {
            console.log(err)
          },
        (complete) => {
            console.log(complete)
          }
        );

        Seneca().add(`role:fw,cmd:actor,id:${id}`, (msg, response) => {

            if(msg.value.hasOwnProperty('err')){
                s2.error('error: something went wrong');
                response({output:'error'})
            }
                
            else if(msg.value.hasOwnProperty('complete')){
                s2.complete('complete is found')
                response({output:'complete'})
            }
            else{
                s2.next(msg.value.next);        
                response({output:'go to next value'})
            }
            
        })
        .use('mesh', {
            isbase: false,
            pin: `role:fw,cmd:actor,id:${id}`
        })
        
        response({id:id})
    })
    .use('mesh', {
        isbase: false,
        pin: 'role:fw,cmd:createActor'
      })
