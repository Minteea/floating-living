const AcClient = require("ac-danmu")
const { EventEmitter } = require('events')

class acfunLive {
    constructor (id, conf = {}) {
        this.id = id        // 直播间号
        this.uid = 0        // 主播uid
        this.conf = conf
        this.event = new EventEmitter() // 事件触发器
        this.open(id)
        console.log("连接直播间")
    }
    async open(id) {
        this.client = await AcClient(id)
        //启动websocket连接
        let client = this.client        
        client.wsStart();
        client.on("enter", () => {
            console.log("acfunLive: 已连接AcFun直播间");
        });
        client.on("recent-comment", (comments) => {    //当前弹幕列表
            
        });
        client.on("danmaku", (danmaku) => {     //收到的弹幕
            this.msg_danmaku(danmaku)
        });
        client.on("like", (like) => {     //收到的点赞
            this.msg_like(like)
        });
        client.on("gift", (gift) => {           //收到的礼物
            this.msg_gift(gift)
        });
        client.on("user-enter", (entry) => {    //用户进入直播间
            this.msg_user_enter(entry)
        });
        client.on("join-club", (join) => {      //用户加入守护团
            this.msg_join_club(join)
        });
        client.on("live-info", (info) => {      //直播间数据状态
            this.msg_live_info(info)
        });
        client.on("liveclose", (end) => {
            console.log("acfunLive: 直播已结束或中断")
        })
        this.openTest(id)
    }
    on(eventName, func) {   // 监听事件
        this.event.on(eventName, func)
    }
    emit(eventName, ...args) {  // 触发事件
        this.event.emit(eventName, ...args)
    }
    close() {
        console.log("acfunLive: 暂不支持手动关闭客户端")
    }
    msg_danmaku(data) {
        let date = parseInt(data.sendTimeMs)
        let medal = null
        let identity = data.userInfo.userIdentity
        if (data.userInfo.badge) {
            let medalInfo = (JSON.parse(data.userInfo.badge)).medalInfo
            medal = {
                name: medalInfo.clubName,
                uid: medalInfo.uperId,
                level: medalInfo.level,
            }
        }
        let danmaku = {
            platform: "acfun",
            room: this.id,
            type: "text",
            timeStamp: date,
            data: {
                text: data.content,
                user: data.userInfo.nickname,
                uid: parseInt(data.userInfo.userId),
                date: date,
                medal: medal,
                identity: identity,
            },
        }
        this.toChat(danmaku)
    }
    msg_like(data) {
        let date = parseInt(data.sendTimeMs)
        let medal = null
        let identity = data.userInfo.userIdentity
        if (data.userInfo.badge) {
            let medalInfo = (JSON.parse(data.userInfo.badge)).medalInfo
            medal = {
                name: medalInfo.clubName,
                uid: medalInfo.uperId,
                level: medalInfo.level,
            }
        }
        let like = {
            platform: "acfun",
            room: this.id,
            type: "like",
            timestamp: date,
            data: {
                user: data.userInfo.nickname,           // 用户名
                uid: parseInt(data.userInfo.userId),    // 用户uid
                date: date,
                medal: medal,
            },
            identity: identity
        }
        this.toChat(like)
    }
    msg_gift(data) {
        let date = parseInt(data.sendTimeMs)
        let medal = null
        let identity = data.user.userIdentity
        if (data.user.badge) {
            let medalInfo = (JSON.parse(data.user.badge)).medalInfo
            medal = {
                name: medalInfo.clubName,
                uid: medalInfo.uperId,
                level: medalInfo.level,
            }
        }
        let gift = {
            platform: "acfun",
            room: this.id,
            type: "gift",
            timeStamp: date,
            data: {
                name: data.giftName,        // 礼物名称
                giftId: parseInt(data.giftId),        // 礼物id
                num: data.count,              // 礼物数量
                cost: parseInt(data.value),      // 总花费
                coinType: "coin",   // 货币种类
                user: data.user.nickname,           // 用户名
                uid: parseInt(data.user.userId),    // 用户uid
                date: date,                 // 日期(ms时间戳)
                medal: medal,               // 粉丝勋章
                identity: identity,
            },
        }
        this.toChat(gift)
    }
    msg_user_enter(data) {
        let date = parseInt(data.sendTimeMs)
        let medal = null
        let identity = data.userInfo.userIdentity
        if (data.userInfo.badge) {
            let medalInfo = (JSON.parse(data.userInfo.badge)).medalInfo
            medal = {
                name: medalInfo.clubName,
                uid: medalInfo.uperId,
                level: medalInfo.level,
            }
        }
        let entry = {
            platform: "acfun",
            room: this.id,
            type: "entry",
            timestamp: date,
            data: {
                user: data.userInfo.nickname,           // 用户名
                uid: parseInt(data.userInfo.userId),    // 用户uid
                date: date,
                medal: medal,
            },
            identity: identity
        }
        this.toChat(entry)
    }
    msg_join_club(data) {

    }
    msg_live_info(data) {
        // this.toData(msg)
    }
    toChat(data) {       // 一般消息
        this.emit('msg', data)
    }
    toGift(data) {       // 礼物消息
        this.emit('gift', data)
    }
    toTest(data) {       // 源消息
        this.emit('origin', data)
    }
    openTest() {
        this.client.on("recent-comment", (comments) => {   //当前弹幕列表
            this.toTest(comments)
        });
        this.client.on("danmaku", (danmaku) => {    //收到的弹幕
            this.toTest({type: "chat", data: danmaku})
        });
        this.client.on("like", (like) => {          //收到的点赞
            this.toTest({type: "like", data: like})
        });
        this.client.on("gift", (gift) => {          //收到的礼物
            this.toTest({type: "gift", data: gift})
        });
        this.client.on("user-enter", (entry) => {   //用户进入直播间
            this.toTest({type: "entry", data: entry})
        });
        this.client.on("join-club", (join) => {     //用户加入守护团
            this.toTest({type: "join", data: join})
        });
        this.client.on("live-info", (info) => {     //直播间数据状态
            this.toTest({type: "live-info", data: info})
        });
    }
}



module.exports = acfunLive
