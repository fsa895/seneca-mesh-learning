const chai = require('chai');
chai.should();
const Seneca = require('seneca');
const idPlugin = require('./idPlugin');
const serializeArgs = require('./serializeArgs');

// Test case 1
describe(`
    Rx.from([2,3,4,5]).pipe(
        reduce((s,i) => s+i)
    ).subscribe(console.log)
`, function() {
    
    it('should output 14', function(done) {
        const data = {
            operations: [{
                operator: 'reduce',
                args: [(s,i) => s+i]
            }]
        };
    
        const values = [{'next':5},{'next':2},{'next':3},{'next':4},{'complete':true}];

        const id = idPlugin();

        Seneca({log: 'test'})
        .use('mesh')
            .act('role:fw,cmd:createActor',{data:serializeArgs(data),clientActorid:id},(err, response) => {
                values.forEach(i => {
                    Seneca({log: 'test'})
                            .use('mesh')
                            .ready(function(){
                                this.act(`role:fw,cmd:actor,id:${response.id}`,{value:i}, (err, res) => {
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
        });    

        done();
    
    })

});


// Test Case 2
// describe(`
//     Rx.from([2,3,4,5,6]).pipe(
//         filter(i => i%2!==0),
//         reduce((s,i) => s+i)
//     ).subscribe(console.log)
// `, function() {
    
//     it('should output 8', function(done) {
//         const data = {
//             operations: [{operator:'filter', args:[i => i%2!==0]},
//                 {
//                 operator: 'reduce',
//                 args: [(s,i) => s+i]
//             }]
//         };
    
//         const values = [{'next':6},{'next':5},{'next':2},{'next':3},{'next':4},{'complete':true}];

//         const id = idPlugin();

//         Seneca({log: 'test'})
//         .use('mesh')
//             .act('role:fw,cmd:createActor',{data:serializeArgs(data),clientActorid:id},(err, response) => {
//                 // if(err) { done(err);  }
//                 // response.should.have.property('clientActorid').and.not.be.null;
//                 values.forEach(i => {
//                     Seneca({log: 'test'})
//                             .use('mesh')
//                             .ready(function(){
//                                 this.act(`role:fw,cmd:actor,id:${response.id}`,{value:i}, (err, res) => {
//                                 console.log(res);
//                                 });
//                             })
//                 });
//                 console.log('Response of application is: ', response);
//             })

//         Seneca()
//         .add(`role:fw,cmd:actorResponse,id:${id}`, (msg, response) => {
//             response({val:'ok'});
//             console.log(msg.value);
//         }) 
//         .use('mesh', {
//             isbase: false,
//             pin: `role:fw,cmd:actorResponse,id:${id}`
//         });    

//         done();
    
//     })

// });


// Test case 3
// describe(`
//     Rx.from([2,3,4,5,6]).pipe(
//         filter(i => i%2 !==0)
//     ).subscribe(console.log)
// `, function() {
    
//     it('should output 3 and 5 ', function(done) {
//         const data = {
//             operations: [{
//                 operator: 'filter',
//                 args: [i => i%2 !==0]
//             }]
//         };
    
//         const values = [{'next':5},{'next':2},{'next':3},{'next':4},{'complete':true}];

//         const id = idPlugin();

//         Seneca({log: 'test'})
//         .use('mesh')
//             .act('role:fw,cmd:createActor',{data:serializeArgs(data),clientActorid:id},(err, response) => {
//                 // if(err) { done(err);  }
//                 // response.should.have.property('clientActorid').and.not.be.null;
//                 values.forEach(i => {
//                     Seneca({log: 'test'})
//                             .use('mesh')
//                             .ready(function(){
//                                 this.act(`role:fw,cmd:actor,id:${response.id}`,{value:i}, (err, res) => {
//                                 console.log(res);
//                                 });
//                             })
//                 });
//                 console.log('Response of application is: ', response);
//             })

//         Seneca()
//         .add(`role:fw,cmd:actorResponse,id:${id}`, (msg, response) => {
//             response({val:'ok'});
//             console.log(msg.value);
//         }) 
//         .use('mesh', {
//             isbase: false,
//             pin: `role:fw,cmd:actorResponse,id:${id}`
//         });    

//         done();
    
//     })

// });