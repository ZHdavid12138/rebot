function Text(bot)
{

}

const fs = require('fs')
var sss = fs.readFileSync('./user.json')
console.log( JSON.parse(sss.toString()) );

module.exports.text = Text()