const fs = require('fs')
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
console.log('正在读取配置文件')
var info = JSON.parse(fs.readFileSync('./user.json').toString())
console.log('读取完成')
var AllsetI = {}
//监听文本改变或状态改变
for (let item in info) {
    info[item].statusc = info[item].status
    Object.defineProperty(info[item], "status", {
        get: function () {
            return this.statusc
        },
        set: function (val) {
            if (this.statusc === val) return//返回无用参数
            this.statusc = val
            if (val === 1) {
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
bot.on('callbackQuery', (callbackQuery) => callbackFuc(callbackQuery));

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
                if (AllsetI[key]) {
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
        if (arry[2] && (arry[2] < 5 || arry[2] > 36000)) {
            return msg.reply.text('间隔时间太短或太长')
        }
        if (info[arry[1]] === undefined) {//当是新的key时不能省略参数
            if (!arry[1]) {
                let text = `配置列表如下：(如需添加新群或修改其他参数请输入完整命令)`
                let inline_keyboard = []
                for(let value in info) {
                    inline_keyboard.push([
                        { text: value, callback_data: `{ "data" : "${value}","type" : "update" }` },
                        { text: `当前状态：${info[value].status ? '开' : '关'}`, callback_data: `{ "data" : "${value}","type" : "status" }` },
                        { text: '修改文本内容', callback_data: `{ "data" : "${value}","type" : "edittext" }` }
                    ])
                }
                let button = {
                    replyMarkup: {
                        inline_keyboard: inline_keyboard
                    }
                }
                return bot.sendMessage(msg.chat.id, text, button)
            }
            if(!arry[2] || !arry[3]) return msg.reply.text('参数缺失或没有此值')
            msg.reply.text('请输入文本内容')
            bot.on("text", (meassage) => {
                if (meassage.chat.username === AmindN) {
                    arry[4] = meassage.text
                    msg.reply.text('等待获取id,请邀请机器人到群组。如已在群组请重新拉群')
                    //当有消息更新时存下群组id信息
                    bot.on('update', (msg) => {
                        if (msg[0].message.new_chat_participant && msg[0].message.new_chat_participant.is_bot) {//获取新入群的消息
                            arry[0] = msg[0].message.chat.id
                            Updateinfo(arry).then(() => {
                                meassage.reply.text('添加成功')
                                return bot.cleanEvent('update')
                            }, () => {
                                meassage.reply.text('写入文件失败')
                                return bot.cleanEvent('update')
                            })
                        }
                    })
                }
            })
        }
        else {
            arry[0] = false
            let text = `键值：${arry[1]}
轮播内容:${info[arry[1]].text}
间隔时间:${info[arry[1]].setInterval}秒`
            let button = {
                replyMarkup: {
                    inline_keyboard: [[
                        { text: `当前状态：${info[arry[1]].status ? '开' : '关'}`, callback_data: `{ "data" : "${arry[1]}","type" : "status" }` },
                        { text: '修改文本内容', callback_data: `{ "data" : "${arry[1]}","type" : "edittext" }` }
                    ]]
                }
            }
            bot.sendMessage(msg.chat.id, text, button)
        }
    }
    else return
}

function Updateinfo(arry) {
    return new Promise((resolve, rejects) => {
        Readfile('./user.json').then((res) => {
            let key = arry[1]
            if (info[key]) {
                //判断是否有参数
                if (!arry[2] || arry[2] == '') arry[2] = Number(res[key].setInterval)
                if (!arry[3] || arry[3] == '') arry[3] = Number(res[key].status)
                if (info[key] == res[key]) resolve()
                if (info[key].status == 1 && arry[3] == 0) {
                    clearInterval(AllsetI[key])
                    delete AllsetI[key]
                }
                if (info[key].status !== arry[3]) info[key].status = arry[3] //防止多重运行
                info[key].setInterval = arry[2]
                info[key].text = arry[4]
            } else if (arry[0]) {
                info[key] = {
                    id: arry[0],
                    setInterval: Number(arry[2]),
                    text: arry[4],
                    status: Number(arry[3])
                }
            } else {
                msg.reply.text('更新错误')
            }
            Writefile('./user.json', JSON.stringify(info)).then(() => {
                resolve('')
            }, (err) => {
                rejects('')
            })
        })
    })
}

function callbackFuc(data) {
    let butData = JSON.parse(data.data)
    // console.log(data)
    switch (butData.type) {
        case 'status':
            chagestatus()
            break
        case 'edittext':
            editText()
            break
        case 'update':
            showText()
            break
        default:
            console.log('按钮类型未定义')
            break
    }
    bot.answerCallbackQuery(data.id)

    function showText() {
        let text = `键值：${butData.data}
内容：${info[butData.data].text}
轮询时间：${info[butData.data].setInterval}秒`
        return bot.sendMessage( data.message.chat.id , text)
    }
    function editText() {
        bot.sendMessage(data.message.chat.id, '请输入文本内容')
        bot.on("text", (meassage) => {
            if (meassage.chat.username === AmindN) {
                let arry = []
                arry[1] = butData.data
                arry[4] = meassage.text
                Updateinfo(arry).then(() => {
                    return meassage.reply.text('修改成功')
                }, () => {
                    return meassage.reply.text('写入文件失败')
                })
                return bot.cleanEvent('text')
            }
        })
    }
    function chagestatus() {
        info[butData.data].status = info[butData.data].status ? 0 : 1
        let button = {
            replyMarkup: data.message.reply_markup
        }
        for(let i = 0;i < data.message.reply_markup.inline_keyboard.length;i++)
            for(let k = 0;k < data.message.reply_markup.inline_keyboard[i].length;k++) {
                if(data.message.reply_markup.inline_keyboard[i][k].callback_data == data.data)
                button.replyMarkup.inline_keyboard[i][k].text = `当前状态：${info[butData.data].status ? '开' : '关'}`
            }
        bot.editMessageReplyMarkup({ messageId: data.message.message_id, chatId: data.message.chat.id }, button)
        Writefile('./user.json', JSON.stringify(info))
    }
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
                    if (AllsetI[arry[1]]) {
                        clearInterval(AllsetI[arry[1]])
                        delete AllsetI[arry[1]]
                    }
                    Writefile('./user.json', JSON.stringify(json)).then(() => {
                        msg.reply.text('删除成功')
                        info = json
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
