# rebot

关于telegram的机器人

可以自定义消息内容和轮询时间

# 如何使用

npm install

# 第一步

在telegram中创建机器人
将令牌复制到app.js中的token一行中
将AdminN改为你的用户名

# 第二步运行：

使用PM2：

PM2 start app

或者直接运行

node app

# 如何配置消息
私聊机器人
添加群组信息格式如下:

/set 群组名 轮询间隔（单位秒) 默认是否开启[可选]

然后在文本中输入你的消息

示例：/set 二手交易群 10 1

# 删除轮播群组

/remove 群组名 

# 运行轮播

/on 开始运行全部
/set 动态管理状态
/off 关闭运行全部

