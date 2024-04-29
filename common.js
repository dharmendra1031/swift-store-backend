const generateUniqueId = require('generate-unique-id');

async function generate_name()
{
    return new Promise((resolve,reject)=>{
        var temp = generateUniqueId({
            length: 15,
            useLetters: true,
            useNumbers:false
          })
        resolve(temp);
    });
}

async function generate_order_id()
{
    return new Promise((resolve,reject)=>{
        var temp = generateUniqueId({
            length: 10,
            useLetters: false,
            useNumbers:true
          })
        resolve(temp);
    });
}

module.exports ={ generate_name, generate_order_id};