# rebot

关于telegram的机器人

可以自定义消息内容和轮询时间

如何使用

npm install

在telegram中创建机器人将令牌复制到app.js中的token一行中

将AdminN改为你的名字

第二步运行：

使用PM2：

PM2 start app

或者直接运行

node app

私聊机器人添加群组信息格式如下:

/set 群组名 轮询间隔（单位秒） 内容 默认是否开启[可选]

然后再群组中输入/start就可以开始运行

/off关闭运行

