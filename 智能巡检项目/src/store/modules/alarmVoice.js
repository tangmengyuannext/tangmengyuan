/*
 * @Author: tangyue
 * @Date: 2021-08-26 10:33:46
 * @LastEditTime: 2021-08-27 10:09:07
 * @LastEditors: Please set LastEditors
 * @Description: websocket 推送告警语音
 * @FilePath: \psim-ui\src\store\modules\alarmVoice.js
 */
const alarmVoice =  {
    state: {
        websock: null,
        url: '',
        // lockReconnect: false, //是否真正建立连接
        // timeout: 25 * 1000, //25秒一次心跳
        // timeoutObj: null, //心跳心跳倒计时
        // serverTimeoutObj: null, //心跳倒计时
        timeoutnum: null, //断开 重连倒计时
        message: {},

        voiceList: [],
        voiceCount: 0,
        voiceNum: 0,
        // audio: {},
        lockReconnect: false, // 避免重复连接
        connCount: 0,
        src: ''
    },
    getters: {
        message(state) {
            return state.message;
        }
    },
    mutations: {
        SET_VOICELIST: (state, voiceList) => {
            state.voiceList = voiceList
        },
        SET_VOICENUM: (state, voiceNum) => {
            state.voiceNum = voiceNum
        },
        SET_SRC: (state, src) => {
            state.src = src
        },
        WEBSOCKET_INIT(state, url) {
            var that = this;
            state.websock = new WebSocket(url);
            state.url = url;
            state.websock.onopen = function(e) {
                console.log('与服务端连接打开->',e)
            }
            state.websock.onmessage = function(callBack) {
                console.log('来自服务端的消息->',callBack)
                let tempData = JSON.parse(callBack.data)
                if (tempData.messageType == "HeartBeat") { // 判断心跳
                    const message = {
                        messageType: 'HeartBeat',
                        messageContent: ''
                    }
                    state.websock.send(JSON.stringify(message))
                    console.log('======心跳======')
                    return
                } else {
                    let voiceTempList = JSON.parse(tempData.messageContent);
                    console.log('新增的告警', voiceTempList)
                    for (let i = 0; i < voiceTempList.length; i++) {
                        state.voiceList.push(voiceTempList[i]);
                    }
                    console.log('告警列表', state.voiceList)
                    state.voiceCount += voiceTempList.length;
                    if (state.voiceNum === 0) { // 重新开始播放
                        state.voiceList = [];
                        state.voiceList = voiceTempList
                        console.log('重新开始播放')
                        that.commit('SET_SRC', state.voiceList[0].broadcastUrl)
                        that.commit('palyAudio')
                    }
                }
                //重置心跳
                // that.commit('reset')
                state.message = callBack.data
            }
            state.websock.οnerrοr = function(e) { // 错误
                // console.log(e)
                console.log('与服务端连接异常->',e)
                that.commit('reconnect')
            }
            state.websock.onclose = function(e) { // 关闭
                console.log('与服务端连接关闭->',e)
                // console.log(e)
                that.commit('reconnect')
            }
        },
        WEBSOCKET_SEND(state, message) {
            state.websock.send(message);
        },
        reconnect(state) { //重新连接
            // console.log("重新连接")
            var that = this;
            if (state.lockReconnect) {
                console.log('正在重连中。。。')
                return;
            }
            state.lockReconnect = true;
            //没连接上会一直重连，设置延迟避免请求过多
            state.timeoutnum && clearTimeout(state.timeoutnum);
            if (state.connCount === 49) { // 重连50次后关闭不再重连
                state.connCount = 0
                state.websock.close();
            } else {
                state.timeoutnum = setTimeout(function() {
                    state.connCount += 1
                    console.log('重新连接' + state.connCount + '次')
                    //新连接
                    that.commit('WEBSOCKET_INIT', state.url)
                    state.lockReconnect = false;
                }, 5000);
            }
        },
        // 播放音频文件
        palyAudio(state) {
            let audio = new Audio(state.src);
            audio.play();
            const that = this;
            audio.onended =()=>{
                state.voiceCount -= 1;
                if (state.voiceCount > 0) {
                    // 判断列表中还有待播放音频
                    state.voiceNum += 1;
                    console.log('还剩' + state.voiceCount)
                    console.log('播放了' + state.voiceNum + '个')
                    console.log('即将播放下角标：' + state.voiceNum)
                    that.commit('SET_SRC', state.voiceList[state.voiceNum].broadcastUrl)
                    // that.palyAudio(state.voiceList[state.voiceNum].broadcastUrl);
                    that.commit('palyAudio')
                } else {
                    console.log('播完了')
                    audio.pause();
                    that.commit('SET_VOICELIST', [])
                    that.commit('SET_VOICENUM', 0)
                }
            }
        },
        // d
        reset(state) { //重置心跳
            //清除时间
            clearTimeout(state.timeoutObj);
            clearTimeout(state.serverTimeoutObj);
            //心跳
            this.commit('start')
        },
        start(state) { //开启心跳
            // console.log("开启心跳")
            var that = this;
            state.timeoutObj && clearTimeout(state.timeoutObj);
            state.serverTimeoutObj && clearTimeout(state.serverTimeoutObj);
            state.timeoutObj = setTimeout(function() {
                //这里发送一个心跳，后端收到后，返回一个心跳消息，
                // console.log(state.websock)
                if (state.websock.readyState == 1) { //如果连接正常
                    state.websock.send("heartCheck");
                } else { //否则重连
                    that.commit('reconnect')
                }
                state.serverTimeoutObj = setTimeout(function() {
                    //超时关闭
                    state.websock.close();
                }, state.timeout);

            }, state.timeout)
        },
    },
    actions: {
        WEBSOCKET_INIT({
            commit
        }, url) {
            commit('WEBSOCKET_INIT', url)
        },
        WEBSOCKET_SEND({
            commit
        }, message) {
            commit('WEBSOCKET_SEND', message)
        },

    }
}

export default alarmVoice
