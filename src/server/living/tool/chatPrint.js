class chatPrint{
    constructor () {

    }
    log(message) {
        switch (message.type) {
            case "text": {
                let medal = ""
                let mark = ""
                if (message.data.medal) {
                    medal = `[${message.data.medal.name}(${message.data.medal.level})] `
                }
                switch (message.data.mark) {
                    case "guard-1":
                        mark = "[总督]"
                        break
                    case "guard-2":
                        mark = "[提督]"
                        break
                    case "guard-3":
                        mark = "[舰长]"
                        break
                }
                console.log(`${"\x1b[32m"}${medal}${"\x1b[36m"}${mark}${"\x1b[33m"}${message.data.user}${"\x1b[0m"}: ${message.data.text}`)
                break
            }
            case "like": {
                let medal = ""
                if (message.data.medal) {
                    medal = `[${message.data.medal.name}(${message.data.medal.level})] `
                }
                console.log(`${"\x1b[40;32m"}${medal}${"\x1b[40;33m"}${message.data.user}${"\x1b[0m"} 点赞了`)
                break
            }
            case "gift": {
                let medal = ""
                if (message.data.medal) {
                    medal = `[${message.data.medal.name}(${message.data.medal.level})] `
                }
                console.log(`${"\x1b[40;32m"}${medal}${"\x1b[40;33m"}${message.data.user}${"\x1b[0m"} 投喂 ${"\x1b[40;33m"}${message.data.name} x${message.data.num}${"\x1b[0m"}`)
                break
            }
            case "entry": {
                let medal = ""
                if (message.data.medal) {
                    medal = `[${message.data.medal.name}(${message.data.medal.level})] `
                }
                console.log(`${"\x1b[40;32m"}${medal}${"\x1b[40;33m"}${message.data.user}${"\x1b[0m"} 进入直播间`)
                break
            }
            case "entry_effect": {
                let label = ""
                let medal = ""
                switch (message.data.label) {
                    case "guard-1":
                        label = "总督"
                        break
                    case "guard-2":
                        label = "提督"
                        break
                    case "guard-3":
                        label = "舰长"
                        break
                    case "rank-1":
                        label = "榜1"
                        break
                    case "rank-2":
                        label = "榜2"
                        break
                    case "rank-3":
                        label = "榜3"
                        break
                    default:
                        label = "!"
                }
                if (message.data.medal) {
                    medal = `[${message.data.medal.name}(${message.data.medal.level})] `
                }
                console.log(`${"\x1b[1;31m"}${label} ${"\x1b[0;32m"}${medal}${"\x1b[33m"}${message.data.user}${"\x1b[0m"} 进入直播间`)
                break
            }
            case "follow": {
                let medal = ""
                if (message.data.medal) {
                    medal = `[${message.data.medal.name}(${message.data.medal.level})] `
                }
                console.log(`${"\x1b[40;32m"}${medal}${"\x1b[40;33m"}${message.data.user}${"\x1b[0m"} 关注了主播`)
                break
            }
            case "share": {
                let medal = ""
                if (message.data.medal) {
                    medal = `[${message.data.medal.name}(${message.data.medal.level})] `
                }
                console.log(`${"\x1b[40;32m"}${medal}${"\x1b[40;33m"}${message.data.user}${"\x1b[0m"} 分享了直播间`)
                break
            }
        }
    }
}

module.exports = chatPrint