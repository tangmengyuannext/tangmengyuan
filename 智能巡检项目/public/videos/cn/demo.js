// 初始化插件
// console.log(window.top.sessionStorage.getItem("nvrip"),'---------NVRip');
// console.log(window.top.sessionStorage.getItem("camerauser"),'---------camerauser');
// console.log(window.top.sessionStorage.getItem("camerapassword"),'---------camerapassword');
var cameraip = "",cameraport = "",camerauser = "",camerapassword = "",cameraid = "",
    cameraName="",ishasInfrared = "",hasPtz = "",ishassite = "",ishasnvr="",
    robotip = "",nvrcameraip = "",robotId = "",speedval = "";
$(".robotdiv").hide();

window.onload = function(){
    cameraip = window.top.sessionStorage.getItem("cameraip");
    cameraport = window.top.sessionStorage.getItem("cameraport");
    camerauser = window.top.sessionStorage.getItem("camerauser");
    camerapassword = window.top.sessionStorage.getItem("camerapassword");
    cameraid = window.top.sessionStorage.getItem("propcameraId");
    cameraName = window.top.sessionStorage.getItem("cameraName");
    ishasInfrared = window.top.sessionStorage.getItem("ishasInfrared");
    hasPtz = window.top.sessionStorage.getItem("hasPtz");
    ishassite = window.top.sessionStorage.getItem("ishassite");
    ishasnvr = window.top.sessionStorage.getItem("ishasnvr");
    robotip = window.top.sessionStorage.getItem("getrobotip");
    nvrcameraip = window.top.sessionStorage.getItem("nvrip")
    if(window.top.sessionStorage.getItem("getrobotid") != undefined){
        robotId = window.top.sessionStorage.getItem("getrobotid");
    }
    speedval = $("#speed").val();
    console.log('获取全部值');

    if(ishasInfrared === "1"){
        window.sessionStorage.setItem("cameraid",cameraid);
        $("#videodemo").css({
            "display":"block"
        });
        $(".plugin").css({
            "width":"600px",
            "height":"500px"
        });
        $(".ptz").css({
            "margin-left":"1210px"
        })
        $(".yuzhiwei").css({
            "margin-left":"1210px"
        })
         // 初始化插件参数及插入插件
        WebVideoCtrl.I_InitPlugin(600, 500, {
            bWndFull: true,     //是否支持单窗口双击全屏，默认支持 true:支持 false:不支持
            iPackageType: 2,    //2:PS 11:MP4
            iWndowType: 1,  //窗口
            bNoPlugin: true,
            cbSelWnd: function (xmlDoc) {
                g_iWndIndex = parseInt($(xmlDoc).find("SelectWnd").eq(0).text(), 10);
                var szInfo = "当前选择的窗口编号：" + g_iWndIndex;
                showCBInfo(szInfo);
            },
            cbDoubleClickWnd: function (iWndIndex, bFullScreen) {
                var szInfo = "当前放大的窗口编号：" + iWndIndex;
                if (!bFullScreen) {            
                    szInfo = "当前还原的窗口编号：" + iWndIndex;
                }
                showCBInfo(szInfo);
            },
            cbEvent: function (iEventType, iParam1, iParam2) {
                if (2 == iEventType) {// 回放正常结束
                    showCBInfo("窗口" + iParam1 + "回放结束！");
                } else if (-1 == iEventType) {
                    showCBInfo("设备" + iParam1 + "网络错误！");
                } else if (3001 == iEventType) {
                    clickStopRecord(g_szRecordType, iParam1);
                }
            },
            cbRemoteConfig: function () {
                showCBInfo("关闭远程配置库！");
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
    }else if(ishasInfrared === "0"){
        window.sessionStorage.setItem("cameraid",undefined);
        $("#videodemo").css({
            "display":"none"
        });
        $(".plugin").css({
            "width":"900px",
            "height":"500px",
            "z-index":"-999",
        });
         // 初始化插件参数及插入插件
         WebVideoCtrl.I_InitPlugin(900, 500, {
            bWndFull: true,     //是否支持单窗口双击全屏，默认支持 true:支持 false:不支持
            iPackageType: 2,    //2:PS 11:MP4
            iWndowType: 1,  //窗口
            bNoPlugin: true,
            cbSelWnd: function (xmlDoc) {
                g_iWndIndex = parseInt($(xmlDoc).find("SelectWnd").eq(0).text(), 10);
                var szInfo = "当前选择的窗口编号：" + g_iWndIndex;
                showCBInfo(szInfo);
            },
            cbDoubleClickWnd: function (iWndIndex, bFullScreen) {
                var szInfo = "当前放大的窗口编号：" + iWndIndex;
                if (!bFullScreen) {
                    szInfo = "当前还原的窗口编号：" + iWndIndex;
                }
                showCBInfo(szInfo);
                            
                // 此处可以处理单窗口的码流切换
                /*if (bFullScreen) {
                    clickStartRealPlay(1);
                } else {
                    clickStartRealPlay(2);
                }*/
            },
            cbEvent: function (iEventType, iParam1, iParam2) {
                if (2 == iEventType) {// 回放正常结束
                    showCBInfo("窗口" + iParam1 + "回放结束！");
                } else if (-1 == iEventType) {
                    showCBInfo("设备" + iParam1 + "网络错误！");
                } else if (3001 == iEventType) {
                    clickStopRecord(g_szRecordType, iParam1);
                }
            },
            cbRemoteConfig: function () {
                showCBInfo("关闭远程配置库！");
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
    }
    // 控制云台操作的隐藏显示
    if(hasPtz === "0"){
        $(".ptz").hide();
    }else if(hasPtz === "1"){
        $(".ptz").show();
    }

    if(ishassite === "0"){
        $(".yuzhiwei").hide();
    }else if(ishassite === "1"){
        $(".yuzhiwei").show();
    }

     // 是否接入NVR的隐藏显示
     if(ishasnvr === "0" ){
        $(".hasnvr").hide();
    }else if(ishasnvr === "1" ){
        $(".hasnvr").show();
    }

    if(window.top.sessionStorage.getItem("getrobotid") != "undefined"){
        $(".robotdiv").show();
    }else{
        $(".robotdiv").hide();
    }

    if(camerauser !== null && camerapassword !== null){
        // 获取摄像头IP，直接赋值登录
        if(cameraip != null){
            var szIP = cameraip,
                szPort = cameraport,
                szUsername = camerauser,
                szPassword = camerapassword;
        }
        console.log(szIP);

        if ("" == szIP || "" == szPort) {
            return;
        }

        var szDeviceIdentify = szIP + "_" + szPort;
        console.log("182登陆方法之前szIP==",szIP,"szPort==",szPort,"szUsername==",szUsername,"szPassword==",szPassword)
        var iRet = WebVideoCtrl.I_Login(szIP, 1, szPort, szUsername, szPassword, {
            success: function (xmlDoc) {            
                console.log(szDeviceIdentify + " 登录成功！185");
                setTimeout(function(){
                    $("#videodemo").attr("src","./videodemo.html");
                },300);
                $("#ip").prepend("<option value='" + szDeviceIdentify + "'>" + szDeviceIdentify + "</option>");
                setTimeout(function () {
                    $("#ip").val(szDeviceIdentify);
                    getChannelInfo();
                    getDevicePort();
                }, 10);
                setTimeout(function(){
                    // 预览
                    yulanFution();
                },200)
            },
            error: function (status, xmlDoc) {
                console.log(xmlDoc,"登陆失败201",status)
                alert(szDeviceIdentify + " 登录失败！201", status, xmlDoc);
            }
        });

        if (-1 == iRet) {
            alert(szDeviceIdentify + " 已登录过！");
            clickLogout();
        }
        //------------------------------------------------------------------- //
        // setTimeout(function(){
            
        // },200)
    }
}
// 预览方法摘出
function yulanFution(){
    console.log("setTimeout开始预览方法207")
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
    console.log("startRealPlay开始预览方法上一行222")
    var startRealPlay = function () {
        console.log("startRealPlay开始预览方法里面224")
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

}
// --------------------机器人巡检-----------------------------
// var robotip = "" , robotId = "", speedval = "";
// $(document).ready(function(){
    // console.log(window.top.sessionStorage.getItem("getrobotip"),'----机器人IP',window.top.sessionStorage.getItem("getrobotid"));
    // if(window.top.sessionStorage.getItem("getrobotip") != undefined){
    //     robotip = window.top.sessionStorage.getItem("getrobotip");
    // }
// })
console.log(robotip,'--robotip--',robotId,'--robotId--');

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
// function addScriptTag(src){
//     var script = document.createElement("script");
//     script.setAttribute("type","text/javascript");
//     script.src = src;
//     document.body.appendChild(script);
// }

// 机器人移动方向 左为1、右为3、上为7、下为9；移动速度为15；
function mouseDownRBTControl(robotIndex){
    console.log(robotIndex);
    jsonp({
        url: robotip + "/MotorControl?" + robotId + ',' + robotIndex + ',' + speedval,
        // data: 'name=前端收割机&age=20',
        success: function (data) {
            console.log(data);
        },
        failure:function(data){
            console.log("数据请求失败");
        }
    });
    // addScriptTag(robotip + "/MotorControl?" + robotId + ',' + robotIndex + ',' + speedval);
}

// 获取机器人当前坐标
var arrrobot=[],robotobj={},robotx="",roboty="";
function getrobotcoordinate(){
    arrrobot=[];
    // 第一步： 获得XMLHttpRequest对象
    var ajax = new XMLHttpRequest();
    // 第二步： 设置状态监听函数
    ajax.onreadystatechange = function(){
        //console.log(ajax.readyState);
        //console.log(ajax.status);
        // 第五步：在监听函数中，判断readyState=4 && status=200表示请求成功
        if(ajax.readyState==4 && ajax.status==200){
            // 第六步： 使用responseText、responseXML接受响应数据，并使用原生JS操作DOM进行显示
            console.log(ajax.responseText); //------获取数据；
            var str = "",num = "";
            str = ajax.responseText.substr(0, ajax.responseText.length - 1);
            num = str.substr(1);
            console.log(num);            
            console.log(num.split(",")[0],'---',num.split(",")[1]);
            console.log(num.split(",")[0].split(":")[1],'------', num.split(",")[1].split(":")[1])
            
            robotx = num.split(",")[0].split(":")[1];
            roboty = num.split(",")[1].split(":")[1];
            robotobj = {
                robotx:robotx,
                roboty:roboty
            }
            console.log(robotobj,'---机器人坐标');
            arrrobot.push(robotobj);
            console.log(arrrobot);
            //给父页面传数据
            window.parent.postMessage({robotxylist:arrrobot},'*');
        }
    }
    // 第三步： open一个链接
    ajax.open("GET",robotip + "/QueryPos?" + robotId + ',' + "?timeStamp=" + new Date().getTime(),true);//true异步请求，false同步
    // ajax.open('GET','192.168.1.187:18080',false);
    // 第四步： send一个请求。 可以发送对象和字符串，不需要传递数据发送null
    ajax.send(null);
    // jsonp({
    //     url: robotip + "/QueryPos?" + robotId + ',',
    //     success: function (data) {   
    //         console.log(data);
    //         var str = data;
    //         var num=[]; num = str.split(",");
    //         robotx = num[0].split(":")[1];
    //         roboty = num[1].split(":")[1];
    //         robotobj = {
    //             robotx:robotx,
    //             roboty:roboty
    //         }
    //         arrrobot.push(robotobj);
    //         console.log(arrrobot);
    //         //给父页面传数据
    //         window.parent.postMessage({robotxylist:arrrobot},'*');
    //     },
    //     failure:function(data){
    //         console.log("数据请求失败");
    //     }
    // });
}
//======================================================================================

function userfunc(){
    if(ishasInfrared === "1"){
        videodemo.window.stopheart();
    }
}

// 全局保存当前选中窗口
var g_iWndIndex = 0; //可以不用设置这个变量，有窗口参数的接口中，不用传值，开发包会默认使用当前选择窗口
$(function () {
    // 检查插件是否已经安装过
    var iRet = WebVideoCtrl.I_CheckPluginInstall();
    if (-1 == iRet) {
        alert("您还未安装过插件，双击开发包目录里的WebComponentsKit.exe安装！");
        return;
    }

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

    //初始化日期时间
    var szCurTime = dateFormat(new Date(), "yyyy-MM-dd");
    $("#starttime").val(szCurTime + " 00:00:00");
    $("#endtime").val(szCurTime + " 23:59:59");
});


// 显示操作信息
function showOPInfo(szInfo, status, xmlDoc) {
    var szTip = "<div>" + dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss") + " " + szInfo;
    if (typeof status != "undefined" && status != 200) {
        var szStatusString = $(xmlDoc).find("statusString").eq(0).text();
        var szSubStatusCode = $(xmlDoc).find("subStatusCode").eq(0).text();
        if ("" === szSubStatusCode) {
            szTip += "(" + status + ", " + szStatusString + ")";
        } else {
            szTip += "(" + status + ", " + szSubStatusCode + ")";
        }
    }
    szTip += "</div>";

    $("#opinfo").html(szTip + $("#opinfo").html());
}

// 显示回调信息
function showCBInfo(szInfo) {
    szInfo = "<div>" + dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss") + " " + szInfo + "</div>";
    $("#cbinfo").html(szInfo + $("#cbinfo").html());
}

// 格式化时间
function dateFormat(oDate, fmt) {
    var o = {
        "M+": oDate.getMonth() + 1, //月份
        "d+": oDate.getDate(), //日
        "h+": oDate.getHours(), //小时
        "m+": oDate.getMinutes(), //分
        "s+": oDate.getSeconds(), //秒
        "q+": Math.floor((oDate.getMonth() + 3) / 3), //季度
        "S": oDate.getMilliseconds()//毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (oDate.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

// 获取窗口尺寸
function getWindowSize() {
    var nWidth = $(this).width() + $(this).scrollLeft(),
        nHeight = $(this).height() + $(this).scrollTop();

    return {width: nWidth, height: nHeight};
}

// 打开选择框 0：文件夹  1：文件
function clickOpenFileDlg(id, iType) {
    var szDirPath = WebVideoCtrl.I_OpenFileDlg(iType);
    
    if (szDirPath != -1 && szDirPath != "" && szDirPath != null) {
        $("#" + id).val(szDirPath);
    }
}

// 获取本地参数
function clickGetLocalCfg() {
    var xmlDoc = WebVideoCtrl.I_GetLocalCfg();

    if (xmlDoc != null) {
        $("#netsPreach").val($(xmlDoc).find("BuffNumberType").eq(0).text());
        $("#wndSize").val($(xmlDoc).find("PlayWndType").eq(0).text());
        $("#rulesInfo").val($(xmlDoc).find("IVSMode").eq(0).text());
        $("#captureFileFormat").val($(xmlDoc).find("CaptureFileFormat").eq(0).text());
        $("#packSize").val($(xmlDoc).find("PackgeSize").eq(0).text());
        $("#recordPath").val($(xmlDoc).find("RecordPath").eq(0).text());
        $("#downloadPath").val($(xmlDoc).find("DownloadPath").eq(0).text());
        $("#previewPicPath").val($(xmlDoc).find("CapturePath").eq(0).text());
        $("#playbackPicPath").val($(xmlDoc).find("PlaybackPicPath").eq(0).text());
        $("#devicePicPath").val($(xmlDoc).find("DeviceCapturePath").eq(0).text());
        $("#playbackFilePath").val($(xmlDoc).find("PlaybackFilePath").eq(0).text());
        $("#protocolType").val($(xmlDoc).find("ProtocolType").eq(0).text());

        showOPInfo("本地配置获取成功！");
    } else {
        showOPInfo("本地配置获取失败！");
    }
}

// 设置本地参数
function clickSetLocalCfg() {
    var arrXml = [],
        szInfo = "";
    
    arrXml.push("<LocalConfigInfo>");
    arrXml.push("<PackgeSize>" + $("#packSize").val() + "</PackgeSize>");
    arrXml.push("<PlayWndType>" + $("#wndSize").val() + "</PlayWndType>");
    arrXml.push("<BuffNumberType>" + $("#netsPreach").val() + "</BuffNumberType>");
    arrXml.push("<RecordPath>" + $("#recordPath").val() + "</RecordPath>");
    arrXml.push("<CapturePath>" + $("#previewPicPath").val() + "</CapturePath>");
    arrXml.push("<PlaybackFilePath>" + $("#playbackFilePath").val() + "</PlaybackFilePath>");
    arrXml.push("<PlaybackPicPath>" + $("#playbackPicPath").val() + "</PlaybackPicPath>");
    arrXml.push("<DeviceCapturePath>" + $("#devicePicPath").val() + "</DeviceCapturePath>");
    arrXml.push("<DownloadPath>" + $("#downloadPath").val() + "</DownloadPath>");
    arrXml.push("<IVSMode>" + $("#rulesInfo").val() + "</IVSMode>");
    arrXml.push("<CaptureFileFormat>" + $("#captureFileFormat").val() + "</CaptureFileFormat>");
    arrXml.push("<ProtocolType>" + $("#protocolType").val() + "</ProtocolType>");
    arrXml.push("</LocalConfigInfo>");

    var iRet = WebVideoCtrl.I_SetLocalCfg(arrXml.join(""));

    if (0 == iRet) {
        szInfo = "本地配置设置成功！";
    } else {
        szInfo = "本地配置设置失败！";
    }
    showOPInfo(szInfo);
}

// 窗口分割数
function changeWndNum(iType) {
    iType = parseInt(iType, 10);
    WebVideoCtrl.I_ChangeWndNum(iType);
}

// 登录
function clickLogin() {
    // var szIP = $("#loginip").val(),
    //     szPort = $("#port").val(),
    //     szUsername = camerauser,
    //     szPassword = camerapassword;

    // if ("" == szIP || "" == szPort) {
    //     return;
    // }

    // var szDeviceIdentify = szIP + "_" + szPort;

    // var iRet = WebVideoCtrl.I_Login(szIP, 1, szPort, szUsername, szPassword, {
    //     success: function (xmlDoc) {            
    //         showOPInfo(szDeviceIdentify + " 登录成功！");

    //         $("#ip").prepend("<option value='" + szDeviceIdentify + "'>" + szDeviceIdentify + "</option>");
    //         setTimeout(function () {
    //             $("#ip").val(szDeviceIdentify);
    //             getChannelInfo();
    //             getDevicePort();
    //         }, 10);
    //     },
    //     error: function (status, xmlDoc) {
    //         showOPInfo(szDeviceIdentify + " 登录失败！", status, xmlDoc);
    //     }
    // });

    // if (-1 == iRet) {
    //     showOPInfo(szDeviceIdentify + " 已登录过！");
    // }
}

// 退出
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

// 获取设备信息
function clickGetDeviceInfo() {
    var szDeviceIdentify = $("#ip").val();

    if (null == szDeviceIdentify) {
        return;
    }

    WebVideoCtrl.I_GetDeviceInfo(szDeviceIdentify, {
        success: function (xmlDoc) {
            var arrStr = [];
            arrStr.push("设备名称：" + $(xmlDoc).find("deviceName").eq(0).text() + "\r\n");
            arrStr.push("设备ID：" + $(xmlDoc).find("deviceID").eq(0).text() + "\r\n");
            arrStr.push("型号：" + $(xmlDoc).find("model").eq(0).text() + "\r\n");
            arrStr.push("设备序列号：" + $(xmlDoc).find("serialNumber").eq(0).text() + "\r\n");
            arrStr.push("MAC地址：" + $(xmlDoc).find("macAddress").eq(0).text() + "\r\n");
            arrStr.push("主控版本：" + $(xmlDoc).find("firmwareVersion").eq(0).text() + " " + $(xmlDoc).find("firmwareReleasedDate").eq(0).text() + "\r\n");
            arrStr.push("编码版本：" + $(xmlDoc).find("encoderVersion").eq(0).text() + " " + $(xmlDoc).find("encoderReleasedDate").eq(0).text() + "\r\n");
            
            showOPInfo(szDeviceIdentify + " 获取设备信息成功！");
            alert(arrStr.join(""));
        },
        error: function (status, xmlDoc) {
            showOPInfo(szDeviceIdentify + " 获取设备信息失败！", status, xmlDoc);
        }
    });
}

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

            $.each(oChannels, function (i) {
                var id = $(this).find("id").eq(0).text(),
                    name = $(this).find("name").eq(0).text();
                if ("" == name) {
                    name = "Camera " + (i < 9 ? "0" + (i + 1) : (i + 1));
                }
                oSel.append("<option value='" + id + "' bZero='false'>" + name + "</option>");
            });
            showOPInfo(szDeviceIdentify + " 获取模拟通道成功！");
        },
        error: function (status, xmlDoc) {
            showOPInfo(szDeviceIdentify + " 获取模拟通道失败！", status, xmlDoc);
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
            showOPInfo(szDeviceIdentify + " 获取数字通道成功！");
        },
        error: function (status, xmlDoc) {
            showOPInfo(szDeviceIdentify + " 获取数字通道失败！", status, xmlDoc);
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
            showOPInfo(szDeviceIdentify + " 获取零通道成功！");
        },
        error: function (status, xmlDoc) {
            showOPInfo(szDeviceIdentify + " 获取零通道失败！", status, xmlDoc);
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

        showOPInfo(szDeviceIdentify + " 获取端口成功！");
    } else {
        alert(szDeviceIdentify + " 获取端口失败！");
    }
}

// 获取数字通道
function clickGetDigitalChannelInfo() {
    var szDeviceIdentify = $("#ip").val(),
        iAnalogChannelNum = 0;

    $("#digitalchannellist").empty();

    if (null == szDeviceIdentify) {
        return;
    }

    // 模拟通道
    WebVideoCtrl.I_GetAnalogChannelInfo(szDeviceIdentify, {
        async: false,
        success: function (xmlDoc) {
            iAnalogChannelNum = $(xmlDoc).find("VideoInputChannel").length;
        },
        error: function () {
            
        }
    });

    // 数字通道
    WebVideoCtrl.I_GetDigitalChannelInfo(szDeviceIdentify, {
        async: false,
        success: function (xmlDoc) {
            var oChannels = $(xmlDoc).find("InputProxyChannelStatus");
            
            $.each(oChannels, function () {
                var id = parseInt($(this).find("id").eq(0).text(), 10),
                    ipAddress = $(this).find("ipAddress").eq(0).text(),
                    srcInputPort = $(this).find("srcInputPort").eq(0).text(),
                    managePortNo = $(this).find("managePortNo").eq(0).text(),
                    online = $(this).find("online").eq(0).text(),
                    proxyProtocol = $(this).find("proxyProtocol").eq(0).text();
                            
                var objTr = $("#digitalchannellist").get(0).insertRow(-1);
                var objTd = objTr.insertCell(0);
                objTd.innerHTML = (id - iAnalogChannelNum) < 10 ? "D0" + (id - iAnalogChannelNum) : "D" + (id - iAnalogChannelNum);
                objTd = objTr.insertCell(1);
                objTd.width = "25%";
                objTd.innerHTML = ipAddress;
                objTd = objTr.insertCell(2);
                objTd.width = "15%";
                objTd.innerHTML = srcInputPort;
                objTd = objTr.insertCell(3);
                objTd.width = "20%";
                objTd.innerHTML = managePortNo;
                objTd = objTr.insertCell(4);
                objTd.width = "15%";
                objTd.innerHTML = "true" == online ? "在线" : "离线";
                objTd = objTr.insertCell(5);
                objTd.width = "25%";
                objTd.innerHTML = proxyProtocol;
            });
            showOPInfo(szDeviceIdentify + " 获取数字通道成功！");
        },
        error: function (status, xmlDoc) {
            showOPInfo(szDeviceIdentify + " 没有数字通道！", status, xmlDoc);
        }
    });
}

// 开始预览
function clickStartRealPlay(iStreamType) {
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
        console.log("预览方法808")
        WebVideoCtrl.I_StartRealPlay(szDeviceIdentify, {
            iRtspPort: iRtspPort,
            iStreamType: iStreamType,
            iChannelID: iChannelID,
            bZeroChannel: bZeroChannel,
            success: function () {
                szInfo = "开始预览成功！";
                showOPInfo(szDeviceIdentify + " " + szInfo);
            },
            error: function (status, xmlDoc) {
                if (403 === status) {
                    szInfo = "设备不支持Websocket取流！";
                } else {
                    szInfo = "开始预览失败！";
                }
                showOPInfo(szDeviceIdentify + " " + szInfo);
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
}

// 停止预览
function clickStopRealPlay() {
    var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
        szInfo = "";

    if (oWndInfo != null) {
        WebVideoCtrl.I_Stop({
            success: function () {
                szInfo = "停止预览成功！";
                showOPInfo(oWndInfo.szDeviceIdentify + " " + szInfo);
            },
            error: function () {
                szInfo = "停止预览失败！";
                showOPInfo(oWndInfo.szDeviceIdentify + " " + szInfo);
            }
        });
    }
}

// 打开声音
function clickOpenSound() {
    var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
        szInfo = "";

    if (oWndInfo != null) {
        var allWndInfo = WebVideoCtrl.I_GetWindowStatus();
        // 循环遍历所有窗口，如果有窗口打开了声音，先关闭
        for (var i = 0, iLen = allWndInfo.length; i < iLen; i++) {
            oWndInfo = allWndInfo[i];
            if (oWndInfo.bSound) {
                WebVideoCtrl.I_CloseSound(oWndInfo.iIndex);
                break;
            }
        }

        var iRet = WebVideoCtrl.I_OpenSound();

        if (0 == iRet) {
            szInfo = "打开声音成功！";
        } else {
            szInfo = "打开声音失败！";
        }
        showOPInfo(oWndInfo.szDeviceIdentify + " " + szInfo);
    }
}

// 关闭声音
function clickCloseSound() {
    var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
        szInfo = "";

    if (oWndInfo != null) {
        var iRet = WebVideoCtrl.I_CloseSound();
        if (0 == iRet) {
            szInfo = "关闭声音成功！";
        } else {
            szInfo = "关闭声音失败！";
        }
        showOPInfo(oWndInfo.szDeviceIdentify + " " + szInfo);
    }
}

// 设置音量
function clickSetVolume() {
    var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
        iVolume = parseInt($("#volume").val(), 10),
        szInfo = "";

    if (oWndInfo != null) {
        var iRet = WebVideoCtrl.I_SetVolume(iVolume);
        if (0 == iRet) {
            szInfo = "音量设置成功！";
        } else {
            szInfo = "音量设置失败！";
        }
        showOPInfo(oWndInfo.szDeviceIdentify + " " + szInfo);
    }
}

// 抓图
function clickCapturePic() {
    var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
        szInfo = "";

    if (oWndInfo != null) {
        var xmlDoc = WebVideoCtrl.I_GetLocalCfg();
        var szCaptureFileFormat = "0";
        if (xmlDoc != null) {
            szCaptureFileFormat = $(xmlDoc).find("CaptureFileFormat").eq(0).text();
        }

        var szChannelID = $("#channels").val();
        var szPicName = oWndInfo.szDeviceIdentify + "_" + szChannelID + "_" + new Date().getTime();
        
        szPicName += ("0" === szCaptureFileFormat) ? ".jpg": ".bmp";

        var iRet = WebVideoCtrl.I_CapturePic(szPicName, {
            bDateDir: false  //是否生成日期文件
        });
        if (0 == iRet) {
            szInfo = "抓图成功！";
            alert(szInfo);
            var xmlDoc = WebVideoCtrl.I_GetLocalCfg();
            if (xmlDoc != null) {
                $("#netsPreach").val($(xmlDoc).find("BuffNumberType").eq(0).text());
                $("#wndSize").val($(xmlDoc).find("PlayWndType").eq(0).text());
                $("#rulesInfo").val($(xmlDoc).find("IVSMode").eq(0).text());
                $("#captureFileFormat").val($(xmlDoc).find("CaptureFileFormat").eq(0).text());
                $("#packSize").val($(xmlDoc).find("PackgeSize").eq(0).text());
                $("#recordPath").val($(xmlDoc).find("RecordPath").eq(0).text());
                $("#downloadPath").val($(xmlDoc).find("DownloadPath").eq(0).text());
                $("#previewPicPath").val($(xmlDoc).find("CapturePath").eq(0).text());
                $("#playbackPicPath").val($(xmlDoc).find("PlaybackPicPath").eq(0).text());
                $("#devicePicPath").val($(xmlDoc).find("DeviceCapturePath").eq(0).text());
                $("#playbackFilePath").val($(xmlDoc).find("PlaybackFilePath").eq(0).text());
                $("#protocolType").val($(xmlDoc).find("ProtocolType").eq(0).text());

                showOPInfo("本地配置获取成功！");
                console.log($("#previewPicPath").val(),'-------');
                var imgaddressprop = $("#previewPicPath").val() + '\\' + szPicName;
                var imgobj = {
                    imgaddress:imgaddressprop,
                    imgname:szPicName
                }
                window.parent.postMessage({imgobj:imgobj},'*');
            }
        } else {
            szInfo = "抓图失败！";
        }
        showOPInfo(oWndInfo.szDeviceIdentify + " " + szInfo);
    }
}

// 开始录像
var g_szRecordType = "";
function clickStartRecord(szType) {
    var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
        szInfo = "";

    g_szRecordType = szType;

    if (oWndInfo != null) {
        var szChannelID = $("#channels").val(),
            szFileName = oWndInfo.szDeviceIdentify + "_" + szChannelID + "_" + new Date().getTime();

        WebVideoCtrl.I_StartRecord(szFileName, {
            bDateDir: true, //是否生成日期文件
            success: function () {
                if ('realplay' === szType) {
                    szInfo = "开始录像成功！";
                } else if ('playback' === szType) {
                    szInfo = "开始剪辑成功！";
                }
                showOPInfo(oWndInfo.szDeviceIdentify + " " + szInfo);
            },
            error: function () {
                if ('realplay' === szType) {
                    szInfo = "开始录像失败！";
                } else if ('playback' === szType) {
                    szInfo = "开始剪辑失败！";
                }
                showOPInfo(oWndInfo.szDeviceIdentify + " " + szInfo);
            }
        });
    }
}

// 停止录像
function clickStopRecord(szType, iWndIndex) {
    if ("undefined" === typeof iWndIndex) {
        iWndIndex = g_iWndIndex;
    }
    var oWndInfo = WebVideoCtrl.I_GetWindowStatus(iWndIndex),
        szInfo = "";

    if (oWndInfo != null) {
        WebVideoCtrl.I_StopRecord({
            success: function () {
                if ('realplay' === szType) {
                    szInfo = "停止录像成功！";
                } else if ('playback' === szType) {
                    szInfo = "停止剪辑成功！";
                }
                showOPInfo(oWndInfo.szDeviceIdentify + " " + szInfo);
            },
            error: function () {
                if ('realplay' === szType) {
                    szInfo = "停止录像失败！";
                } else if ('playback' === szType) {
                    szInfo = "停止剪辑失败！";
                }
                showOPInfo(oWndInfo.szDeviceIdentify + " " + szInfo);
            }
        });
    }
}

// 获取对讲通道
function clickGetAudioInfo() {
    var szDeviceIdentify = $("#ip").val();

    if (null == szDeviceIdentify) {
        return; 
    }

    WebVideoCtrl.I_GetAudioInfo(szDeviceIdentify, {
        success: function (xmlDoc) {
            var oAudioChannels = $(xmlDoc).find("TwoWayAudioChannel"),
                oSel = $("#audiochannels").empty();
            $.each(oAudioChannels, function () {
                var id = $(this).find("id").eq(0).text();

                oSel.append("<option value='" + id + "'>" + id + "</option>");
            });
            showOPInfo(szDeviceIdentify + " 获取对讲通道成功！");
        },
        error: function (status, xmlDoc) {
            showOPInfo(szDeviceIdentify + " 获取对讲通道失败！", status, xmlDoc);
        }
    });
}

// 开始对讲
function clickStartVoiceTalk() {
    var szDeviceIdentify = $("#ip").val(),
        iAudioChannel = parseInt($("#audiochannels").val(), 10),
        szInfo = "";

    if (null == szDeviceIdentify) {
        return;
    }

    if (isNaN(iAudioChannel)) {
        alert("请选择对讲通道！");
        return;
    }

    var iRet = WebVideoCtrl.I_StartVoiceTalk(szDeviceIdentify, iAudioChannel);

    if (0 == iRet) {
        szInfo = "开始对讲成功！";
    } else {
        szInfo = "开始对讲失败！";
    }
    showOPInfo(szDeviceIdentify + " " + szInfo);
}

// 停止对讲
function clickStopVoiceTalk() {
    var szDeviceIdentify = $("#ip").val(),
        iRet = WebVideoCtrl.I_StopVoiceTalk(),
        szInfo = "";

    if (null == szDeviceIdentify) {
        return;
    }

    if (0 == iRet) {
        szInfo = "停止对讲成功！";
    } else {
        szInfo = "停止对讲失败！";
    }
    showOPInfo(szDeviceIdentify + " " + szInfo);
}

// 启用电子放大
function clickEnableEZoom() {
    var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
        szInfo = "";

    if (oWndInfo != null) {
        var iRet = WebVideoCtrl.I_EnableEZoom();
        if (0 == iRet) {
            szInfo = "启用电子放大成功！";
        } else {
            szInfo = "启用电子放大失败！";
        }
        showOPInfo(oWndInfo.szDeviceIdentify + " " + szInfo);
    }
}

// 禁用电子放大
function clickDisableEZoom() {
    var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
        szInfo = "";

    if (oWndInfo != null) {
        var iRet = WebVideoCtrl.I_DisableEZoom();
        if (0 == iRet) {
            szInfo = "禁用电子放大成功！";
        } else {
            szInfo = "禁用电子放大失败！";
        }
        showOPInfo(oWndInfo.szDeviceIdentify + " " + szInfo);
    }
}

// 启用3D放大
function clickEnable3DZoom() {
    var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
        szInfo = "";

    if (oWndInfo != null) {
        var iRet = WebVideoCtrl.I_Enable3DZoom();
        if (0 == iRet) {
            szInfo = "启用3D放大成功！";
        } else {
            szInfo = "启用3D放大失败！";
        }
        showOPInfo(oWndInfo.szDeviceIdentify + " " + szInfo);
    }
}

// 禁用3D放大
function clickDisable3DZoom() {
    var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
        szInfo = "";

    if (oWndInfo != null) {
        var iRet = WebVideoCtrl.I_Disable3DZoom();
        if (0 == iRet) {
            szInfo = "禁用3D放大成功！";
        } else {
            szInfo = "禁用3D放大失败！";
        }
        showOPInfo(oWndInfo.szDeviceIdentify + " " + szInfo);
    }
}

// 全屏
function clickFullScreen() {
    WebVideoCtrl.I_FullScreen(true);
}

// PTZ控制 9为自动，1,2,3,4,5,6,7,8为方向PTZ
var g_bPTZAuto = false;
function mouseDownPTZControl(iPTZIndex) {
    var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
        bZeroChannel = $("#channels option").eq($("#channels").get(0).selectedIndex).attr("bZero") == "true" ? true : false,
        iPTZSpeed = $("#ptzspeed").val();

    if (bZeroChannel) {// 零通道不支持云台
        return;
    }
    
    if (oWndInfo != null) {
        if (9 == iPTZIndex && g_bPTZAuto) {
            iPTZSpeed = 0;// 自动开启后，速度置为0可以关闭自动
        } else {
            g_bPTZAuto = false;// 点击其他方向，自动肯定会被关闭
        }

        WebVideoCtrl.I_PTZControl(iPTZIndex, false, {
            iPTZSpeed: iPTZSpeed,
            success: function (xmlDoc) {
                if (9 == iPTZIndex && g_bPTZAuto) {
                    showOPInfo(oWndInfo.szDeviceIdentify + " 停止云台成功！");
                } else {
                    showOPInfo(oWndInfo.szDeviceIdentify + " 开启云台成功！");
                }
                if (9 == iPTZIndex) {
                    g_bPTZAuto = !g_bPTZAuto;
                }
            },
            error: function (status, xmlDoc) {
                showOPInfo(oWndInfo.szDeviceIdentify + " 开启云台失败！", status, xmlDoc);
            }
        });
    }
}

// 方向PTZ停止
function mouseUpPTZControl() {
    var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

    if (oWndInfo != null) {
        WebVideoCtrl.I_PTZControl(1, true, {
            success: function (xmlDoc) {
                showOPInfo(oWndInfo.szDeviceIdentify + " 停止云台成功！");
            },
            error: function (status, xmlDoc) {
                showOPInfo(oWndInfo.szDeviceIdentify + " 停止云台失败！", status, xmlDoc);
            }
        });
    }
}

// // 设置预置点
// function clickSetPreset() {
//     var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
//         iPresetID = parseInt($("#preset").val(), 10);

//     if (oWndInfo != null) {
//         WebVideoCtrl.I_SetPreset(iPresetID, {
//             success: function (xmlDoc) {
//                 showOPInfo(oWndInfo.szDeviceIdentify + " 设置预置点成功！");
//             },
//             error: function (status, xmlDoc) {
//                 showOPInfo(oWndInfo.szDeviceIdentify + " 设置预置点失败！", status, xmlDoc);
//             }
//         });
//     }
// }

// // 调用预置点
// function clickGoPreset() {
//     var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
//         iPresetID = parseInt($("#preset").val(), 10);

//     if (oWndInfo != null) {
//         WebVideoCtrl.I_GoPreset(iPresetID, {
//             success: function (xmlDoc) {
//                 showOPInfo(oWndInfo.szDeviceIdentify + " 调用预置点成功！");
//             },
//             error: function (status, xmlDoc) {
//                 showOPInfo(oWndInfo.szDeviceIdentify + " 调用预置点失败！", status, xmlDoc);
//             }
//         });
//     }
// }

// 数组去重
function unique(arr){
    for(var i=0; i<arr.length; i++){
        for(var j=i+1;j<arr.length; j++){
            if(arr[i] == arr[j]){
                arr.splice(j,1);
                j--;
            }
        }
    }
    return arr;
}
//从父vue获取数据
var camerPresetData=[];
function yuzhiweichuanzhi(yuzhiweiData){
    console.log("nisidskdjsakdjksajdksajdksajd===",yuzhiweiData)
    camerPresetData = yuzhiweiData;
}

var yuzhiweiVal = "",select_con=[],objrobot={};
// 设置预置点
function clickSetPreset() {

    var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
        iPresetID = parseInt($("#preset").val(), 10);
// -----------------------------hk添加-------------------
    console.log(iPresetID,"@@@@@@@@@@@@@@@camerPresetData===",camerPresetData)
    var targetValue = camerPresetData.filter(function (e) { return e.sort==iPresetID; })[0];
    if(targetValue){
        console.log("**********if**1297*************",targetValue)
        alert('预置位编号已占用，请使用其他编号或删除关联此编号的预置位')
        return;
    }else{
        console.log("**********else**1299*************",targetValue)
    }

    var pointArr = [];
    $("#changeyuzhi option").each(function(){
        var point = $(this).text();
        pointArr.push(point);
    })
    // alert(pointArr+"99");

    if(pointArr.indexOf(iPresetID.toString()) != -1){
        // alert('重复了')
        return;
    }else{
        // alert('tianjia')
        pointArr.push(iPresetID)  
    }
// -----------------------------hk添加-------------------
    var optionlist = [];
    if (oWndInfo != null) {
        WebVideoCtrl.I_SetPreset(iPresetID, {
            success: function (xmlDoc) {
                showOPInfo(oWndInfo.szDeviceIdentify + " 设置预置点成功！");
                // if(cameraName == "轨道巡检机器人"){
                //     // alert("是机器人if")
                //     // 获取机器人坐标xy;
                //     // addScriptTag(robotip + "/QueryPos?" + robotId + ',');
                //     jsonp({
                //         url: robotip + "/QueryPos?" + robotId + ',',
                //         // data: 'name=前端收割机&age=20',
                //         success: function (data) {   
                //             console.log(data);
                //             var str = data;
                //             var num=[]; num = str.split(",");
                //             robotx = num[0].split(":")[1];
                //             roboty = num[1].split(":")[1];
                //             arrrobot = {
                //                 sort:iPresetID,
                //                 robotx:robotx,
                //                 roboty:roboty
                //             }
                //             arrrobot.push(arrrobot);
                //             console.log(arrrobot);
                //             //给父页面传数据
                //             window.parent.postMessage({robotxylist:arrrobot},'*');
                //         },
                //         failure:function(data){
                //             console.log("数据请求失败");
                //         }
                //     });
                //     // var xmlhttp = new XMLHttpRequest();
                //     // // get方法带参数是将参数写在url里面传过去给后端
                //     // xmlhttp.open("GET", robotip + "/QueryPos?" + robotId + ',', true);
                //     // xmlhttp.setRequestHeader("Content-Type", "application/json;charset=utf8");
                //     // xmlhttp.send();
                //     // xmlhttp.onreadystatechange = function() {
                //     //     if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                //     //         console.log(xmlhttp.responseText,'----------success');
                //     //         var str = xmlhttp.responseText;
                //     //         var num=[]; num = str.split(",");
                //     //         robotx = num[0].split(":")[1];
                //     //         roboty = num[1].split(":")[1];
                //     //         arrrobot = {
                //     //             sort:iPresetID,
                //     //             robotx:robotx,
                //     //             roboty:roboty
                //     //         }
                //     //         arrrobot.push(arrrobot);
                //     //         console.log(arrrobot);
                //     //         //给父页面传数据
                //     //         window.parent.postMessage({robotxylist:arrrobot},'*');
                //     //     }else{
                //     //         console.log(xmlhttp,'----------error');
                //     //     }
                //     // }
                //     // pointArr
                //     $("#changeyuzhi").append("<option value='"+iPresetID+"' title='"+iPresetID+"1'>"+iPresetID+"</option>");

                //     $("#changeyuzhi option").each(function() {
                //         var option_con = $(this).val();
                //         if($("#changeyuzhi option:contains("+option_con+")").length > 1){
                //             // $("#changeyuzhi option:contains("+option_con+"):gt(0)").remove();
                //         }
                        
                //         optionlist.push(option_con);
                //     });

                //     // var pointArr = [];
                //     // $("#changeyuzhi option").each(function(){
                //     //     var point = $(this).text();
                //     //     pointArr.push(point);
                //     // })
                //     // alert(pointArr);

                //     // if(pointArr.indexOf(iPresetID.toString()) != -1){
                //     //     alert('重复了')
                //     //     return;
                //     // }else{
                //     //     alert('xinde')
                //     //     pointArr.push(iPresetID)  
                //     // }

                //     // alert(optionlist)


                //     yuzhiweiVal = iPresetID;
                //     // objrobot={
                //     //     sort:iPresetID,
                //     //     robotx:robotx,
                //     //     roboty:roboty
                //     // };
                //     // arrrobot.push(objrobot);
                //     select_con = unique(optionlist);  //去重
                //     // select_con=pointArr;
                //     console.log(select_con,'select_con-----select_con')
                //     console.log("select_con==",select_con)
                //     //给父页面传数据
                //     window.parent.postMessage({data:select_con},'*');
                // }else{
                //     // alert("不是机器人else")
                //     $("#changeyuzhi").append("<option value='"+iPresetID+"'>"+iPresetID+"</option>");
                //     $("#changeyuzhi option").each(function() {
                //         var option_con = $(this).val();
                //         if($("#changeyuzhi option:contains("+option_con+")").length > 1){
                //             // $("#changeyuzhi option:contains("+option_con+"):gt(0)").remove();
                //         }
                //         optionlist.push(option_con);
                //     });
                //     yuzhiweiVal = iPresetID;
                //     arrrobot.push(objrobot);
                //     console.log("iPresetID==",iPresetID,"optionlist==",optionlist,"yuzhiweiVal==",yuzhiweiVal);
                //     select_con = unique(optionlist);  //去重
                //     console.log(select_con,'select_con-----select_con')
                //     //给父页面传数据
                //     window.parent.postMessage({data:select_con},'*');
                // }
            },
            error: function (status, xmlDoc) {
                showOPInfo(oWndInfo.szDeviceIdentify + " 设置预置点失败！", status, xmlDoc);
            }
        });
    }
}

// function yuzhiChange(val){
// 	console.log(val,"选中的预置位");
// 	yuzhiweiVal = val;
// }
// 调用预置点
function clickGoPreset() {
    yuzhiweiVal = $("#presetID").val();
	console.log(yuzhiweiVal,'903-903-903');
    var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
        iPresetID = parseInt(yuzhiweiVal, 10);

    if (oWndInfo != null) {
        WebVideoCtrl.I_GoPreset(iPresetID, {
            success: function (xmlDoc) {
                showOPInfo(oWndInfo.szDeviceIdentify + " 调用预置点成功！");
            },
            error: function (status, xmlDoc) {
                showOPInfo(oWndInfo.szDeviceIdentify + " 调用预置点失败！", status, xmlDoc);
            }
        });
    }
}

// 搜索录像
var g_iSearchTimes = 0;
function clickRecordSearch(iType) {
    var szDeviceIdentify = $("#ip").val(),
        iChannelID = parseInt($("#channels").val(), 10),
        bZeroChannel = $("#channels option").eq($("#channels").get(0).selectedIndex).attr("bZero") == "true" ? true : false,
        iStreamType = parseInt($("#record_streamtype").val(), 10),
        szStartTime = $("#starttime").val(),
        szEndTime = $("#endtime").val();

    if (null == szDeviceIdentify) {
        return;
    }

    if (bZeroChannel) {// 零通道不支持录像搜索
        return;
    }

    if (0 == iType) {// 首次搜索
        $("#searchlist").empty();
        g_iSearchTimes = 0;
    }

    WebVideoCtrl.I_RecordSearch(szDeviceIdentify, iChannelID, szStartTime, szEndTime, {
        iStreamType: iStreamType,
        iSearchPos: g_iSearchTimes * 40,
        success: function (xmlDoc) {
            if ("MORE" === $(xmlDoc).find("responseStatusStrg").eq(0).text()) {
                
                for(var i = 0, nLen = $(xmlDoc).find("searchMatchItem").length; i < nLen; i++) {
                    var szPlaybackURI = $(xmlDoc).find("playbackURI").eq(i).text();
                    if(szPlaybackURI.indexOf("name=") < 0) {
                        break;
                    }
                    var szStartTime = $(xmlDoc).find("startTime").eq(i).text();
                    var szEndTime = $(xmlDoc).find("endTime").eq(i).text();
                    var szFileName = szPlaybackURI.substring(szPlaybackURI.indexOf("name=") + 5, szPlaybackURI.indexOf("&size="));

                    var objTr = $("#searchlist").get(0).insertRow(-1);
                    var objTd = objTr.insertCell(0);
                    objTd.id = "downloadTd" + i;
                    objTd.innerHTML = g_iSearchTimes * 40 + (i + 1);
                    objTd = objTr.insertCell(1);
                    objTd.width = "30%";
                    objTd.innerHTML = szFileName;
                    objTd = objTr.insertCell(2);
                    objTd.width = "30%";
                    objTd.innerHTML = (szStartTime.replace("T", " ")).replace("Z", "");
                    objTd = objTr.insertCell(3);
                    objTd.width = "30%";
                    objTd.innerHTML = (szEndTime.replace("T", " ")).replace("Z", "");
                    objTd = objTr.insertCell(4);
                    objTd.width = "10%";
                    objTd.innerHTML = "<a href='javascript:;' onclick='clickStartDownloadRecord(" + (i + g_iSearchTimes * 40) + ");'>下载</a>";
                    $("#downloadTd" + (i + g_iSearchTimes * 40)).data("fileName", szFileName);
                    $("#downloadTd" + (i + g_iSearchTimes * 40)).data("playbackURI", szPlaybackURI);
                }

                g_iSearchTimes++;
                clickRecordSearch(1);// 继续搜索
            } else if ("OK" === $(xmlDoc).find("responseStatusStrg").eq(0).text()) {
                var iLength = $(xmlDoc).find("searchMatchItem").length;
                for(var i = 0; i < iLength; i++) {
                    var szPlaybackURI = $(xmlDoc).find("playbackURI").eq(i).text();
                    if(szPlaybackURI.indexOf("name=") < 0) {
                        break;
                    }
                    var szStartTime = $(xmlDoc).find("startTime").eq(i).text();
                    var szEndTime = $(xmlDoc).find("endTime").eq(i).text();
                    var szFileName = szPlaybackURI.substring(szPlaybackURI.indexOf("name=") + 5, szPlaybackURI.indexOf("&size="));

                    var objTr = $("#searchlist").get(0).insertRow(-1);
                    var objTd = objTr.insertCell(0);
                    objTd.id = "downloadTd" + i;
                    objTd.innerHTML = g_iSearchTimes * 40 + (i + 1);
                    objTd = objTr.insertCell(1);
                    objTd.width = "30%";
                    objTd.innerHTML = szFileName;
                    objTd = objTr.insertCell(2);
                    objTd.width = "30%";
                    objTd.innerHTML = (szStartTime.replace("T", " ")).replace("Z", "");
                    objTd = objTr.insertCell(3);
                    objTd.width = "30%";
                    objTd.innerHTML = (szEndTime.replace("T", " ")).replace("Z", "");
                    objTd = objTr.insertCell(4);
                    objTd.width = "10%";
                    objTd.innerHTML = "<a href='javascript:;' onclick='clickStartDownloadRecord(" + (i + g_iSearchTimes * 40) + ");'>下载</a>";
                    $("#downloadTd" + (i + g_iSearchTimes * 40)).data("fileName", szFileName);
                    $("#downloadTd" + (i + g_iSearchTimes * 40)).data("playbackURI", szPlaybackURI);
                }
                showOPInfo(szDeviceIdentify + " 搜索录像文件成功！");
            } else if("NO MATCHES" === $(xmlDoc).find("responseStatusStrg").eq(0).text()) {
                setTimeout(function() {
                    showOPInfo(szDeviceIdentify + " 没有录像文件！");
                    alert("没有录像文件，请再次点击搜索");
                    // var szDeviceIdentify = window.top.sessionStorage.getItem("nvrip")+'_80',
                    var szIPs = nvrcameraip,
                        szPorts = "80",
                        szUsername = $("#username").val(),
                        szPassword = $("#password").val();
                    
                    if ("" == szIPs || "" == szPorts) {
                        return;
                    }
                    
                    var szDeviceIdentifys = szIPs + "_" + szPorts;
                    
                    var iRet = WebVideoCtrl.I_Login(szIPs, 1, szPorts, szUsername, szPassword, {
                        success: function (xmlDoc) {            
                            var szDeviceIdentify = szDeviceIdentifys
                            showOPInfo(szDeviceIdentify + " 登录成功！---------21");
                            console.log(szDeviceIdentify + " 登录成功！-----")
                            $("#ip").prepend("<option value='" + szDeviceIdentify + "'>" + szDeviceIdentify + "</option>");
                            setTimeout(function () {
                                $("#ip").val(szDeviceIdentify);
                                getChannelInfo();
                                getDevicePort();
                            }, 10);
                        },
                        error: function (status, xmlDoc) {
                            showOPInfo(szDeviceIdentify + " 登录失败！1571", status, xmlDoc);
                        }
                    });
                    
                    if (-1 == iRet) {
                        showOPInfo(szDeviceIdentify + " 已登录过！");
                    }

                    var szDeviceIdentify = $("#ip").val(),
                        iChannelID = 2,
                        bZeroChannel = $("#channels option").eq($("#channels").get(0).selectedIndex).attr("bZero") == "true" ? true : false,
                        iStreamType = parseInt($("#record_streamtype").val(), 10),
                        szStartTime = $("#starttime").val(),
                        szEndTime = $("#endtime").val();
                
                    console.log(szDeviceIdentify,iChannelID,bZeroChannel,iStreamType,'---------903');
                
                    if (null == szDeviceIdentify) {
                        return;
                    }
                
                    if (bZeroChannel) {// 零通道不支持录像搜索
                        return;
                    }
                
                    if (0 == iType) {// 首次搜索
                        $("#searchlist").empty();
                        g_iSearchTimes = 0;
                    }
                    
                    WebVideoCtrl.I_RecordSearch(szDeviceIdentify, iChannelID, szStartTime, szEndTime, {
                        iStreamType: iStreamType,
                        iSearchPos: g_iSearchTimes * 40,
                        success: function (xmlDoc) {
                            console.log(xmlDoc);
                            if ("MORE" === $(xmlDoc).find("responseStatusStrg").eq(0).text()) {
                                
                                for(var i = 0, nLen = $(xmlDoc).find("searchMatchItem").length; i < nLen; i++) {
                                    var szPlaybackURI = $(xmlDoc).find("playbackURI").eq(i).text();
                                    if(szPlaybackURI.indexOf("name=") < 0) {
                                        break;
                                    }
                                    var szStartTime = $(xmlDoc).find("startTime").eq(i).text();
                                    var szEndTime = $(xmlDoc).find("endTime").eq(i).text();
                                    var szFileName = szPlaybackURI.substring(szPlaybackURI.indexOf("name=") + 5, szPlaybackURI.indexOf("&size="));
                
                                    var objTr = $("#searchlist").get(0).insertRow(-1);
                                    var objTd = objTr.insertCell(0);
                                    objTd.id = "downloadTd" + i;
                                    objTd.innerHTML = g_iSearchTimes * 40 + (i + 1);
                                    objTd = objTr.insertCell(1);
                                    objTd.width = "30%";
                                    objTd.innerHTML = szFileName;
                                    objTd = objTr.insertCell(2);
                                    objTd.width = "30%";
                                    objTd.innerHTML = (szStartTime.replace("T", " ")).replace("Z", "");
                                    objTd = objTr.insertCell(3);
                                    objTd.width = "30%";
                                    objTd.innerHTML = (szEndTime.replace("T", " ")).replace("Z", "");
                                    objTd = objTr.insertCell(4);
                                    objTd.width = "10%";
                                    objTd.innerHTML = "<a href='javascript:;' onclick='clickStartDownloadRecord(" + (i + g_iSearchTimes * 40) + ");'>下载</a>";
                                    $("#downloadTd" + (i + g_iSearchTimes * 40)).data("fileName", szFileName);
                                    $("#downloadTd" + (i + g_iSearchTimes * 40)).data("playbackURI", szPlaybackURI);
                                }
                                showOPInfo(szDeviceIdentify + " 有没有录像文件！");
                                g_iSearchTimes++;
                                clickRecordSearch(1);// 继续搜索
                            } else if ("OK" === $(xmlDoc).find("responseStatusStrg").eq(0).text()) {
                                var iLength = $(xmlDoc).find("searchMatchItem").length;
                                for(var i = 0; i < iLength; i++) {
                                    var szPlaybackURI = $(xmlDoc).find("playbackURI").eq(i).text();
                                    if(szPlaybackURI.indexOf("name=") < 0) {
                                        break;
                                    }
                                    var szStartTime = $(xmlDoc).find("startTime").eq(i).text();
                                    var szEndTime = $(xmlDoc).find("endTime").eq(i).text();
                                    var szFileName = szPlaybackURI.substring(szPlaybackURI.indexOf("name=") + 5, szPlaybackURI.indexOf("&size="));

                                    var objTr = $("#searchlist").get(0).insertRow(-1);
                                    var objTd = objTr.insertCell(0);
                                    objTd.id = "downloadTd" + i;
                                    objTd.innerHTML = g_iSearchTimes * 40 + (i + 1);
                                    objTd = objTr.insertCell(1);
                                    objTd.width = "30%";
                                    objTd.innerHTML = szFileName;
                                    objTd = objTr.insertCell(2);
                                    objTd.width = "30%";
                                    objTd.innerHTML = (szStartTime.replace("T", " ")).replace("Z", "");
                                    objTd = objTr.insertCell(3);
                                    objTd.width = "30%";
                                    objTd.innerHTML = (szEndTime.replace("T", " ")).replace("Z", "");
                                    objTd = objTr.insertCell(4);
                                    objTd.width = "10%";
                                    objTd.innerHTML = "<a href='javascript:;' onclick='clickStartDownloadRecord(" + (i + g_iSearchTimes * 40) + ");'>下载</a>";
                                    $("#downloadTd" + (i + g_iSearchTimes * 40)).data("fileName", szFileName);
                                    $("#downloadTd" + (i + g_iSearchTimes * 40)).data("playbackURI", szPlaybackURI);
                                }
                                showOPInfo(szDeviceIdentify + " 搜索录像文件成功！");
                            }
                        },
                    })
                }, 50);
            }
        },
        error: function (status, xmlDoc) {
            showOPInfo(szDeviceIdentify + " 搜索录像文件失败！", status, xmlDoc);
            // var szDeviceIdentify = window.top.sessionStorage.getItem("nvrip")+'_80',
            // iChannelID = parseInt($("#channels").val(), 10),
            // // bZeroChannel = $("#channels option").eq($("#channels").get(0).selectedIndex).attr("bZero") == "true" ? true : false,
            // iStreamType = parseInt($("#record_streamtype").val(), 10),
            // szStartTime = $("#starttime").val(),
            // szEndTime = $("#endtime").val();
            // WebVideoCtrl.I_RecordSearch(szDeviceIdentify, iChannelID, szStartTime, szEndTime, {
            //     iStreamType: iStreamType,
            //     iSearchPos: g_iSearchTimes * 40,
            //     success: function (xmlDoc) {
            //         if ("MORE" === $(xmlDoc).find("responseStatusStrg").eq(0).text()) {
                        
            //             for(var i = 0, nLen = $(xmlDoc).find("searchMatchItem").length; i < nLen; i++) {
            //                 var szPlaybackURI = $(xmlDoc).find("playbackURI").eq(i).text();
            //                 if(szPlaybackURI.indexOf("name=") < 0) {
            //                     break;
            //                 }
            //                 var szStartTime = $(xmlDoc).find("startTime").eq(i).text();
            //                 var szEndTime = $(xmlDoc).find("endTime").eq(i).text();
            //                 var szFileName = szPlaybackURI.substring(szPlaybackURI.indexOf("name=") + 5, szPlaybackURI.indexOf("&size="));
        
            //                 var objTr = $("#searchlist").get(0).insertRow(-1);
            //                 var objTd = objTr.insertCell(0);
            //                 objTd.id = "downloadTd" + i;
            //                 objTd.innerHTML = g_iSearchTimes * 40 + (i + 1);
            //                 objTd = objTr.insertCell(1);
            //                 objTd.width = "30%";
            //                 objTd.innerHTML = szFileName;
            //                 objTd = objTr.insertCell(2);
            //                 objTd.width = "30%";
            //                 objTd.innerHTML = (szStartTime.replace("T", " ")).replace("Z", "");
            //                 objTd = objTr.insertCell(3);
            //                 objTd.width = "30%";
            //                 objTd.innerHTML = (szEndTime.replace("T", " ")).replace("Z", "");
            //                 objTd = objTr.insertCell(4);
            //                 objTd.width = "10%";
            //                 objTd.innerHTML = "<a href='javascript:;' onclick='clickStartDownloadRecord(" + (i + g_iSearchTimes * 40) + ");'>下载</a>";
            //                 $("#downloadTd" + (i + g_iSearchTimes * 40)).data("fileName", szFileName);
            //                 $("#downloadTd" + (i + g_iSearchTimes * 40)).data("playbackURI", szPlaybackURI);
            //             }
            //         }
            //     }
            // })
        }
    });
}

// 开始回放
function clickStartPlayback() {
    var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
        szDeviceIdentify = $("#ip").val(),
        iRtspPort = parseInt($("#rtspport").val(), 10),
        iStreamType = parseInt($("#record_streamtype").val(), 10),
        bZeroChannel = $("#channels option").eq($("#channels").get(0).selectedIndex).attr("bZero") == "true" ? true : false,
        iChannelID = parseInt($("#channels").val(), 10),
        szStartTime = $("#starttime").val(),
        szEndTime = $("#endtime").val(),
        szInfo = "",
        bChecked = $("#transstream").prop("checked"),
        iRet = -1;

    if (null == szDeviceIdentify) {
        return;
    }

    if (bZeroChannel) {// 零通道不支持回放
        return;
    }

    var startPlayback = function () {
        if (bChecked) {// 启用转码回放
            var oTransCodeParam = {
                TransFrameRate: "14",// 0：全帧率，5：1，6：2，7：4，8：6，9：8，10：10，11：12，12：16，14：15，15：18，13：20，16：22
                TransResolution: "1",// 255：Auto，3：4CIF，2：QCIF，1：CIF
                TransBitrate: "19"// 2：32K，3：48K，4：64K，5：80K，6：96K，7：128K，8：160K，9：192K，10：224K，11：256K，12：320K，13：384K，14：448K，15：512K，16：640K，17：768K，18：896K，19：1024K，20：1280K，21：1536K，22：1792K，23：2048K，24：3072K，25：4096K，26：8192K
            };
            WebVideoCtrl.I_StartPlayback(szDeviceIdentify, {
                iRtspPort: iRtspPort,
                iStreamType: iStreamType,
                iChannelID: iChannelID,
                szStartTime: szStartTime,
                szEndTime: szEndTime,
                oTransCodeParam: oTransCodeParam,
                success: function () {
                    szInfo = "开始回放成功！";
                    showOPInfo(szDeviceIdentify + " " + szInfo);
                },
                error: function (status, xmlDoc) {
                    if (403 === status) {
                        szInfo = "设备不支持Websocket取流！";
                    } else {
                        szInfo = "开始回放失败！";
                    }
                    showOPInfo(szDeviceIdentify + " " + szInfo);
                }
            });
        } else {
            WebVideoCtrl.I_StartPlayback(szDeviceIdentify, {
                iRtspPort: iRtspPort,
                iStreamType: iStreamType,
                iChannelID: iChannelID,
                szStartTime: szStartTime,
                szEndTime: szEndTime,
                success: function () {
                    szInfo = "开始回放成功！";
                    showOPInfo(szDeviceIdentify + " " + szInfo);
                },
                error: function (status, xmlDoc) {
                    if (403 === status) {
                        szInfo = "设备不支持Websocket取流！";
                    } else {
                        szInfo = "开始回放失败！";
                    }
                    showOPInfo(szDeviceIdentify + " " + szInfo);
                }
            });
        }
    };

    if (oWndInfo != null) {// 已经在播放了，先停止
        WebVideoCtrl.I_Stop({
            success: function () {
                startPlayback();
            }
        });
    } else {
        startPlayback();
    }
}

// 停止回放
function clickStopPlayback() {
    var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
        szInfo = "";

    if (oWndInfo != null) {
        WebVideoCtrl.I_Stop({
            success: function () {
                szInfo = "停止回放成功！";
                showOPInfo(oWndInfo.szDeviceIdentify + " " + szInfo);
            },
            error: function () {
                szInfo = "停止回放失败！";
                showOPInfo(oWndInfo.szDeviceIdentify + " " + szInfo);
            }
        });
    }
}

// 开始倒放
function clickReversePlayback() {
    var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
        szDeviceIdentify = $("#ip").val(),
        iRtspPort = parseInt($("#rtspport").val(), 10),
        iStreamType = parseInt($("#record_streamtype").val(), 10),
        bZeroChannel = $("#channels option").eq($("#channels").get(0).selectedIndex).attr("bZero") == "true" ? true : false,
        iChannelID = parseInt($("#channels").val(), 10),
        szStartTime = $("#starttime").val(),
        szEndTime = $("#endtime").val(),
        szInfo = "";

    if (null == szDeviceIdentify) {
        return;
    }

    if (bZeroChannel) {// 零通道不支持倒放
        return;
    }

    var reversePlayback = function () {
        var iRet = WebVideoCtrl.I_ReversePlayback(szDeviceIdentify, {
            iRtspPort: iRtspPort,
            iStreamType: iStreamType,
            iChannelID: iChannelID,
            szStartTime: szStartTime,
            szEndTime: szEndTime
        });

        if (0 == iRet) {
            szInfo = "开始倒放成功！";
        } else {
            szInfo = "开始倒放失败！";
        }
        showOPInfo(szDeviceIdentify + " " + szInfo);
    };

    if (oWndInfo != null) {// 已经在播放了，先停止
        WebVideoCtrl.I_Stop({
            success: function () {
                reversePlayback();
            }
        });
    } else {
        reversePlayback();
    }
}

// 单帧
function clickFrame() {
    var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
        szInfo = "";

    if (oWndInfo != null) {
        WebVideoCtrl.I_Frame({
            success: function () {
                szInfo = "单帧播放成功！";
                showOPInfo(oWndInfo.szDeviceIdentify + " " + szInfo);
            },
            error: function () {
                szInfo = "单帧播放失败！";
                showOPInfo(oWndInfo.szDeviceIdentify + " " + szInfo);
            }
        });
    }
}

// 暂停
function clickPause() {
    var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
        szInfo = "";

    if (oWndInfo != null) {
        WebVideoCtrl.I_Pause({
            success: function () {
                szInfo = "暂停成功！";
                showOPInfo(oWndInfo.szDeviceIdentify + " " + szInfo);
            },
            error: function () {
                szInfo = "暂停失败！";
                showOPInfo(oWndInfo.szDeviceIdentify + " " + szInfo);
            }
        });
    }
}

// 恢复
function clickResume() {
    var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
        szInfo = "";

    if (oWndInfo != null) {
        WebVideoCtrl.I_Resume({
            success: function () {
                szInfo = "恢复成功！";
                showOPInfo(oWndInfo.szDeviceIdentify + " " + szInfo);
            },
            error: function () {
                szInfo = "恢复失败！";
                showOPInfo(oWndInfo.szDeviceIdentify + " " + szInfo);
            }
        });
    }
}

// 慢放
function clickPlaySlow() {
    var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
        szInfo = "";

    if (oWndInfo != null) {
        WebVideoCtrl.I_PlaySlow({
            success: function () {
                szInfo = "慢放成功！";
                showOPInfo(oWndInfo.szDeviceIdentify + " " + szInfo);
            },
            error: function () {
                szInfo = "慢放失败！";
                showOPInfo(oWndInfo.szDeviceIdentify + " " + szInfo);
            }
        });
    }
}

// 快放
function clickPlayFast() {
    var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
        szInfo = "";

    if (oWndInfo != null) {
        WebVideoCtrl.I_PlayFast({
            success: function () {
                szInfo = "快放成功！";
                showOPInfo(oWndInfo.szDeviceIdentify + " " + szInfo);
            },
            error: function () {
                szInfo = "快放失败！";
                showOPInfo(oWndInfo.szDeviceIdentify + " " + szInfo);
            }
        });
    }
}

// OSD时间
function clickGetOSDTime() {
    var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);
    
    if (oWndInfo != null) {
        var szTime = WebVideoCtrl.I_GetOSDTime({
            success: function (szOSDTime) {
                $("#osdtime").val(szOSDTime);
                showOPInfo(oWndInfo.szDeviceIdentify + " 获取OSD时间成功！");
            },
            error: function () {
                showOPInfo(oWndInfo.szDeviceIdentify + " 获取OSD时间失败！");
            }
        });
    }
}

// 下载录像
var g_iDownloadID = -1;
var g_tDownloadProcess = 0;
function clickStartDownloadRecord(i) {
    var szDeviceIdentify = $("#ip").val(),
        szChannelID = $("#channels").val(),
        szFileName = $("#downloadTd" + i).data("fileName"),
        szPlaybackURI = $("#downloadTd" + i).data("playbackURI");

    if (null == szDeviceIdentify) {
        return;
    }

    g_iDownloadID = WebVideoCtrl.I_StartDownloadRecord(szDeviceIdentify, szPlaybackURI, szFileName, {
        bDateDir: true  //是否生成日期文件
    });

    if (g_iDownloadID < 0) {
        var iErrorValue = WebVideoCtrl.I_GetLastError();
        if (34 == iErrorValue) {
            showOPInfo(szDeviceIdentify + " 已下载！");
        } else if (33 == iErrorValue) {
            showOPInfo(szDeviceIdentify + " 空间不足！");
        } else {
            showOPInfo(szDeviceIdentify + " 下载失败！");
        }
    } else {
        $("<div id='downProcess' class='freeze'></div>").appendTo("body");
        g_tDownloadProcess = setInterval("downProcess(" + i + ")", 1000);
    }
}
// 下载进度
function downProcess() {
    var iStatus = WebVideoCtrl.I_GetDownloadStatus(g_iDownloadID);
    if (0 == iStatus) {
        $("#downProcess").css({
            width: $("#searchlist").width() + "px",
            height: "100px",
            lineHeight: "100px",
            left: $("#searchdiv").offset().left + "px",
            top: $("#searchdiv").offset().top + "px"
        });
        var iProcess = WebVideoCtrl.I_GetDownloadProgress(g_iDownloadID);
        if (iProcess < 0) {
            clearInterval(g_tDownloadProcess);
            g_tDownloadProcess = 0;
            g_iDownloadID = -1;
        } else if (iProcess < 100) {
            $("#downProcess").text(iProcess + "%");
        } else {
            $("#downProcess").text("100%");
            setTimeout(function () {
                $("#downProcess").remove();
            }, 1000);

            WebVideoCtrl.I_StopDownloadRecord(g_iDownloadID);

            showOPInfo("录像下载完成！");
            clearInterval(g_tDownloadProcess);
            g_tDownloadProcess = 0;
            g_iDownloadID = -1;
        }
    } else {
        WebVideoCtrl.I_StopDownloadRecord(g_iDownloadID);

        clearInterval(g_tDownloadProcess);
        g_tDownloadProcess = 0;
        g_iDownloadID = -1;
    }
}

// 导出配置文件
function clickExportDeviceConfig() {
    var szDeviceIdentify = $("#ip").val(),
        szInfo = "";

    if (null == szDeviceIdentify) {
        return;
    }

    var iRet = WebVideoCtrl.I_ExportDeviceConfig(szDeviceIdentify);

    if (0 == iRet) {
        szInfo = "导出配置文件成功！";
    } else {
        szInfo = "导出配置文件失败！";
    }
    showOPInfo(szDeviceIdentify + " " + szInfo);
}

// 导入配置文件
function clickImportDeviceConfig() {
    var szDeviceIdentify = $("#ip").val(),
        szFileName = $("#configFile").val();

    if (null == szDeviceIdentify) {
        return;
    }

    if ("" == szFileName) {
        alert("请选择配置文件！");
        return;
    }

    var iRet = WebVideoCtrl.I_ImportDeviceConfig(szDeviceIdentify, szFileName);

    if (0 == iRet) {
        WebVideoCtrl.I_Restart(szDeviceIdentify, {
            success: function (xmlDoc) {
                $("<div id='restartDiv' class='freeze'>重启中...</div>").appendTo("body");
                var oSize = getWindowSize();
                $("#restartDiv").css({
                    width: oSize.width + "px",
                    height: oSize.height + "px",
                    lineHeight: oSize.height + "px",
                    left: 0,
                    top: 0
                });
                setTimeout("reconnect('" + szDeviceIdentify + "')", 20000);
            },
            error: function (status, xmlDoc) {
                showOPInfo(szDeviceIdentify + " 重启失败！", status, xmlDoc);
            }
        });
    } else {
        showOPInfo(szDeviceIdentify + " 导入失败！");
    }
}

// 重连
function reconnect(szDeviceIdentify) {
    WebVideoCtrl.I_Reconnect(szDeviceIdentify, {
        success: function (xmlDoc) {
            $("#restartDiv").remove();
        },
        error: function (status, xmlDoc) {
            if (401 == status) {// 无插件方案，重启后session已失效，程序执行登出，从已登录设备中删除
                $("#restartDiv").remove();
                clickLogout();
            } else {
                setTimeout(function () {reconnect(szDeviceIdentify);}, 5000);
            }
        }
    });
}

// 开始升级
var g_tUpgrade = 0;
function clickStartUpgrade(szDeviceIdentify) {
    var szDeviceIdentify = $("#ip").val(),
        szFileName = $("#upgradeFile").val();

    if (null == szDeviceIdentify) {
        return;
    }

    if ("" == szFileName) {
        alert("请选择升级文件！");
        return;
    }

    var iRet = WebVideoCtrl.I_StartUpgrade(szDeviceIdentify, szFileName);
    if (0 == iRet) {
        g_tUpgrade = setInterval("getUpgradeStatus('" + szDeviceIdentify + "')", 1000);
    } else {
        showOPInfo(szDeviceIdentify + " 升级失败！");
    }
}

// 获取升级状态
function getUpgradeStatus(szDeviceIdentify) {
    var iStatus = WebVideoCtrl.I_UpgradeStatus();
    if (iStatus == 0) {
        var iProcess = WebVideoCtrl.I_UpgradeProgress();
        if (iProcess < 0) {
            clearInterval(g_tUpgrade);
            g_tUpgrade = 0;
            showOPInfo(szDeviceIdentify + " 获取进度失败！");
            return;
        } else if (iProcess < 100) {
            if (0 == $("#restartDiv").length) {
                $("<div id='restartDiv' class='freeze'></div>").appendTo("body");
                var oSize = getWindowSize();
                $("#restartDiv").css({
                    width: oSize.width + "px",
                    height: oSize.height + "px",
                    lineHeight: oSize.height + "px",
                    left: 0,
                    top: 0
                });
            }
            $("#restartDiv").text(iProcess + "%");
        } else {
            WebVideoCtrl.I_StopUpgrade();
            clearInterval(g_tUpgrade);
            g_tUpgrade = 0;

            $("#restartDiv").remove();

            WebVideoCtrl.I_Restart(szDeviceIdentify, {
                success: function (xmlDoc) {
                    $("<div id='restartDiv' class='freeze'>重启中...</div>").appendTo("body");
                    var oSize = getWindowSize();
                    $("#restartDiv").css({
                        width: oSize.width + "px",
                        height: oSize.height + "px",
                        lineHeight: oSize.height + "px",
                        left: 0,
                        top: 0
                    });
                    setTimeout("reconnect('" + szDeviceIdentify + "')", 20000);
                },
                error: function (status, xmlDoc) {
                    showOPInfo(szDeviceIdentify + " 重启失败！", status, xmlDoc);
                }
            });
        }
    } else if (iStatus == 1) {
        WebVideoCtrl.I_StopUpgrade();
        showOPInfo(szDeviceIdentify + " 升级失败！");
        clearInterval(g_tUpgrade);
        g_tUpgrade = 0;
    } else if (iStatus == 2) {
        mWebVideoCtrl.I_StopUpgrade();
        showOPInfo(szDeviceIdentify + " 语言不匹配！");
        clearInterval(g_tUpgrade);
        g_tUpgrade = 0;
    } else {
        mWebVideoCtrl.I_StopUpgrade();
        showOPInfo(szDeviceIdentify + " 获取状态失败！");
        clearInterval(g_tUpgrade);
        g_tUpgrade = 0;
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

// 远程配置库
function clickRemoteConfig() {
    var szDeviceIdentify = $("#ip").val(),
        iDevicePort = parseInt($("#deviceport").val(), 10) || "",
        szInfo = "";
    
    if (null == szDeviceIdentify) {
        return;
    }

    var iRet = WebVideoCtrl.I_RemoteConfig(szDeviceIdentify, {
        iDevicePort: iDevicePort,
        iLan: 1
    });

    if (-1 == iRet) {
        szInfo = "调用远程配置库失败！";
    } else {
        szInfo = "调用远程配置库成功！";
    }
    showOPInfo(szDeviceIdentify + " " + szInfo);
}

function clickRestoreDefault() {
    var szDeviceIdentify = $("#ip").val(),
        szMode = "basic";
    WebVideoCtrl.I_RestoreDefault(szDeviceIdentify, szMode, {
        timeout: 30000,
        success: function (xmlDoc) {
            $("#restartDiv").remove();
            showOPInfo(szDeviceIdentify + " 恢复默认参数成功！");
            //恢复完成后需要重启
            WebVideoCtrl.I_Restart(szDeviceIdentify, {
                success: function (xmlDoc) {
                    $("<div id='restartDiv' class='freeze'>重启中...</div>").appendTo("body");
                    var oSize = getWindowSize();
                    $("#restartDiv").css({
                        width: oSize.width + "px",
                        height: oSize.height + "px",
                        lineHeight: oSize.height + "px",
                        left: 0,
                        top: 0
                    });
                    setTimeout("reconnect('" + szDeviceIdentify + "')", 20000);
                },
                error: function (status, xmlDoc) {
                    showOPInfo(szDeviceIdentify + " 重启失败！", status, xmlDoc);
                }
            });
        },
        error: function (status, xmlDoc) {
            showOPInfo(szDeviceIdentify + " 恢复默认参数失败！", status, xmlDoc);
        }
    });
}

function PTZZoomIn() {
    var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

    if (oWndInfo != null) {
        WebVideoCtrl.I_PTZControl(10, false, {
            iWndIndex: g_iWndIndex,
            success: function (xmlDoc) {
                showOPInfo(oWndInfo.szDeviceIdentify + " 调焦+成功！");
            },
            error: function (status, xmlDoc) {
                showOPInfo(oWndInfo.szDeviceIdentify + "  调焦+失败！", status, xmlDoc);
            }
        });
    }
}

function PTZZoomout() {
    var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

    if (oWndInfo != null) {
        WebVideoCtrl.I_PTZControl(11, false, {
            iWndIndex: g_iWndIndex,
            success: function (xmlDoc) {
                showOPInfo(oWndInfo.szDeviceIdentify + " 调焦-成功！");
            },
            error: function (status, xmlDoc) {
                showOPInfo(oWndInfo.szDeviceIdentify + "  调焦-失败！", status, xmlDoc);
            }
        });
    }
}

function PTZZoomStop() {
    var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

    if (oWndInfo != null) {
        WebVideoCtrl.I_PTZControl(11, true, {
            iWndIndex: g_iWndIndex,
            success: function (xmlDoc) {
                showOPInfo(oWndInfo.szDeviceIdentify + " 调焦停止成功！");
            },
            error: function (status, xmlDoc) {
                showOPInfo(oWndInfo.szDeviceIdentify + "  调焦停止失败！", status, xmlDoc);
            }
        });
    }
}

function PTZFocusIn() {
    var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

    if (oWndInfo != null) {
        WebVideoCtrl.I_PTZControl(12, false, {
            iWndIndex: g_iWndIndex,
            success: function (xmlDoc) {
                showOPInfo(oWndInfo.szDeviceIdentify + " 聚焦+成功！");
            },
            error: function (status, xmlDoc) {
                showOPInfo(oWndInfo.szDeviceIdentify + "  聚焦+失败！", status, xmlDoc);
            }
        });
    }
}

function PTZFoucusOut() {
    var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

    if (oWndInfo != null) {
        WebVideoCtrl.I_PTZControl(13, false, {
            iWndIndex: g_iWndIndex,
            success: function (xmlDoc) {
                showOPInfo(oWndInfo.szDeviceIdentify + " 聚焦-成功！");
            },
            error: function (status, xmlDoc) {
                showOPInfo(oWndInfo.szDeviceIdentify + "  聚焦-失败！", status, xmlDoc);
            }
        });
    }
}

function PTZFoucusStop() {
    var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

    if (oWndInfo != null) {
        WebVideoCtrl.I_PTZControl(12, true, {
            iWndIndex: g_iWndIndex,
            success: function (xmlDoc) {
                showOPInfo(oWndInfo.szDeviceIdentify + " 聚焦停止成功！");
            },
            error: function (status, xmlDoc) {
                showOPInfo(oWndInfo.szDeviceIdentify + "  聚焦停止失败！", status, xmlDoc);
            }
        });
    }
}

function PTZIrisIn() {
    var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

    if (oWndInfo != null) {
        WebVideoCtrl.I_PTZControl(14, false, {
            iWndIndex: g_iWndIndex,
            success: function (xmlDoc) {
                showOPInfo(oWndInfo.szDeviceIdentify + " 光圈+成功！");
            },
            error: function (status, xmlDoc) {
                showOPInfo(oWndInfo.szDeviceIdentify + "  光圈+失败！", status, xmlDoc);
            }
        });
    }
}

function PTZIrisOut() {
    var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

    if (oWndInfo != null) {
        WebVideoCtrl.I_PTZControl(15, false, {
            iWndIndex: g_iWndIndex,
            success: function (xmlDoc) {
                showOPInfo(oWndInfo.szDeviceIdentify + " 光圈-成功！");
            },
            error: function (status, xmlDoc) {
                showOPInfo(oWndInfo.szDeviceIdentify + "  光圈-失败！", status, xmlDoc);
            }
        });
    }
}

function PTZIrisStop() {
    var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

    if (oWndInfo != null) {
        WebVideoCtrl.I_PTZControl(14, true, {
            iWndIndex: g_iWndIndex,
            success: function (xmlDoc) {
                showOPInfo(oWndInfo.szDeviceIdentify + " 光圈停止成功！");
            },
            error: function (status, xmlDoc) {
                showOPInfo(oWndInfo.szDeviceIdentify + "  光圈停止失败！", status, xmlDoc);
            }
        });
    }
}

// 切换模式
function changeIPMode(iType) {
    var arrPort = [0, 7071, 80];

    $("#serverport").val(arrPort[iType]);
}

// 获取设备IP
function clickGetDeviceIP() {
    var iDeviceMode = parseInt($("#devicemode").val(), 10),
        szAddress = $("#serveraddress").val(),
        iPort = parseInt($("#serverport").val(), 10) || 0,
        szDeviceID = $("#deviceid").val(),
        szDeviceInfo = "";

    szDeviceInfo = WebVideoCtrl.I_GetIPInfoByMode(iDeviceMode, szAddress, iPort, szDeviceID);

    if ("" == szDeviceInfo) {
        showOPInfo("设备IP和端口解析失败！");
    } else {
        showOPInfo("设备IP和端口解析成功！");

        var arrTemp = szDeviceInfo.split("-");
        $("#loginip").val(arrTemp[0]);
        $("#deviceport").val(arrTemp[1]);
    }
}

// 启用多边形绘制
var g_bEnableDraw = false;
function clickEnableDraw() {
    var iRet = WebVideoCtrl.I_SetPlayModeType(6);// 多边形模式

    if (0 === iRet) {
        g_bEnableDraw = true;

        showOPInfo("启用绘制成功！");
    } else {
        showOPInfo("启用绘制失败！");
    }
}

// 禁用多边形绘制
function clickDisableDraw() {
    var iRet = WebVideoCtrl.I_SetPlayModeType(0);// 预览模式
    if (0 === iRet) {
        g_bEnableDraw = false;
        
        showOPInfo("禁用绘制成功！");
    } else {
        showOPInfo("禁用绘制失败！");
    }
}

// 添加图形
function clickAddSnapPolygon() {
    if (!g_bEnableDraw) {
        return;
    }

    var szId = $("#snapId").val();
    var szName = encodeString($("#snapName").val());

    var szInfo = "<?xml version='1.0' encoding='utf-8'?>";
    szInfo += "<SnapPolygonList>";
    szInfo += "<SnapPolygon>";
    szInfo += "<id>" + szId + "</id>";          // [1, 32]
    szInfo += "<polygonType>1</polygonType>";
    szInfo += "<PointNumMax>17</PointNumMax>";  // [MinClosed, 17]
    szInfo += "<MinClosed>4</MinClosed>";       // [4, 17]
    szInfo += "<tips>#" + szId + "#" + szName + "</tips>";
    szInfo += "<isClosed>false</isClosed>";
    szInfo += "<color><r>0</r><g>255</g><b>0</b></color>";
    szInfo += "<pointList/>";
    szInfo += "</SnapPolygon>";
    szInfo += "</SnapPolygonList>";

    var iRet = WebVideoCtrl.I_SetSnapPolygonInfo(g_iWndIndex, szInfo);
    if (0 === iRet) {
        showOPInfo("窗口" + g_iWndIndex + "添加图形成功！");
    } else if (-1 === iRet) {
        showOPInfo("窗口" + g_iWndIndex + "添加图形失败！");
    } else if (-2 === iRet) {
        alert("参数错误！");
    } else if (-3 === iRet) {
        alert("图形个数达到上限！");
    } else if (-4 === iRet) {
        alert("图形ID已存在！");
    }
    WebVideoCtrl.I_SetSnapDrawMode(g_iWndIndex, 2);
}

// 删除图形
function clickDelSnapPolygon() {
    if (!g_bEnableDraw) {
        return;
    }

    var szId = $("#snapId").val();

    var iIndex = getSnapPolygon(szId);
    if (iIndex != -1) {
        var oXML = getSnapPolygon();
        $(oXML).find("SnapPolygon").eq(iIndex).remove();

        var szInfo = toXMLStr(oXML);

        WebVideoCtrl.I_ClearSnapInfo(g_iWndIndex);
        WebVideoCtrl.I_SetSnapPolygonInfo(g_iWndIndex, szInfo);
        WebVideoCtrl.I_SetSnapDrawMode(g_iWndIndex, 3);
     } else {
        alert("图形ID不存在！");
    }
}

// 编辑图形
function clickEditSnapPolygon() {
    if (!g_bEnableDraw) {
        return;
    }

    var iRet = WebVideoCtrl.I_SetSnapDrawMode(g_iWndIndex, 3);
    if (0 === iRet) {
        showOPInfo("窗口" + g_iWndIndex + "编辑图形成功！");
    } else {
        showOPInfo("窗口" + g_iWndIndex + "编辑图形失败！");
    }
}

// 停止编辑
function clickStopSnapPolygon() {
    if (!g_bEnableDraw) {
        return;
    }

    var iRet = WebVideoCtrl.I_SetSnapDrawMode(g_iWndIndex, -1);
    if (0 === iRet) {
        showOPInfo("窗口" + g_iWndIndex + "停止编辑成功！");
    } else {
        showOPInfo("窗口" + g_iWndIndex + "停止编辑失败！");
    }
}

function getSnapPolygon(szId) {
    var szInfo = WebVideoCtrl.I_GetSnapPolygonInfo(g_iWndIndex);
    var oXML = loadXML(szInfo);

    if (typeof szId === "undefined") {
        return oXML;
    } else {
        var iIndex = -1;

        var aNodeList = $(oXML).find("SnapPolygon");
        if (aNodeList.length > 0) {
            $.each(aNodeList, function (i) {
                if ($(this).find("id").text() === szId) {
                    iIndex = i;
                    return false;
                }
            });
        }

        return iIndex;
    }
}

// 获取图形，保存到自己数据库中
function clickGetSnapPolygon() {
    if (!g_bEnableDraw) {
        return;
    }

    var szInfo = WebVideoCtrl.I_GetSnapPolygonInfo(g_iWndIndex);

    alert(szInfo);
}

// 设置图形，页面打开时可以设置以前设置过的图形
function clickSetSnapPolygon() {
    if (!g_bEnableDraw) {
        return;
    }

    WebVideoCtrl.I_ClearSnapInfo(g_iWndIndex);

    var szInfo = "<?xml version='1.0' encoding='utf-8'?>";
    szInfo += "<SnapPolygonList>";
    szInfo += "<SnapPolygon>";
    szInfo += "<id>1</id>";
    szInfo += "<polygonType>1</polygonType>";
    szInfo += "<tips>#1#设置1</tips>";
    szInfo += "<isClosed>true</isClosed>";
    szInfo += "<color><r>0</r><g>255</g><b>0</b></color>";
    szInfo += "<pointList>";
    szInfo += "<point><x>0.737903</x><y>0.229730</y></point>";
    szInfo += "<point><x>0.947581</x><y>0.804054</y></point>";
    szInfo += "<point><x>0.362903</x><y>0.777027</y></point>";
    szInfo += "</pointList>";
    szInfo += "</SnapPolygon>";
    szInfo += "<SnapPolygon>";
    szInfo += "<id>2</id>";
    szInfo += "<polygonType>1</polygonType>";
    szInfo += "<tips>#2#设置2</tips>";
    szInfo += "<isClosed>true</isClosed>";
    szInfo += "<color><r>0</r><g>255</g><b>0</b></color>";
    szInfo += "<pointList>";
    szInfo += "<point><x>0.451613</x><y>0.216216</y></point>";
    szInfo += "<point><x>0.447581</x><y>0.729730</y></point>";
    szInfo += "<point><x>0.116935</x><y>0.554054</y></point>";
    szInfo += "</pointList>";
    szInfo += "</SnapPolygon>";
    szInfo += "</SnapPolygonList>";

    var iRet = WebVideoCtrl.I_SetSnapPolygonInfo(g_iWndIndex, szInfo);
    if (0 === iRet) {
        showOPInfo("窗口" + g_iWndIndex + "设置图形成功！");
    } else if (-1 === iRet) {
        showOPInfo("窗口" + g_iWndIndex + "设置图形失败！");
    } else if (-2 === iRet) {
        alert("参数错误！");
    } else if (-3 === iRet) {
        alert("图形个数达到上限！");
    } else if (-4 === iRet) {
        alert("图形ID已存在！");
    }
}

// 清空图形
function clickDelAllSnapPolygon() {
    if (!g_bEnableDraw) {
        return;
    }

    var iRet = WebVideoCtrl.I_ClearSnapInfo(g_iWndIndex);
    if (0 === iRet) {
        showOPInfo("窗口" + g_iWndIndex + "清空图形成功！");
    } else {
        showOPInfo("窗口" + g_iWndIndex + "清空图形失败！");
    }
}

// 设备抓图
function clickDeviceCapturePic() {
    var szInfo = "";
    var szDeviceIdentify = $("#ip").val();
    var bZeroChannel = $("#channels option").eq($("#channels").get(0).selectedIndex).attr("bZero") == "true" ? true : false;
    var iChannelID = parseInt($("#channels").val(), 10);
    var iResolutionWidth = parseInt($("#resolutionWidth").val(), 10);
    var iResolutionHeight = parseInt($("#resolutionHeight").val(), 10);

    if (null == szDeviceIdentify) {
        return;
    }
    
    if (bZeroChannel) {// 零通道不支持设备抓图
        return;
    }

    var szPicName = szDeviceIdentify + "_" + iChannelID + "_" + new Date().getTime();
    var iRet = WebVideoCtrl.I_DeviceCapturePic(szDeviceIdentify, iChannelID, szPicName, {
        bDateDir: true,  //是否生成日期文件
        iResolutionWidth: iResolutionWidth,
        iResolutionHeight: iResolutionHeight
    });

    if (0 == iRet) {
        szInfo = "设备抓图成功！";
    } else {
        szInfo = "设备抓图失败！";
    }
    showOPInfo(szDeviceIdentify + " " + szInfo);
}

function loadXML(szXml) {
    if(null == szXml || "" == szXml) {
        return null;
    }

    var oXmlDoc = null;

    if (window.DOMParser) {
        var oParser = new DOMParser();
        oXmlDoc = oParser.parseFromString(szXml, "text/xml");
    } else {
        oXmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        oXmlDoc.async = false;
        oXmlDoc.loadXML(szXml);
    }

    return oXmlDoc;
}

function toXMLStr(oXmlDoc) {
    var szXmlDoc = "";

    try {
        var oSerializer = new XMLSerializer();
        szXmlDoc = oSerializer.serializeToString(oXmlDoc);
    } catch (e) {
        try {
            szXmlDoc = oXmlDoc.xml;
        } catch (e) {
            return "";
        }
    }
    if (szXmlDoc.indexOf("<?xml") == -1) {
        szXmlDoc = "<?xml version='1.0' encoding='utf-8'?>" + szXmlDoc;
    }

    return szXmlDoc;
}

function encodeString(str) {
    if (str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    } else {
        return "";
    }
}

// ISAPI透传
function clickISAPI() {
    var szIP = $("#ip").val();	
    showOPInfo("I_SendHTTPRequest:" + szIP);

    WebVideoCtrl.I_SendHTTPRequest(szIP,"/ISAPI/System/Video/inputs/channels/1/overlays/text/1", {
        async: false,
        type: "GET",
        success: function (xmlDoc) {
            alert(toXMLStr(xmlDoc));
        },
        error: function (httpStatus, xmlDoc) {
            showOPInfo("error - " + httpStatus);
            alert(toXMLStr(xmlDoc));
        }
    });
    
    WebVideoCtrl.I_SendHTTPRequest(szIP,"/ISAPI/System/Video/inputs/channels/1/overlays/text/1", {
        async: false,
        type: "PUT",
        data: "<?xml version='1.0' encoding='utf-8'?><TextOverlay version='2.0' xmlns='http://www.isapi.org/ver20/XMLSchema'><id>1</id><enabled>true</enabled><positionX>100</positionX><positionY>100</positionY><displayText>测试</displayText></TextOverlay>",
        success: function (xmlDoc) {
            alert(toXMLStr(xmlDoc));
        },
        error: function (httpStatus, xmlDoc) {
            showOPInfo("error - " + httpStatus);
            alert(toXMLStr(xmlDoc));
        }
    });
}