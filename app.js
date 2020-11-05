const { stat } = require('fs/promises');
const fs = require('fs')
const TeleBot = require('telebot')
const bot = new TeleBot({
    token: '1400299756:AAFCRDspSQku0QnUaGAN-vsQTXzAI0V-NOo', // Required. Telegram Bot API token.
    allowedUpdates: [], // Optional. List the types of updates you want your bot to receive. Specify an empty list to receive all updates.
    usePlugins: ['askUser'], // Optional. Use user plugins from pluginFolder.
    pluginFolder: '../plugins/', // Optional. Plugin folder location.
    pluginConfig: { // Optional. Plugin configuration.
        // myPluginName: {
        //   data: 'my custom value'
        // }
    }
});
//读取json配置
var grop_list = fs.readFileSync('./user.json')
grop_list = grop_list.toJSON()
var bot_list = {
    
}

//循环指令开始
bot.on(['/start', '/hello'], (msg) => {
    if(msg.from.username === 'Justin12138')//只接受指定用户的指令
    {

        try {
            var chat = bot_list[msg.chat.title]
            chat.status = true
            msg.reply.text('主人，宝宝已经收到！')
        } catch (error) {
            return error
        }
        setInterval(() =>{
            if(chat.status)
                msg.reply.text(chat.text)
            else
                return
        },chat.setInterval)
        
    }
})
//停止单个循环
bot.on('/off', (msg) => {
    if(msg.from.username === 'Justin12138')
    {
        try {
            var chat = bot_list[msg.chat.title]
            chat.status = false
            msg.reply.text('主人，宝宝已经收到！')
        } catch (error) {
            return error
        }
    }
})

//私聊设置群组的循环内容和轮询时间
bot.on('/set', (msg) => SetGroupInfo(msg));

function SetGroupInfo(msg)
{
    //添加更新群组配置表
    let from = msg.chat;
    if(from.username === 'Justin12138' && from.type === 'private')
    {
        try {
            let text = msg.text;
            let arry = text.split(' ');
            let json = { }
            json[arry[1]] = {       
                setInterval:  arry[2],
                text : arry[3],
                status: false    
            }
            msg.reply.text('添加成功')
            console.log(json)
        } catch (error) {
            return
        }
    }
}

function RemoveGroupUser(msg)
{
    //删除用户配置


    

}




function Serach(age)
{
    if(age == null || age == 0 || age == '' || age == ' ') 
        return
    


}


bot.connect()