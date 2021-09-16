// 初始化插件

// 全局保存当前选中窗口
var g_iWndIndex = 0; //可以不用设置这个变量，有窗口参数的接口中，不用传值，开发包会默认使用当前选择窗口
$(function () {
    // 检查插件是否已经安装过
    var iRet = WebVideoCtrl.I_CheckPluginInstall();
    if (-1 == iRet) {
        alert("您还未安装过插件，双击开发包目录里的WebComponentsKit.exe安装！");
        return;
    }

    // 初始化插件参数及插入插件
    WebVideoCtrl.I_InitPlugin(800, 600, {
        bWndFull: true,     //是否支持单窗口双击全屏，默认支持 true:支持 false:不支持
        iPackageType: 2,    //2:PS 11:MP4
        iWndowType: 1,
        bNoPlugin: true,
        cbSelWnd: function (xmlDoc) {
            g_iWndIndex = parseInt($(xmlDoc).find("SelectWnd").eq(0).text(), 10);
            var szInfo = "当前选择的窗口编号：" + g_iWndIndex;
            console.log(szInfo);
        },
        cbDoubleClickWnd: function (iWndIndex, bFullScreen) {
            var szInfo = "当前放大的窗口编号：" + iWndIndex;
            if (!bFullScreen) {            
                szInfo = "当前还原的窗口编号：" + iWndIndex;
            }
            console.log(szInfo);
                        
            // 此处可以处理单窗口的码流切换
            /*if (bFullScreen) {
                clickStartRealPlay(1);
            } else {
                clickStartRealPlay(2);
            }*/
        },
        cbEvent: function (iEventType, iParam1, iParam2) {
            if (2 == iEventType) {// 回放正常结束
                console.log("窗口" + iParam1 + "回放结束！");
            } else if (-1 == iEventType) {
                console.log("设备" + iParam1 + "网络错误！");
            } else if (3001 == iEventType) {
                clickStopRecord(g_szRecordType, iParam1);
            }
        },
        cbRemoteConfig: function () {
            console.log("关闭远程配置库！");
        },
        cbInitPluginComplete: function () {
            WebVideoCtrl.I_InsertOBJECTPlugin("divPlugin");

            // 检查插件是否最新
            if (-1 == WebVideoCtrl.I_CheckPluginVersion()) {
                alert("检测到新的插件版本，双击开发包目录里的WebComponentsKit.exe升级！");
                return;
            }
        }
    });

    // 窗口事件绑定
    $(window).bind({
        resize: function () {
            var $Restart = $("#restartDiv");
            if ($Restart.length > 0) {
                var oSize = getWindowSize();
                $Restart.css({
                    width: oSize.width + "px",
                    height: oSize.height + "px"
                });
            }
        }
    });
});
 
// 获取窗口尺寸
function getWindowSize() {
    var nWidth = $(this).width() + $(this).scrollLeft(),
        nHeight = $(this).height() + $(this).scrollTop();

    return {width: nWidth, height: nHeight};
}

// 窗口分割数
function changeWndNum(iType) {
    iType = parseInt(iType, 10);
    WebVideoCtrl.I_ChangeWndNum(iType);
}

var camerauser="",camerapassword="";
var cameraip = "",cameraport = "", camerauser = "", camerapassword = ""; //服务器

$(document).ready(function(){
    console.log(window.top.sessionStorage.getItem("robotcameraip"),window.top.sessionStorage.getItem("robotcameraip") !== "null");
    if(window.top.sessionStorage.getItem("robotcameraip") !== "null"){
        cameraip = window.top.sessionStorage.getItem("robotcameraip");
        cameraport = window.top.sessionStorage.getItem("cameraport");
        camerauser = window.top.sessionStorage.getItem("camerauser"),
        camerapassword = window.top.sessionStorage.getItem("camerapassword");
        console.log(cameraip,'--cameraip--',camerauser,'--camerauser--',camerapassword,'--camerapassword--');
        // 获取摄像头IP，直接赋值登录
        if(cameraip != null){
            // $("#loginip").val() = cameraip; //不可以这样写，否则会报错
            var szIP = cameraip,
                szPort = cameraport,
                szUsername = camerauser,
                szPassword = camerapassword;
        }

        if ("" == szIP || "" == szPort) {
            return;
        }

        var szDeviceIdentify = szIP + "_" + szPort;

        console.log(szDeviceIdentify);
        var iRet = WebVideoCtrl.I_Login(szIP, 1, szPort, szUsername, szPassword, {
            success: function (xmlDoc) {            
                console.log(szDeviceIdentify + " 登录成功！");
                $("#ip").prepend("<option value='" + szDeviceIdentify + "'>" + szDeviceIdentify + "</option>");
                setTimeout(function () {
                    $("#ip").val(szDeviceIdentify);
                    getChannelInfo();
                    getDevicePort();
                }, 10);
            },
            error: function (status, xmlDoc) {
                alert(szDeviceIdentify + " 登录失败！", status, xmlDoc);
            }
        });

        if (-1 == iRet) {
            alert(szDeviceIdentify + " 已登录过！");
            clickLogout();
        }
        //------------------------------------------------------------------- //
        setTimeout(function(){
            var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
                szDeviceIdentify = $("#ip").val(),
                iRtspPort = parseInt($("#rtspport").val(), 10),
                iChannelID = parseInt($("#channels").val(), 10),
                bZeroChannel = $("#channels option").eq($("#channels").get(0).selectedIndex).attr("bZero") == "true" ? true : false,
                szInfo = "";

            if ("undefined" === typeof iStreamType) {
                iStreamType = parseInt($("#streamtype").val(), 10);
            }

            if (null == szDeviceIdentify) {
                return;
            }
            var startRealPlay = function () {
                WebVideoCtrl.I_StartRealPlay(szDeviceIdentify, {
                    iRtspPort: iRtspPort,
                    iStreamType: iStreamType,
                    iChannelID: iChannelID,
                    bZeroChannel: bZeroChannel,
                    success: function () {
                        szInfo = "开始预览成功！";
                        console.log(szDeviceIdentify + " " + szInfo);
                    },
                    error: function (status, xmlDoc) {
                        if (403 === status) {
                            szInfo = "设备不支持Websocket取流！";
                        } else {
                            szInfo = "开始预览失败！";
                        }
                        alert(szDeviceIdentify + " " + szInfo);
                    }
                });
            };

            if (oWndInfo != null) {// 已经在播放了，先停止
                WebVideoCtrl.I_Stop({
                    success: function () {
                        startRealPlay();
                    }
                });
            } else {
                startRealPlay();
            }
        },200)
    }
})

// --------------------机器人巡检-----------------------------
var robotip = "" , robotId = "";
if(window.top.sessionStorage.getItem("getrobothttpip") != undefined){
    robotip = window.top.sessionStorage.getItem("getrobothttpip");
}
if(window.top.sessionStorage.getItem("robotId") != undefined){
    robotId = window.top.sessionStorage.getItem("robotId");
}
console.log(robotip,'--robotip--',robotId,'--robotId--');
// var robotId = 0;  //机器人id；
//解决跨域的方法
// function addScriptTag(src){
//     var script = document.createElement("script");
//     script.setAttribute("type","text/javascript");
//     script.src = src;
//     document.body.appendChild(script);
// }

function jsonp(options) {
    // console.log(options);
    // 1. 产生不同的函数名(函数名随机)
    let callBackName = 'itLike' + Math.random().toString().substr(2)+Math.random().toString().substr(2);
    // console.log(callBackName);
    // 2. 产生一个全局函数
    window[callBackName] = function (params) {
        // console.log(params);
        // console.log(options.success);
        if(params !== null){
            options.success(params);
        }else{
            options.failure(params);
        }
        // 2.1 删除当前脚本标签
        scriptE.remove();
        // 2.2 将创建的全局函数设为null
        window[callBackName] = null;
    };
    // 3. 取出url地址
    let jsonpUrl;
    if(options.data !== undefined){
        jsonpUrl = options.url + '?' + options.data + '&callBack=' + callBackName;
    }else {
        jsonpUrl = options.url + '?callBack=' + callBackName;
    }
    // 4. 创建script标签
    let scriptE = document.createElement('script');
    scriptE.src = jsonpUrl;
    document.body.appendChild(scriptE);
}

// 机器人移动方向 左为1、右为3、上为7、下为9；移动速度为15；
function mouseDownRBTControl(robotIndex){
    console.log(robotIndex,"机器人操作");
    jsonp({
        url: robotip + "/MotorControl?" + robotId + ',' + robotIndex,
        // data: 'name=前端收割机&age=20',
        success: function (data) {   
            console.log(data);
        },
        failure:function(data){
            console.log("数据请求失败");
        }
    });
    // addScriptTag(robotip + "/MotorControl?" + robotId + ',' + robotIndex);
    // var xmlhttp = new XMLHttpRequest();
    // // get方法带参数是将参数写在url里面传过去给后端
    // xmlhttp.open("GET", robotip + "/MotorControl?" + robotId + ',' + robotIndex, true);
    // xmlhttp.setRequestHeader("Content-Type", "application/json;charset=utf8");
    // xmlhttp.send();
    // // readyState == 4 为请求完成， status == 200 为请求成功返回的状态
    // xmlhttp.onreadystatechange = function() {
    //     if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
    //         console.log(xmlhttp.responseText,'----------success');
    //     }else{
    //         console.log(xmlhttp,'----------error');
    //     }
    // }
}

// // 停止移动 水平停止移动为0，垂直停止移动为6
// function mouseUpRBTControl(robotstopIndex){
//     // console.log(robotstopIndex);
//     // $.ajax({
//     //     url : robotip + "/MotorControl?" + robotId + ',' + robotstopIndex,
//     //     type : "get",
//     //     dataType: "json",
//     //     success:function(result) {
//     //         console.log(result,'----停止移动success');
//     //     },
//     //     error:function(error) {
//     //         console.log(error,'------停止移动error');
//     //     }
//     // }); 

//     var xmlhttp = new XMLHttpRequest();
//     // get方法带参数是将参数写在url里面传过去给后端
//     xmlhttp.open("GET", robotip + "/MotorControl?" + robotId + ',' + robotstopIndex, true);
//     xmlhttp.setRequestHeader("Content-Type", "application/json;charset=utf8");
//     xmlhttp.send();
//     // readyState == 4 为请求完成， status == 200 为请求成功返回的状态
//     xmlhttp.onreadystatechange = function() {
//         if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
//             console.log(xmlhttp.responseText,'----------success');
//         }else{
//             console.log(xmlhttp,'----------error');
//         }
//     }
// }

// 一键巡检
function Akeyinspection(startval){
    console.log(startval);
    jsonp({
        url:robotip + "/Patrol?" + robotId + ',' + startval,
        // data: 'name=前端收割机&age=20',
        success: function (data) {   
            console.log(data);
        },
        failure:function(data){
            console.log("数据请求失败");
        }
    });
    // addScriptTag(robotip + "/Patrol?" + robotId + ',' + startval);
    // var xmlhttp = new XMLHttpRequest();
    // // get方法带参数是将参数写在url里面传过去给后端
    // xmlhttp.open("GET", robotip + "/Patrol?" + robotId + ',' + startval, true);
    // xmlhttp.setRequestHeader("Content-Type", "application/json;charset=utf8");
    // xmlhttp.send();
    // // readyState == 4 为请求完成， status == 200 为请求成功返回的状态
    // xmlhttp.onreadystatechange = function() {
    //     if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
    //         console.log(xmlhttp.responseText,'----------success');
    //     }else{
    //         console.log(xmlhttp,'----------error');
    //     }
    // }

}

// 暂停巡检
function Suspendedinspection(pauseval){
    console.log(pauseval);
    jsonp({
        url:robotip + "/Patrol?" + robotId + ',' + pauseval,
        // data: 'name=前端收割机&age=20',
        success: function (data) {   
            console.log(data);
        },
        failure:function(data){
            console.log("数据请求失败");
        }
    });
    // addScriptTag(robotip + "/Patrol?" + robotId + ',' + pauseval);
    // var xmlhttp = new XMLHttpRequest();
    // // get方法带参数是将参数写在url里面传过去给后端
    // xmlhttp.open("GET", robotip + "/Patrol?" + robotId + ',' + pauseval, true);
    // xmlhttp.setRequestHeader("Content-Type", "application/json;charset=utf8");
    // xmlhttp.send();
    // // readyState == 4 为请求完成， status == 200 为请求成功返回的状态
    // xmlhttp.onreadystatechange = function() {
    //     if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
    //         console.log(xmlhttp.responseText,'----------success');
    //     }else{
    //         console.log(xmlhttp,'----------error');
    //     }
    // }
}

// 继续巡检
function Continuetoinspection(resumeval){
    console.log(resumeval);
    jsonp({
        url:robotip + "/Patrol?" + robotId + ',' + resumeval,
        // data: 'name=前端收割机&age=20',
        success: function (data) {   
            console.log(data);
        },
        failure:function(data){
            console.log("数据请求失败");
        }
    });
    // addScriptTag(robotip + "/Patrol?" + robotId + ',' + resumeval);
    // var xmlhttp = new XMLHttpRequest();
    // // get方法带参数是将参数写在url里面传过去给后端
    // xmlhttp.open("GET", robotip + "/Patrol?" + robotId + ',' + resumeval, true);
    // xmlhttp.setRequestHeader("Content-Type", "application/json;charset=utf8");
    // xmlhttp.send();
    // // readyState == 4 为请求完成， status == 200 为请求成功返回的状态
    // xmlhttp.onreadystatechange = function() {
    //     if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
    //         console.log(xmlhttp.responseText,'----------success');
    //     }else{
    //         console.log(xmlhttp,'----------error');
    //     }
    // }
}

// 自动巡检
function Automaticinspection(){
    console.log(robotId);
    jsonp({
        url:robotip + "/AutoModel?" + robotId,
        // data: 'name=前端收割机&age=20',
        success: function (data) {   
            console.log(data);
        },
        failure:function(data){
            console.log("数据请求失败");
        }
    });
    // addScriptTag(robotip + "/AutoModel?" + robotId);
    // var xmlhttp = new XMLHttpRequest();
    // // get方法带参数是将参数写在url里面传过去给后端
    // xmlhttp.open("GET", robotip + "/AutoModel?" + robotId, true);
    // xmlhttp.setRequestHeader("Content-Type", "application/json;charset=utf8");
    // xmlhttp.send();
    // // readyState == 4 为请求完成， status == 200 为请求成功返回的状态
    // xmlhttp.onreadystatechange = function() {
    //     if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
    //         console.log(xmlhttp.responseText,'----------success');
    //     }else{
    //         console.log(xmlhttp,'----------error');
    //     }
    // }
}

// 手动巡检
function Manualinspection(){
    console.log(robotId);
    jsonp({
        url:robotip + "/ManualModel?" + robotId,
        // data: 'name=前端收割机&age=20',
        success: function (data) {   
            console.log(data);
        },
        failure:function(data){
            console.log("数据请求失败");
        }
    });
    // addScriptTag(robotip + "/ManualModel?" + robotId);
    // var xmlhttp = new XMLHttpRequest();
    // // get方法带参数是将参数写在url里面传过去给后端
    // xmlhttp.open("GET", robotip + "/ManualModel?" + robotId, true);
    // xmlhttp.setRequestHeader("Content-Type", "application/json;charset=utf8");
    // xmlhttp.send();
    // // readyState == 4 为请求完成， status == 200 为请求成功返回的状态
    // xmlhttp.onreadystatechange = function() {
    //     if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
    //         console.log(xmlhttp.responseText,'----------success');
    //     }else{
    //         console.log(xmlhttp,'----------error');
    //     }
    // }
}

// 一键复位
function Amasterreset(){
    console.log(robotId);
    jsonp({
        url:robotip + "/Reset?" + robotId,
        // data: 'name=前端收割机&age=20',
        success: function (data) {   
            console.log(data);
        },
        failure:function(data){
            console.log("数据请求失败");
        }
    });
    // addScriptTag(robotip + "/Reset?" + robotId);
    // var xmlhttp = new XMLHttpRequest();
    // // get方法带参数是将参数写在url里面传过去给后端
    // xmlhttp.open("GET", robotip + "/Reset?" + robotId, true);
    // xmlhttp.setRequestHeader("Content-Type", "application/json;charset=utf8");
    // xmlhttp.send();
    // // readyState == 4 为请求完成， status == 200 为请求成功返回的状态
    // xmlhttp.onreadystatechange = function() {
    //     if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
    //         console.log(xmlhttp.responseText,'----------success');
    //     }else{
    //         console.log(xmlhttp,'----------error');
    //     }
    // }
}

// 紧急停止
function Emergencystop(){
    console.log(robotId);
    jsonp({
        url:robotip + "/Stop?" + robotId,
        // data: 'name=前端收割机&age=20',
        success: function (data) {   
            console.log(data);
        },
        failure:function(data){
            console.log("数据请求失败");
        }
    });
    // addScriptTag(robotip + "/Stop?" + robotId);
    // var xmlhttp = new XMLHttpRequest();
    // // get方法带参数是将参数写在url里面传过去给后端
    // xmlhttp.open("GET", robotip + "/Stop?" + robotId, true);
    // xmlhttp.setRequestHeader("Content-Type", "application/json;charset=utf8");
    // xmlhttp.send();
    // // readyState == 4 为请求完成， status == 200 为请求成功返回的状态
    // xmlhttp.onreadystatechange = function() {
    //     if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
    //         console.log(xmlhttp.responseText,'----------success');
    //     }else{
    //         console.log(xmlhttp,'----------error');
    //     }
    // }
}

//===================================机器人模块==============================================================

// 登录
// function clickLogin() {
//     var szIP = $("#loginip").val(),
//         szPort = $("#port").val(),
//         szUsername = $("#username").val(),
//         szPassword = $("#password").val();

//     if ("" == szIP || "" == szPort) {
//         return;
//     }

//     var szDeviceIdentify = szIP + "_" + szPort;

//     var iRet = WebVideoCtrl.I_Login(szIP, 1, szPort, szUsername, szPassword, {
//         success: function (xmlDoc) {            
//             console.log(szDeviceIdentify + " 登录成功！");

//             $("#ip").prepend("<option value='" + szDeviceIdentify + "'>" + szDeviceIdentify + "</option>");
//             setTimeout(function () {
//                 $("#ip").val(szDeviceIdentify);
//                 getChannelInfo();
//                 getDevicePort();
//             }, 10);
//         },
//         error: function (status, xmlDoc) {
//             console.log(szDeviceIdentify + " 登录失败！", status, xmlDoc);
//         }
//     });

//     if (-1 == iRet) {
//         console.log(szDeviceIdentify + " 已登录过！");
//     }
// }

// // 退出
function clickLogout() {
    var szDeviceIdentify = $("#ip").val(),
        szInfo = "";

    if (null == szDeviceIdentify) {
        return;
    }

    var iRet = WebVideoCtrl.I_Logout(szDeviceIdentify);
    if (0 == iRet) {
        szInfo = "退出成功！";

        $("#ip option[value='" + szDeviceIdentify + "']").remove();
        getChannelInfo();
        getDevicePort();
    } else {
        szInfo = "退出失败！";
    }
    console.log(szDeviceIdentify + " " + szInfo);
}

// // 获取设备信息
// function clickGetDeviceInfo() {
//     var szDeviceIdentify = $("#ip").val();

//     if (null == szDeviceIdentify) {
//         return;
//     }

//     WebVideoCtrl.I_GetDeviceInfo(szDeviceIdentify, {
//         success: function (xmlDoc) {
//             var arrStr = [];
//             arrStr.push("设备名称：" + $(xmlDoc).find("deviceName").eq(0).text() + "\r\n");
//             arrStr.push("设备ID：" + $(xmlDoc).find("deviceID").eq(0).text() + "\r\n");
//             arrStr.push("型号：" + $(xmlDoc).find("model").eq(0).text() + "\r\n");
//             arrStr.push("设备序列号：" + $(xmlDoc).find("serialNumber").eq(0).text() + "\r\n");
//             arrStr.push("MAC地址：" + $(xmlDoc).find("macAddress").eq(0).text() + "\r\n");
//             arrStr.push("主控版本：" + $(xmlDoc).find("firmwareVersion").eq(0).text() + " " + $(xmlDoc).find("firmwareReleasedDate").eq(0).text() + "\r\n");
//             arrStr.push("编码版本：" + $(xmlDoc).find("encoderVersion").eq(0).text() + " " + $(xmlDoc).find("encoderReleasedDate").eq(0).text() + "\r\n");
            
//             console.log(szDeviceIdentify + " 获取设备信息成功！");
//             alert(arrStr.join(""));
//         },
//         error: function (status, xmlDoc) {
//             console.log(szDeviceIdentify + " 获取设备信息失败！", status, xmlDoc);
//         }
//     });
// }

// function getchangechannel(val){
// 	console.log(val);
// }

// 获取通道
function getChannelInfo() {
    var szDeviceIdentify = $("#ip").val(),
        oSel = $("#channels").empty();
		
    if (null == szDeviceIdentify) {
        return;
    }

    // 模拟通道
    WebVideoCtrl.I_GetAnalogChannelInfo(szDeviceIdentify, {
        async: false,
        success: function (xmlDoc) {
            var oChannels = $(xmlDoc).find("VideoInputChannel");
			// console.log(oChannels,'-----oChannels');
            $.each(oChannels, function (i) {
				// console.log(i,'-------i');
                var id = $(this).find("id").eq(0).text(),
                    name = $(this).find("name").eq(0).text();
                if ("" == name) {
                    name = "Camera " + (i < 9 ? "0" + (i + 1) : (i + 1));
                }
                oSel.append("<option value='" + id + "' bZero='false'>" + name + "</option>");
            });
            console.log(szDeviceIdentify + " 获取模拟通道成功！");
        },
        error: function (status, xmlDoc) {
            console.log(szDeviceIdentify + " 获取模拟通道失败！", status, xmlDoc);
        }
    });
    // 数字通道
    WebVideoCtrl.I_GetDigitalChannelInfo(szDeviceIdentify, {
        async: false,
        success: function (xmlDoc) {
            var oChannels = $(xmlDoc).find("InputProxyChannelStatus");

            $.each(oChannels, function (i) {
                var id = $(this).find("id").eq(0).text(),
                    name = $(this).find("name").eq(0).text(),
                    online = $(this).find("online").eq(0).text();
                if ("false" == online) {// 过滤禁用的数字通道
                    return true;
                }
                if ("" == name) {
                    name = "IPCamera " + (i < 9 ? "0" + (i + 1) : (i + 1));
                }
                oSel.append("<option value='" + id + "' bZero='false'>" + name + "</option>");
            });
            console.log(szDeviceIdentify + " 获取数字通道成功！");
        },
        error: function (status, xmlDoc) {
            console.log(szDeviceIdentify + " 获取数字通道失败！", status, xmlDoc);
        }
    });
    // 零通道
    WebVideoCtrl.I_GetZeroChannelInfo(szDeviceIdentify, {
        async: false,
        success: function (xmlDoc) {
            var oChannels = $(xmlDoc).find("ZeroVideoChannel");
            
            $.each(oChannels, function (i) {
                var id = $(this).find("id").eq(0).text(),
                    name = $(this).find("name").eq(0).text();
                if ("" == name) {
                    name = "Zero Channel " + (i < 9 ? "0" + (i + 1) : (i + 1));
                }
                if ("true" == $(this).find("enabled").eq(0).text()) {// 过滤禁用的零通道
                    oSel.append("<option value='" + id + "' bZero='true'>" + name + "</option>");
                }
            });
            console.log(szDeviceIdentify + " 获取零通道成功！");
        },
        error: function (status, xmlDoc) {
            console.log(szDeviceIdentify + " 获取零通道失败！", status, xmlDoc);
        }
    });
}

// 获取端口
function getDevicePort() {
    var szDeviceIdentify = $("#ip").val();

    if (null == szDeviceIdentify) {
        return;
    }

    var oPort = WebVideoCtrl.I_GetDevicePort(szDeviceIdentify);
    if (oPort != null) {
        $("#deviceport").val(oPort.iDevicePort);
        $("#rtspport").val(oPort.iRtspPort);

        console.log(szDeviceIdentify + " 获取端口成功！");
    } else {
        console.log(szDeviceIdentify + " 获取端口失败！");
    }
}

// // 获取数字通道
// function clickGetDigitalChannelInfo() {
//     var szDeviceIdentify = $("#ip").val(),
//         iAnalogChannelNum = 0;

//     $("#digitalchannellist").empty();

//     if (null == szDeviceIdentify) {
//         return;
//     }

//     // 模拟通道
//     WebVideoCtrl.I_GetAnalogChannelInfo(szDeviceIdentify, {
//         async: false,
//         success: function (xmlDoc) {
//             iAnalogChannelNum = $(xmlDoc).find("VideoInputChannel").length;
//         },
//         error: function () {
            
//         }
//     });

//     // 数字通道
//     WebVideoCtrl.I_GetDigitalChannelInfo(szDeviceIdentify, {
//         async: false,
//         success: function (xmlDoc) {
//             var oChannels = $(xmlDoc).find("InputProxyChannelStatus");
            
//             $.each(oChannels, function () {
//                 var id = parseInt($(this).find("id").eq(0).text(), 10),
//                     ipAddress = $(this).find("ipAddress").eq(0).text(),
//                     srcInputPort = $(this).find("srcInputPort").eq(0).text(),
//                     managePortNo = $(this).find("managePortNo").eq(0).text(),
//                     online = $(this).find("online").eq(0).text(),
//                     proxyProtocol = $(this).find("proxyProtocol").eq(0).text();
                            
//                 var objTr = $("#digitalchannellist").get(0).insertRow(-1);
//                 var objTd = objTr.insertCell(0);
//                 objTd.innerHTML = (id - iAnalogChannelNum) < 10 ? "D0" + (id - iAnalogChannelNum) : "D" + (id - iAnalogChannelNum);
//                 objTd = objTr.insertCell(1);
//                 objTd.width = "25%";
//                 objTd.innerHTML = ipAddress;
//                 objTd = objTr.insertCell(2);
//                 objTd.width = "15%";
//                 objTd.innerHTML = srcInputPort;
//                 objTd = objTr.insertCell(3);
//                 objTd.width = "20%";
//                 objTd.innerHTML = managePortNo;
//                 objTd = objTr.insertCell(4);
//                 objTd.width = "15%";
//                 objTd.innerHTML = "true" == online ? "在线" : "离线";
//                 objTd = objTr.insertCell(5);
//                 objTd.width = "25%";
//                 objTd.innerHTML = proxyProtocol;
//             });
//             console.log(szDeviceIdentify + " 获取数字通道成功！");
//         },
//         error: function (status, xmlDoc) {
//             console.log(szDeviceIdentify + " 没有数字通道！", status, xmlDoc);
//         }
//     });
// }

// 开始预览
// function clickStartRealPlay(iStreamType) {
//     var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
//         szDeviceIdentify = $("#ip").val(),
//         iRtspPort = parseInt($("#rtspport").val(), 10),
//         iChannelID = parseInt($("#channels").val(), 10),
//         bZeroChannel = $("#channels option").eq($("#channels").get(0).selectedIndex).attr("bZero") == "true" ? true : false,
//         szInfo = "";

//     if ("undefined" === typeof iStreamType) {
//         iStreamType = parseInt($("#streamtype").val(), 10);
//     }

//     if (null == szDeviceIdentify) {
//         return;
//     }

//     var startRealPlay = function () {
//         WebVideoCtrl.I_StartRealPlay(szDeviceIdentify, {
//             iRtspPort: iRtspPort,
//             iStreamType: iStreamType,
//             iChannelID: iChannelID,
//             bZeroChannel: bZeroChannel,
//             success: function () {
//                 szInfo = "开始预览成功！";
//                 console.log(szDeviceIdentify + " " + szInfo);
//             },
//             error: function (status, xmlDoc) {
//                 if (403 === status) {
//                     szInfo = "设备不支持Websocket取流！";
//                 } else {
//                     szInfo = "开始预览失败！";
//                 }
//                 console.log(szDeviceIdentify + " " + szInfo);
//             }
//         });
//     };

//     if (oWndInfo != null) {// 已经在播放了，先停止
//         WebVideoCtrl.I_Stop({
//             success: function () {
//                 startRealPlay();
//             }
//         });
//     } else {
//         startRealPlay();
//     }
// }

// 停止预览
function clickStopRealPlay() {
    var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
        szInfo = "";

    if (oWndInfo != null) {
        WebVideoCtrl.I_Stop({
            success: function () {
                szInfo = "停止预览成功！";
                console.log(oWndInfo.szDeviceIdentify + " " + szInfo);
            },
            error: function () {
                szInfo = "停止预览失败！";
                console.log(oWndInfo.szDeviceIdentify + " " + szInfo);
            }
        });
    }
}

// 检查插件版本
function clickCheckPluginVersion() {
    var iRet = WebVideoCtrl.I_CheckPluginVersion();
    if (0 == iRet) {
        alert("您的插件版本已经是最新的！");
    } else {
        alert("检测到新的插件版本！");
    }
}