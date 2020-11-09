const fs = require('fs');
const TeleBot = require('telebot')
const { Writefile, Readfile } = require('./readfile')
const bot = new TeleBot({
    token: '', //Telegram bot API TOKEN.
    allowedUpdates: [], // Optional. List the types of updates you want your bot to receive. Specify an empty list to receive all updates.
    usePlugins: ['askUser'], // Optional. Use user plugins from pluginFolder.
    pluginFolder: '../plugins/', // Optional. Plugin folder location.
    pluginConfig: { // Optional. Plugin configuration.
        // myPluginName: {
        //   data: 'my custom value'
        // }
    }
});
const AmindN = '' //管理员用户名

//同步读取配置
var info = JSON.parse(fs.readFileSync('./user.json').toString())
var AllsetI = {}


//监听文本改变或状态改变
for (var item in info) {
    info[item].statusc = info[item].status
    Object.defineProperty(info[item], "status", {
        get: function () {
            return this.statusc
        },
        set: function (val) {
            if (this.statusc == val) return//返回无用参数
            this.statusc = val
            if (val == 1) {
                StartA()
            }
        }
    })
    function StartA() {
        var setI = setInterval(() => {
            if (info[item].status == 0) return clearInterval(setI)//循环前判断状态
            bot.sendMessage(info[item].id, info[item].text)
        }, info[item].setInterval * 1000)
        AllsetI[item] = setI
    }
    StartA()
}

bot.on('/on', (msg) => Startplay(msg))
bot.on('/off', (msg) => Stopplay(msg))
bot.on('/set', (msg) => SetGroupInfo(msg))
bot.on('/list', (msg) => ShowGrouplist(msg))
bot.on('/remove', (msg) => RemoveGroupUser(msg))

//开启全部轮询消息
function Startplay(msg) {
    if (msg.from.username === AmindN) {
        for (const key in info) {
            if (info.hasOwnProperty(key)) {
                const element = info[key];
                element.status = 1
            }
        }
        Writefile('./user.json', JSON.stringify(info)).then(() => {
            msg.reply.text('已开启全部')
        }, (err) => { msg.reply.text('写入配置失败') })
    }
}

//停止全部轮询
function Stopplay(msg) {
    if (msg.from.username === AmindN) {
        for (const key in info) {
            if (info.hasOwnProperty(key)) {
                const element = info[key];
                element.status = 0
                if(AllsetI[key]) {
                    clearInterval(AllsetI[key])
                    delete AllsetI[key]
                }
            }
        }
        Writefile('./user.json', JSON.stringify(info)).then(() => {
            msg.reply.text('已关闭全部')
        }, (err) => { msg.reply.text('写入配置失败') })
    }
}

function SetGroupInfo(msg) {
    //添加更新群组配置表
    let from = msg.chat
    if (from.username === AmindN && from.type === 'private') {
        let arry = msg.text.split(' ')
        arry[2] = Number(arry[2])
        arry[4] = Number(arry[4] == '' ? 0 : arry[4])
        if (arry[2] < 5 || arry[2] > 36000) {
            return msg.reply.text('间隔时间太短或太长')
        } else if (arry[3].length > 1000 || arry[3] == ' ' || arry[3].length == 0)
            return msg.reply.text('文本太长或没有设置文本')

        if (info[arry[1]] === undefined) {
            msg.reply.text('正在等待获取id,请返回群组发送任意消息')
            bot.on("text", (meassage) => {
                if (meassage.chat.title == arry[1]) {
                    var id = meassage.chat.id
                    arry[0] = id
                    Updateinfo(arry).then(() => {
                        msg.reply.text('添加成功')
                        return bot.cleanEvent('text')
                    }, () => {
                        msg.reply.text('写入文件失败')
                        return bot.cleanEvent('text')
                    })
                }
            })
        }
        else {
            arry[0] = false
            Updateinfo(arry).then(() => {
                return msg.reply.text('修改成功')
            }, () => {
                return msg.reply.text('写入文件失败')
            })
        }
    }
    else return
}

function Updateinfo(arry) {
    return new Promise((resolve, rejects) => {
        Readfile('./user.json').then((res) => {
            if(res[arry[1]].status != arry[4] && res[arry[1]].status == 1)
            {
                if(AllsetI[key]) {
                    clearInterval(AllsetI[key])
                    delete AllsetI[key]
                }
            }
            let json = res
            json[arry[1]] = {
                id: arry[0] || res[arry[1]].id,
                setInterval: arry[2],
                text: arry[3],
                status: arry[4]
            }
            Writefile('./user.json', JSON.stringify(json)).then(() => {
                info = json
                resolve('')
            }, (err) => {
                rejects('')
            })
        })
    })
}



function RemoveGroupUser(msg) {
    //删除用户配置
    let from = msg.chat
    if (from.username === AmindN && from.type === 'private') {
        try {
            let arry = msg.text.split(' ')
            let json = {}
            Readfile('./user.json').then((res) => {
                json = res
                if (json[arry[1]] !== undefined) {
                    delete json[arry[1]]
                    Writefile('./user.json', JSON.stringify(json)).then(() => {
                        msg.reply.text('添加成功')
                        bot_list = json
                    })
                } else
                    msg.reply.text('配置中没有此信息')
            })
        } catch (error) {
            return
        }
    }
    else return
}
function ShowGrouplist(msg) {

}
//搜索功能
function Serach(age) {
    if (age == null || age == 0 || age == '' || age == ' ')
        return



}

bot.connect()
