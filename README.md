# rebot

关于telegram的机器人

可以自定义消息内容和轮询时间

# 如何使用

npm install

# 第一步

在telegram中创建机器人
将令牌复制到app.js中的token一行中
将AdminN改为你的名字

# 第二步运行：

使用PM2：

PM2 start app

或者直接运行

node app

# 如何配置消息

私聊机器人
添加群组信息格式如下:

/set 群组名 轮询间隔（单位秒） 内容 默认是否开启[可选]

# 删除轮播群组

/remove 群组名 

# 在群组中运行轮播

/start 开始运行

/off 关闭运行

