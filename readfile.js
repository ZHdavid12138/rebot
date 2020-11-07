const fs = require('fs')

//封装文件读取和写入函数
function Readfile(path, type = 'json')
{
    return new Promise((resolve,rejects) =>{
        fs.readFile(path, (err, data) =>{
            if(err)
                rejects(err)
            if(type == 'json')
            {
                resolve(JSON.parse(data.toString()))
            }else 
            {
                resolve(data.toString())
            }
        })
    })
}

function Writefile(path, data)
{
    return new Promise((resolve,rejects) =>{
        fs.writeFile(path, data, (err) =>{
            if(err)
                rejects(err)
                resolve()
        })
    })
}

module.exports.Readfile = Readfile
module.exports.Writefile = Writefile

