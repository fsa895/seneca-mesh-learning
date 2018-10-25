const uuidv1 = require('uuid/v1');

function idPlugin(){ 
    return uuidv1();
}
// console.log(idPlugin())
module.exports = idPlugin;