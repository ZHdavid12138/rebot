const fs = require('fs')
const TeleBot = require('telebot')
const { Writefile, Readfile } = require('./readfile')
const bot = new TeleBot({
    token: 'APITELEGRAM 密钥信息', //Telegram Bot API token.
    allowedUpdates: [], // Optional. List the types of updates you want your bot to receive. Specify an empty list to receive all updates.
    usePlugins: ['askUser'], // Optional. Use user plugins from pluginFolder.
    pluginFolder: '../plugins/', // Optional. Plugin folder location.
    pluginConfig: { // Optional. Plugin configuration.
        // myPluginName: {
        //   data: 'my custom value'
        // }
    }
});
//同步读取配置
var bot_list = JSON.parse(fs.readFileSync('./user.json').toString())

bot.on(['/start', '/hello'], (msg) => Startplay(msg))
bot.on('/off', (msg) => Stopplay(msg))
bot.on('/set', (msg) => SetGroupInfo(msg));

//开始轮询消息
function Startplay(msg) {
    if (msg.from.username === 'Justin12138') {
        //尝试解析json的群组信息如果没有直接返回
        let title = msg.chat.title
        if(bot_list[title] !== undefined)
            bot_list[title].status = 1
        else
            return
        setInterval(() => {
            //在开始前判断是否继续
            if (bot_list[title].status == 1)
                msg.reply.text(bot_list[title].text)
            else
                return
        }, bot_list[title].setInterval)
    }
}
//停止单个轮询
function Stopplay(msg) {
    if (msg.from.username === 'Justin12138') {
        let title = msg.chat.title
        if(bot_list[title])
            bot_list[title].status = 0
    }
}

function SetGroupInfo(msg) {
    //添加更新群组配置表
    let from = msg.chat
    if (from.username === 'Justin12138' && from.type === 'private') {
        try {
            let arry = msg.text.split(' ')
            let json = {}
            arry[2] = Number(arry[2])
            if(arry[2] < 5 || arry[2] > 36000)
            {
                return msg.reply.text('间隔时间太短或太长')
            } else if (arry[3].length > 1000 || arry[3] == ' ' || arry[3].length == 0)
                return msg.reply.text('文本太长或没有设置文本')
            Readfile('./user.json').then((res) => {
                json = res
                json[arry[1]] = {
                    setInterval: arry[2] * 1000,
                    text: arry[3],
                    status: arry[4] ? 1 : 0
                }
                Writefile('./user.json', JSON.stringify(json)).then(() => {
                    msg.reply.text('添加成功')
                    bot_list = json
                })
            })
        } catch (error) {
            return
        }
    }
    else return
}

function RemoveGroupUser(msg) {
    //删除用户配置
    let from = msg.chat
    if (from.username === 'Justin12138' && from.type === 'private') 
    {
        try {
            let arry = msg.text.split(' ')
            let json = {}
            Readfile('./user.json').then((res) => {
                json = res
                if(json[arry[1]] !== undefined)
                {
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

//搜索功能
function Serach(age) {
    if (age == null || age == 0 || age == '' || age == ' ')
        return



}

bot.connect()
