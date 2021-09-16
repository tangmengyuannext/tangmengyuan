// 初始化插件
// console.log(window.top.sessionStorage.getItem("nvrip"),'---------NVRip');
// console.log(window.top.sessionStorage.getItem("camerauser"),'---------camerauser');

// console.log(window.top.sessionStorage.getItem("camerapassword"),'---------camerapassword');
var cameraip = "", cameraport = 80, camerauser = "", camerapassword = "", cameraikey = "",
    cameraNvr = "", cameraPtz = "", cameraInfrared = "", cameraTbk = "", cameraid = "",
    cameraName = "", precameraName = "", nextcameraName = "",
    nvrcameraip = "", spin = false;
nvrcameraip = window.top.sessionStorage.getItem("nvrip");
var httpurl = window.top.top.sessionStorage.getItem("httpurl");

$(".playback").hide();
$(".stopvoice").hide();
$(".isstart").show();
$(".isstop").hide();
$(".duijiang").css({ "display": "none" });
$(".fa-volume-up").hide();
$(".fa-volume-off").show();
$("#videodemo").hide();
$(".ptz").hide();
$(".robotconfig").hide();
// 默认样式
$(".jiankongcss").css({
    "background": "#1891ff"
})
$(".huifangcss").css({
    "background": "#ffffff"
})

cameraName = window.top.sessionStorage.getItem("sxtcameraName");
cameraid = window.top.sessionStorage.getItem("sxtcameraid");
cameraip = window.top.sessionStorage.getItem("sxtcameraip");
camerauser = window.top.sessionStorage.getItem("camerauser");
camerapassword = window.top.sessionStorage.getItem("camerapassword");
cameraikey = window.top.sessionStorage.getItem("sxtikey");
cameraNvr = window.top.sessionStorage.getItem("sxthasNvr"); //nvr
cameraInfrared = window.top.sessionStorage.getItem("sxthasInfrared"); //红热线y
cameraTbk = window.top.sessionStorage.getItem("sxthasTbk"); //对讲
cameraPtz = window.top.sessionStorage.getItem("sxthasPtz"); //云台
console.log(cameraNvr, '---', 'cameraInfrared==',cameraInfrared, '---', cameraTbk, '---', cameraPtz,'cameraid==',cameraid);
$("#cameraname").val(cameraName);

function userfunc() {
    if (cameraInfrared == "1") {
        videodemos.window.stopheart();
    }
}
//终端控制点击事件
function jiankongclick() {
    if(cameraNvr === "0"){
        return;
    }else{

        $(".jiankongcss").css({
            "background": "#1891ff",
            "color":"#fff"
        })
        $(".huifangcss").css({
            "background": "#ffffff",
            "color":"black"
    
        })
        $(".jiankongdiv").show();
        $(".ptz").show();
        $(".huifangdiv").hide();
        $(".playback").hide();
        if (cameraTbk === "1") {
            $(".duijiang").css({ "display": "block" });
            $(".fa-volume-up").hide();
            $(".fa-volume-off").show();
        } else {
            $(".duijiang").css({ "display": "none" });
        }
    }
}

var playbackchannel = "";
// 点击回放-登录NVR；
function clickhuifang() {
    if(cameraPtz === "0"){
        return;
    }else{
        $(".jiankongcss").css({
            "background": "#ffffff",
            "color":"black"
        })
        $(".huifangcss").css({
            "background": "#1891ff",
            "color":"#fff"
        })
        $(".jiankongdiv").hide();
        $(".huifangdiv").show();
        $(".playback").show();
    }
}

function clickNVR() {
    // clickLogout();
    if (cameraNvr === "1") {
        // 22.18.3.15 雪山
        // 192.168.0.68 安徽 nvrcameraip
        var cameraips = nvrcameraip;
        var szIP = cameraips,
            szPort = cameraport,
            szUsername = camerauser,
            szPassword = camerapassword;

        if ("" == szIP || "" == szPort) {
            return;
        }

        var szDeviceIdentify = szIP + "_" + szPort;
        var iRet = WebVideoCtrl.I_Login(szIP, 1, szPort, szUsername, szPassword, {
            success: function (xmlDoc) {
                console.log(szDeviceIdentify + " 登录成功！");
                $("#ip").prepend("<option value='" + szDeviceIdentify + "'>" + szDeviceIdentify + "</option>");
                setTimeout(function () {
                    $("#ip").val(szDeviceIdentify);
                    console.log(szDeviceIdentify, '------nvr-------');
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
                            showOPInfo(szDeviceIdentify + " 获取零通道成功！");
                        },
                        error: function (status, xmlDoc) {
                            showOPInfo(szDeviceIdentify + " 获取零通道失败！", status, xmlDoc);
                        }
                    });

                    // 获取端口
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
                    // 获取nvr数字通道------------------------------------------------------------
                    var szDeviceIdentify = $("#ip").val(),
                        iAnalogChannelNum = 0;
                    console.log(szDeviceIdentify, '----获取nvr数字通道')
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
                            console.log(oChannels, '--数字通道--');
                            var selectarr = [];
                            $.each(oChannels, function () {

                                var id = parseInt($(this).find("id").eq(0).text(), 10),
                                    ipAddress = $(this).find("ipAddress").eq(0).text(),
                                    srcInputPort = $(this).find("srcInputPort").eq(0).text(),
                                    managePortNo = $(this).find("managePortNo").eq(0).text(),
                                    online = $(this).find("online").eq(0).text(),
                                    proxyProtocol = $(this).find("proxyProtocol").eq(0).text();
                                var tongdaoobj = {
                                    "cameraip": ipAddress,
                                    "tongdaoid": srcInputPort
                                }
                                // console.log(ipAddress,'----ipAddress---------',srcInputPort,tongdaoobj);
                                selectarr.push(tongdaoobj);
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
                            // console.log(selectarr,'------获取所有数字通道IP------');
                            window.sessionStorage.setItem("nvrtongdao", JSON.stringify(selectarr));
                            showOPInfo(szDeviceIdentify + " 获取数字通道成功！");
                        },
                        error: function (status, xmlDoc) {
                            showOPInfo(szDeviceIdentify + " 没有数字通道！", status, xmlDoc);
                        }
                    });

                    // --------------------------------------------------------------------
                    console.log(window.sessionStorage.getItem("cameraiptongdao"), '----摄像头IP通道----------');
                    console.log(window.sessionStorage.getItem("cameratongdaoid"), '-----------摄像头通道id----------')
                    console.log(JSON.parse(window.sessionStorage.getItem("nvrtongdao")), '----nvr通道-------');
                    var nvrtongdaos = JSON.parse(window.sessionStorage.getItem("nvrtongdao")),
                        cameraiptongdao = window.sessionStorage.getItem("cameraiptongdao"),
                        cameratongdaoid = window.sessionStorage.getItem("cameratongdaoid");
                    for (var i = 0; i < nvrtongdaos.length; i++) {
                        if (cameraiptongdao == nvrtongdaos[i].cameraip && cameratongdaoid == nvrtongdaos[i].tongdaoid) {
                            console.log(i)
                            playbackchannel = i + 1;
                        }
                    }
                    console.log(playbackchannel, '---通道号---');
                }, 10);
            },
            error: function (status, xmlDoc) {
                console.log(szDeviceIdentify + " 登录失败！", status, xmlDoc);
            }
        });

        if (-1 == iRet) {
            console.log(szDeviceIdentify + " 已登录过！");
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
    }
}

var volume = 0, volume1 = 0;
window.onload = function () {
    var lineDiv = document.getElementById('lineDiv'); //长线条
    var minDiv = document.getElementById('minDiv'); //小方块
    var voicenum = document.getElementById("voicenum");
    // var vals = document.getElementById("vals");
    var ifBool = false; //判断鼠标是否按下
    //事件
    var start = function (e) {
        e.stopPropagation();
        ifBool = true;
        // console.log("鼠标按下")
    }
    var move = function (e) {
        // console.log("鼠标拖动")
        if (ifBool) {
            if (!e.touches) {    //兼容移动端
                var x = e.clientX;
            } else {     //兼容PC端
                var x = e.touches[0].pageX;
            }
            //var x = e.touches[0].pageX || e.clientX; //鼠标横坐标var x
            var lineDiv_left = getPosition(lineDiv).left; //长线条的横坐标
            var minDiv_left = x - lineDiv_left; //小方块相对于父元素（长线条）的left值
            if (minDiv_left >= lineDiv.offsetWidth - 15) {
                minDiv_left = lineDiv.offsetWidth - 15;
            }
            if (minDiv_left < 0) {
                minDiv_left = 0;
            }
            //设置拖动后小方块的left值
            minDiv.style.left = minDiv_left + "px";
            voicenum.innerText = parseInt((minDiv_left / (lineDiv.offsetWidth - 15)) * 100);
            volume = parseInt((minDiv_left / (lineDiv.offsetWidth - 15)) * 100);
            // console.log(volume);
            clickSetVolume();
        }
    }
    var end = function (e) {
        // console.log("鼠标弹起")
        ifBool = false;
    }
    //鼠标按下方块
    minDiv.addEventListener("touchstart", start);
    minDiv.addEventListener("mousedown", start);
    //拖动
    window.addEventListener("touchmove", move);
    window.addEventListener("mousemove", move);
    //鼠标松开
    window.addEventListener("touchend", end);
    window.addEventListener("mouseup", end);
    //获取元素的绝对位置
    function getPosition(node) {
        var left = node.offsetLeft; //获取元素相对于其父元素的left值var left
        var top = node.offsetTop;
        current = node.offsetParent; // 取得元素的offsetParent
        // 一直循环直到根元素

        while (current != null) {
            left += current.offsetLeft;
            top += current.offsetTop;
            current = current.offsetParent;
        }
        return {
            "left": left,
            "top": top
        };
    }

    //-----------回放中的对讲-------------
    var lineDiv1 = document.getElementById('lineDiv1'); //长线条
    var minDiv1 = document.getElementById('minDiv1'); //小方块
    var voicenum1 = document.getElementById("voicenum1");
    // var vals = document.getElementById("vals");
    var ifBool1 = false; //判断鼠标是否按下
    //事件
    var start1 = function (e) {
        e.stopPropagation();
        ifBool1 = true;
        // console.log("鼠标按下")
    }
    var move1 = function (e) {
        // console.log("鼠标拖动")
        if (ifBool1) {
            if (!e.touches) {    //兼容移动端
                var x = e.clientX;
            } else {     //兼容PC端
                var x = e.touches[0].pageX;
            }
            //var x = e.touches[0].pageX || e.clientX; //鼠标横坐标var x
            var lineDiv_left1 = getPosition1(lineDiv1).left; //长线条的横坐标
            var minDiv_left1 = x - lineDiv_left1; //小方块相对于父元素（长线条）的left值
            if (minDiv_left1 >= lineDiv1.offsetWidth - 15) {
                minDiv_left1 = lineDiv1.offsetWidth - 15;
            }
            if (minDiv_left1 < 0) {
                minDiv_left1 = 0;
            }
            //设置拖动后小方块的left值
            minDiv1.style.left = minDiv_left1 + "px";
            voicenum1.innerText = parseInt((minDiv_left1 / (lineDiv1.offsetWidth - 15)) * 100);
            volume1 = parseInt((minDiv_left1 / (lineDiv1.offsetWidth - 15)) * 100);
            // console.log(volume);
            clickSetVolume1();
        }
    }
    var end1 = function (e) {
        // console.log("鼠标弹起")
        ifBool1 = false;
    }
    //鼠标按下方块
    minDiv1.addEventListener("touchstart", start1);
    minDiv1.addEventListener("mousedown", start1);
    //拖动
    window.addEventListener("touchmove", move1);
    window.addEventListener("mousemove", move1);
    //鼠标松开
    window.addEventListener("touchend", end1);
    window.addEventListener("mouseup", end1);
    //获取元素的绝对位置
    function getPosition1(node) {
        var left = node.offsetLeft; //获取元素相对于其父元素的left值var left
        var top = node.offsetTop;
        current = node.offsetParent; // 取得元素的offsetParent
        // 一直循环直到根元素

        while (current != null) {
            left += current.offsetLeft;
            top += current.offsetTop;
            current = current.offsetParent;
        }
        return {
            "left": left,
            "top": top
        };
    }
}

$(document).ready(function () {
    console.log(cameraid, '-----cameraid=============');
    // 云台和NVR
    hiddenHuiAndYunDiv();

    if (cameraikey == "shuangmu") {
        console.log("cameraikey == shuangmu")
        $("#divPlugin").css({
            width: "400px",
            marginLeft: "50px"
        })
        console.log(cameraid, '-----cameraid====hkhkhkhkhkh=========');
        // let newCameraid = window.sessionStorage.getItem("cameraid", cameraid);
        // console.log('-----cameraid====hkhkhkhkhkh====********=====',newCameraid);
        // document.getElementById("videodemo").contentWindow.location.reload(true);
        $("#videodemo").show();

        
        // $(".duijiang").css({"display":"none"});
        // $(".ptz").hide();
        // 初始化插件参数及插入插件
        WebVideoCtrl.I_InitPlugin('100%', '100%', {
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

        setTimeout(function () {
            window.sessionStorage.setItem("cameraid", cameraid);
            let newCameraid = window.sessionStorage.getItem("cameraid");
            console.log('-----cameraid==cameraikey == "shuangmu"===========',window.sessionStorage.getItem("cameraid"));
            document.getElementById("videodemo").contentWindow.iframeShowStartRequest(newCameraid);
        }, 3000);

    } else if (cameraikey == "yuntai") {
        console.log("cameraikey == yuntai")
        $(".btn_right").css({
            marginLeft: "0px",
            left: "880px",
        })
        $("#divPlugin").css({
            width: "600px",
            marginLeft: "150px"
        })
        $("#videodemo").hide();
        $(".ptz").show();
        // $(".duijiang").css({"display":"none"});
        window.sessionStorage.setItem("cameraid", undefined);
        // document.getElementById("#divPlugin").contentWindow.location.reload(true);
        // 初始化插件参数及插入插件
        WebVideoCtrl.I_InitPlugin('100%', '100%', {
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
    } else if (cameraikey == "stationary") {
        console.log("cameraikey == stationary")
        $("#divPlugin").css({
            width: "600px",
            marginLeft: "150px"
        })
        $(".plugin").css({
            marginLeft: "150px"
        })
        $(".btn_right").css({
            marginLeft: "0px",
            left: "880px",
        })
        $("#videodemo").hide();
        window.sessionStorage.setItem("cameraid", undefined);
        // document.getElementById("videodemo").contentWindow.location.reload(true);
        // 初始化插件参数及插入插件
        WebVideoCtrl.I_InitPlugin('100%', '100%', {
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
    } else if (cameraikey == "robotyuntai") {
        console.log("cameraikey == robotyuntai")
        $(".plugin").css({
            width: "800px !important",
            height: "350px !important"
        })
        $("#videodemo").hide();
        // $(".duijiang").css({"display":"none"});
        $(".robotconfig").show();
        window.sessionStorage.setItem("cameraid", undefined);
        // document.getElementById("videodemo").contentWindow.location.reload(true);
        // 初始化插件参数及插入插件
        WebVideoCtrl.I_InitPlugin('100%', '100%', {
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

    var szIP = cameraip,
        szPort = cameraport,
        szUsername = camerauser,
        szPassword = camerapassword;

    if ("" == szIP || "" == szPort) {
        return;
    }

    var szDeviceIdentify = szIP + "_" + szPort;

    var iRet = WebVideoCtrl.I_Login(szIP, 1, szPort, szUsername, szPassword, {
        success: function (xmlDoc) {
            console.log(szDeviceIdentify + " 登录成功！");
            window.sessionStorage.setItem("cameraiptongdao", cameraip);
            $("#ip").prepend("<option value='" + szDeviceIdentify + "'>" + szDeviceIdentify + "</option>");
            setTimeout(function () {
                $("#ip").val(szDeviceIdentify);
                getChannelInfo();
                getDevicePort();
            }, 10);
        },
        error: function (status, xmlDoc) {
            console.log(szDeviceIdentify + " 登录失败！", status, xmlDoc);
        }
    });

    if (-1 == iRet) {
        console.log(szDeviceIdentify + " 已登录过！");
        clickLogout();
    }

    //------------------------------------------------------------------- //
    setTimeout(function () {
        console.log("开始调用开始预览方法进入setTimeout740");
        var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
            szDeviceIdentify = $("#ip").val(),
            iRtspPort = parseInt($("#rtspport").val(), 10),
            iChannelID = parseInt($("#channels").val(), 10),
            bZeroChannel = $("#channels option").eq($("#channels").get(0).selectedIndex).attr("bZero") == "true" ? true : false,
            szInfo = "";

        if ("undefined" === typeof iStreamType) {
            iStreamType = parseInt($("#streamtype").val(), 10);
        }
        console.log(iStreamType);
        if (null == szDeviceIdentify) {
            return;
        }

        console.log("开始预览startRealPlay上一行756");
        var startRealPlay = function () {
            console.log("开始预览上一行758");
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
    }, 500)

    yuzhiweiMessList(cameraid);
})
// 隐藏回放和云台布局
function hiddenHuiAndYunDiv(){
    // 云台和NVR
    if (cameraPtz === "0" && cameraNvr === "0") {
        $(".ptz").hide();
        $(".playback").hide();
        $(".huifangcss").css({
            "display": "none"
        })
        $(".jiankongcss").css({
            "display": "block",
            "width":"175px",
            // "width": "900px",
            // "border-top-right-radius": "20px"
        })
        console.log("cameraPtz === 0 && cameraNvr === 0")

    } else if (cameraPtz === "1" && cameraNvr === "0") {
        console.log("cameraPtz === 1 && cameraNvr === 0")
        $(".huifangcss").css({
            "display": "none"
        })
        $(".jiankongcss").css({
            "display": "block",
            "width":"175px"
            // "width": "900px",
            // "border-top-right-radius": "20px"
        })
        $(".ptz").show();
    } else if (cameraPtz === "1" && cameraNvr === "1") {
        console.log("cameraPtz === 1 && cameraNvr === 1")
        jiankongclick()
        $(".jiankongcss").css({
            "background": "#1891ff",
            "display": "block",
            "width": "175px",
            // "border-top-right-radius": "0px",
            // "border-top-left-radius": "20px"
        })
        $(".ptz").show();
        $(".huifangcss").css({
            "background": "#ffffff",
            "display": "block",
            "width": "175px",
            // "border-top-left-radius": "0px",
            // "border-top-right-radius": "20px"
        })
    } else if (cameraPtz === "0" && cameraNvr === "1") {
        console.log("cameraPtz === 0 && cameraNvr === 1")
        $(".playback").show();
        $(".jiankongcss").css({
            "display": "none"
        })
        $(".huifangcss").css({
            "display": "block",
            "width": "175px",
            // "border-top-left-radius": "20px"
        })
        
        clickhuifang()
        if (cameraTbk === "1") {
            $("#searchdiv").css({
                "height": "95px !important"
            })
        }
    }
    // // 对讲
    if (cameraTbk === "0") {
        console.log("cameraTbk === 0 ")
        $(".duijiang").css({ "display": "none" });
    } else if (cameraTbk === "1") {
        console.log("cameraTbk === 1 ")
        $(".duijiang").show();
        $(".fa-volume-up").hide();
        $(".fa-volume-off").show();
    }
    // 隐藏监控部分
    if (cameraPtz === "0" && cameraTbk === "0") {
        console.log("cameraPtz === 0 && cameraTbk === 0")

        $(".jiankongcss").css({
            "display": "none"
        })
        $(".ptz").hide();
        $(".duijiang").css({ "display": "none" });
        $(".huifangcss").css({
            "display": "block",
            "background": "#1891ff",
            "width": "175px",
            // "border-top-left-radius": "20px"
        })
    } else if (cameraPtz === "0" && cameraTbk === "1") {
        console.log("cameraPtz === 0 && cameraTbk === 1")

        $(".duijianghf").css({
            "display": "block"
        });
    }
    if (cameraPtz === "0" && cameraTbk === "0" && cameraNvr === "0") {
        console.log("cameraPtz === 0 && cameraTbk === 0 && cameraNvr === 1")
        $(".tabbtn").css({
            "display": "none",
            "border": "none",
            "width": "0px",
            "height": "0px"
        })
    } else if (cameraPtz == "undefined" && cameraTbk == "undefined" && cameraNvr == "undefined") {
        console.log("cameraPtz === undefined && cameraTbk === undefined && cameraNvr === undefined")
        $(".tabbtn").css({
            "display": "none",
            "border": "none",
            "width": "0px",
            "height": "0px"
        })
    } else if (cameraPtz == undefined && cameraTbk == undefined && cameraNvr == undefined) {
        console.log("cameraPtz === undefined && cameraTbk === undefined && cameraNvr === undefined")
        $(".tabbtn").css({
            "display": "none",
            "border": "none",
            "width": "0px",
            "height": "0px"
        })
    } else if (cameraPtz === "1" && cameraTbk === "1" && cameraNvr === "1") {
        console.log("cameraPtz === 1 && cameraTbk === 1 && cameraNvr === 1")
        $(".tabbtn").css({
            "display": "block",
            // "border": "1px solid #ccc",
            "width": "900px",
            "height": "250px"
        })
        $(".duijiang").css({ "display": "block" });
        $(".fa-volume-up").hide();
        $(".fa-volume-off").show();
        $(".duijianghf").css({
            "display": "none"
        });
        $(".ptz").show();
        
        
    } else {
        console.log("else")
        $(".tabbtn").css({
            "display": "block",
            // "border": "1px solid #ccc",
            "width": "900px",
            "height": "250px"
        })
    }
    
    if(cameraPtz === "0" && cameraTbk === "1" && cameraNvr === "1"){
        $(".playImgBtnBody").css({
            "margin-top":"10px",
        })
    }else{
        $(".playImgBtnBody").css({
            "margin-top":"20px",
        })
    }
}

// hk获取预置位数据
var Bearers = "Bearer " + window.top.sessionStorage.getItem('brearer'),urlhead = window.top.sessionStorage.getItem('prophttps');
var yuzhiweiArray=[];
function yuzhiweiMessList(yuzhiweiCameraid){
    console.log("cameraid预置位请求",yuzhiweiCameraid)
    $.ajax({  
        url: httpurl + "/device/site/list",
        type:"get",
        dataType : 'json',
        data:{cameraId:yuzhiweiCameraid},
        headers:{'Content-Type':'application/json;charset=utf8','Authorization':Bearers},
        success : function(data) {
            yuzhiweiArray = data.rows;

            var yuzhi = "";
            console.log("yuzhiweiArray预置位列表请求",yuzhiweiArray)
            if(!yuzhiweiArray.length){
                console.log("yuzhiweiArray-if")
                // yuzhi='<div class="ziDiv">'+"暂无预置位";
                // yuzhi+='</div>';
                // $("#yuzhiweiDiv").append(yuzhi);
                $("#yuzhiweiDiv").text('暂无预置位');
                $("#yuzhiweiDiv").css({
                    'text-align': 'center',
                    'color':'#1890FF',
                })
            }else{

                $("#yuzhiweiDiv").empty();   // 清空父元素
                
                console.log("yuzhiweiArray-else")
                for (var i=0;i<yuzhiweiArray.length;i++){
                    yuzhi='<div id="ziDiv" class="ziDiv">'+yuzhiweiArray[i].siteName;
                    yuzhi+='</div>';
                    $("#yuzhiweiDiv").append(yuzhi);
                }

            }
            
        },
        error:function(status){
            //失败后执行的代码
            console.log("预置位列表请求失败",status)
        }
    
    });
        
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

var iplist = JSON.parse(window.top.sessionStorage.getItem("ipgathers"));
console.log(iplist.length, '------length');
console.log(iplist, "iplist============");

// ----------摄像头点击切换-----------

var count = 0;
// -----------hk-------
for (var i = 0; i < iplist.length; i++) {
    if (iplist[i].ip === cameraip) {
        count = i
    }
}
// 是否加载中。。。
function isSpining() {
    if (spin) {
        alert("图像加载中，请稍等。。。");
        return;
    }
    spin = true;
}
// -----------hk-------
function preclick() {
    console.log(count, "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^", iplist)
    
    clickLogout();
    isSpining();
    userfunc();
    count--;
    if (count < 0) {
        count = iplist.length - 1;
    }
    if (!iplist.length) {
        return;
    }
    if (count === iplist.length - 1) {
        precameraName = iplist[count - 1].cameraName;
        nextcameraName = iplist[0].cameraName;
    } else if (count === 0) {
        precameraName = iplist[iplist.length - 1].cameraName;
        nextcameraName = iplist[count + 1].cameraName;
    } else {
        precameraName = iplist[count - 1].cameraName;
        nextcameraName = iplist[count + 1].cameraName;
    }
    cameraName = iplist[count].cameraName;
    $("#cameraname").val(cameraName);
    var prespaninner = "<span>" + precameraName + "</span>";
    document.getElementById("precamera").innerHTML = prespaninner;
    var nextspaninner = "<span>" + nextcameraName + "</span>";
    document.getElementById("nextcamera").innerHTML = nextspaninner;

    cameraid=iplist[count].id;
    yuzhiweiMessList(cameraid); //获取预置位信息

    cameraikey = iplist[count].ikey;
    cameraNvr = iplist[count].hasNvr; //nvr
    cameraTbk = iplist[count].hasTbk; //对讲
    cameraPtz = iplist[count].hasPtz; //云台
    console.log(cameraNvr, '-----', cameraTbk, "=====", cameraPtz);
    jiankongclick();
    // // 云台和NVR
    hiddenHuiAndYunDiv();

    if (cameraikey == "shuangmu") {
        $("#divPlugin").css({
            width: "400px",
            marginLeft: "50px"
        })
        window.sessionStorage.setItem("cameraid", iplist[count].cameraId);
        console.log('-----上一个获取缓存cameraid == "shuangmu"===========',window.sessionStorage.getItem("cameraid"));
        let newCameraid = window.sessionStorage.getItem("cameraid");
        document.getElementById("videodemo").contentWindow.iframeShowStartRequest(newCameraid);
        // document.getElementById("videodemo").contentWindow.location.reload(true);
        $("#videodemo").show();
        $(".robotconfig").hide();
        // $(".duijiang").css({"display":"none"});
        // $(".ptz").hide();
        // 初始化插件参数及插入插件
        WebVideoCtrl.I_InitPlugin('100%', '100%', {
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
        // setTimeout(function () {
        //     window.sessionStorage.setItem("cameraid", cameraid);
        //     let newCameraid = window.sessionStorage.getItem("cameraid", cameraid);
        //     console.log('-----cameraid==cameraikey == "shuangmu"===========',window.sessionStorage.getItem("cameraid", cameraid));
        //     document.getElementById("videodemo").contentWindow.iframeShowStartRequest(newCameraid);
        // }, 3000);
    } else if (cameraikey == "yuntai") {
        window.sessionStorage.setItem("cameraid", undefined);
        // document.getElementById("videodemo").contentWindow.location.reload(true);
        $("#divPlugin").css({
            width: "600px",
            marginLeft: "150px"
        })
        $(".btn_right").css({
            marginLeft: "0px",
            left: "880px",
        })
        $("#videodemo").hide();
        $(".robotconfig").hide();
        // $(".duijiang").css({"display":"none"});
        // 初始化插件参数及插入插件
        WebVideoCtrl.I_InitPlugin('100%', '100%', {
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
    } else if (cameraikey == "stationary") {
        window.sessionStorage.setItem("cameraid", undefined);
        // document.getElementById("videodemo").contentWindow.location.reload(true);
        $("#divPlugin").css({
            width: "600px",
            marginLeft: "150px"
        })
        $(".btn_right").css({
            marginLeft: "0px",
            left: "880px",
        })
        $("#videodemo").hide();
        $(".robotconfig").hide();
        // $(".duijiang").css({"display":"none"});
        $(".ptz").hide();
        // 初始化插件参数及插入插件
        WebVideoCtrl.I_InitPlugin('100%', '100%', {
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
    } else if (cameraikey == "robotyuntai") {
        window.sessionStorage.setItem("cameraid", undefined);
        // document.getElementById("videodemo").contentWindow.location.reload(true);
        $("#divPlugin").css({
            width: "500px",
            marginLeft: "150px"
        })
        $("#videodemo").hide();
        $(".robotconfig").show();
        // $(".duijiang").css({"display":"none"});
        // 初始化插件参数及插入插件
        WebVideoCtrl.I_InitPlugin('100%', '100%', {
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

    cameraip = iplist[count].ip;
    // 获取摄像头IP，直接赋值登录
    if (cameraip != null) {
        var szIP = cameraip,
            szPort = cameraport,
            szUsername = camerauser,
            szPassword = camerapassword;
    }

    console.log(szIP);

    if ("" == szIP || "" == szPort) {
        alert("摄像头IP为空，请重新选择摄像头");
        return;
    }

    var szDeviceIdentify = szIP + "_" + szPort;

    var iRet = WebVideoCtrl.I_Login(szIP, 1, szPort, szUsername, szPassword, {
        success: function (xmlDoc) {
            // alert(szDeviceIdentify + " 登录成功！");
            window.sessionStorage.setItem("cameraiptongdao", cameraip);
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
        console.log(szDeviceIdentify + " 已登录过！");
        clickLogout()
    }
    //------------------------------------------------------------------- //
    setTimeout(function () {
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
        console.log("开始预览startRealPlay上一行1390");
        var startRealPlay = function () {
        console.log("开始预览上一行1392");
            WebVideoCtrl.I_StartRealPlay(szDeviceIdentify, {
                iRtspPort: iRtspPort,
                iStreamType: iStreamType,
                iChannelID: iChannelID,
                bZeroChannel: bZeroChannel,
                success: function () {
                    szInfo = "开始预览成功！";
                    console.log(szDeviceIdentify + " " + szInfo);
                    spin = false;
                },
                error: function (status, xmlDoc) {
                    if (403 === status) {
                        szInfo = "设备不支持Websocket取流！";
                    } else {
                        szInfo = "开始预览失败！";
                    }
                    clickLogout();
                    spin = false;
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
    }, 500)
}

function nextclick() {
   
    console.log(count, "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^", iplist)
    clickLogout();
    // ------hk------
    isSpining();
    // ------hk------
    userfunc();
    count++;

    if (count > iplist.length - 1) {
        count = 0;
    }
    // ------hk------
    if (!iplist.length) {
        return;
    }
    if (count === iplist.length - 1) {
        precameraName = iplist[count - 1].cameraName;
        nextcameraName = iplist[0].cameraName;
    } else if (count === 0) {
        precameraName = iplist[iplist.length - 1].cameraName;
        nextcameraName = iplist[count + 1].cameraName;
    } else {
        precameraName = iplist[count - 1].cameraName;
        nextcameraName = iplist[count + 1].cameraName;
    }
    cameraName = iplist[count].cameraName;
    $("#cameraname").val(cameraName);
    var prespaninner = "<span>" + precameraName + "</span>";
    document.getElementById("precamera").innerHTML = prespaninner;
    var nextspaninner = "<span>" + nextcameraName + "</span>";
    document.getElementById("nextcamera").innerHTML = nextspaninner;

    // ------hk------
    cameraid=iplist[count].id;

    cameraikey = iplist[count].ikey;
    cameraNvr = iplist[count].hasNvr; //nvr
    cameraTbk = iplist[count].hasTbk; //对讲
    cameraPtz = iplist[count].hasPtz; //云台
    console.log(cameraNvr, '-----', cameraTbk, "=====", cameraPtz);

    console.log("^^^^^^^^^^^^^^^^^^^^^cameraid==^^^^^^^^^^^^^^^^^",cameraid)
    yuzhiweiMessList(cameraid); //获取预置位信息

    jiankongclick();
    // // 云台和NVR
    hiddenHuiAndYunDiv();

    if (cameraikey == "shuangmu") {
        $("#divPlugin").css({
            width: "400px",
            marginLeft: "50px"
        })
        window.sessionStorage.setItem("cameraid", iplist[count].cameraId);
        console.log('-----下一个获取缓存cameraid == "shuangmu"===========',window.sessionStorage.getItem("cameraid"));
        let newCameraid = window.sessionStorage.getItem("cameraid");
        document.getElementById("videodemo").contentWindow.iframeShowStartRequest(newCameraid);
        // document.getElementById("videodemo").contentWindow.location.reload(true);
        $("#videodemo").show();
        $(".robotconfig").hide();
        // $(".duijiang").css({"display":"none"});
        // $(".ptz").hide();
        // 初始化插件参数及插入插件
        WebVideoCtrl.I_InitPlugin('100%', '100%', {
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
    } else if (cameraikey == "yuntai") {
        window.sessionStorage.setItem("cameraid", undefined);
        // document.getElementById("videodemo").contentWindow.location.reload(true);
        $("#divPlugin").css({
            width: "600px",
            marginLeft: "150px"
        })
        $(".btn_right").css({
            marginLeft: "0px",
            left: "880px",
        })
        $("#videodemo").hide();
        $(".robotconfig").hide();
        // $(".duijiang").css({"display":"none"});
        // 初始化插件参数及插入插件
        WebVideoCtrl.I_InitPlugin('100%', '100%', {
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
    } else if (cameraikey == "stationary") {
        window.sessionStorage.setItem("cameraid", undefined);
        // document.getElementById("videodemo").contentWindow.location.reload(true);
        $("#divPlugin").css({
            width: "600px",
            marginLeft: "150px"
        })
        $(".btn_right").css({
            marginLeft: "0px",
            left: "880px",
        })
        $("#videodemo").hide();
        $(".robotconfig").hide();
        // $(".duijiang").css({"display":"none"});
        $(".ptz").hide();
        // 初始化插件参数及插入插件
        WebVideoCtrl.I_InitPlugin('100%', '100%', {
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
    } else if (cameraikey == "robotyuntai") {
        window.sessionStorage.setItem("cameraid", undefined);
        // document.getElementById("videodemo").contentWindow.location.reload(true);
        $("#divPlugin").css({
            width: "500px",
            marginLeft: "150px"
        })
        $("#videodemo").hide();
        $(".robotconfig").show();
        // $(".duijiang").css({"display":"none"});
        // 初始化插件参数及插入插件
        WebVideoCtrl.I_InitPlugin('100%', '100%', {
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

    cameraip = iplist[count].ip;
    // 获取摄像头IP，直接赋值登录
    if (cameraip != null) {
        var szIP = cameraip,
            szPort = cameraport,
            szUsername = camerauser,
            szPassword = camerapassword;
    }

    console.log(szIP);

    if ("" == szIP || "" == szPort) {
        alert("摄像头IP为空，请重新选择摄像头");
        return;
    }

    var szDeviceIdentify = szIP + "_" + szPort;

    var iRet = WebVideoCtrl.I_Login(szIP, 1, szPort, szUsername, szPassword, {
        success: function (xmlDoc) {
            // alert(szDeviceIdentify + " 登录成功！");
            window.sessionStorage.setItem("cameraiptongdao", cameraip);
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
        console.log(szDeviceIdentify + " 已登录过！");
        clickLogout();
    }
    //------------------------------------------------------------------- //
    setTimeout(function () {
        console.log("开始调用开始预览方法进入setTimeout1749");
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

        console.log("开始预览startRealPlay上一行1766");
        var startRealPlay = function () {
            console.log("开始预览上一行1768");
            WebVideoCtrl.I_StartRealPlay(szDeviceIdentify, {
                iRtspPort: iRtspPort,
                iStreamType: iStreamType,
                iChannelID: iChannelID,
                bZeroChannel: bZeroChannel,
                success: function () {
                    szInfo = "开始预览成功！";
                    console.log(szDeviceIdentify + " " + szInfo);
                    spin = false;
                },
                error: function (status, xmlDoc) {
                    if (403 === status) {
                        szInfo = "设备不支持Websocket取流！";
                    } else {
                        szInfo = "开始预览失败！";
                    }
                    clickLogout();
                    spin = false;
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
    }, 500);

    
}

// 上一曲下一曲调用ajax的回调方法
function nextOrPrecCallback(loadType) {
    spin = loadType;
}

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

    return { width: nWidth, height: nHeight };
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
    //     szPort = cameraport,
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
    clickStopRealPlay();//调取停止预览方法
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
            console.log($("#channels").val());
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
    console.log($("#channels").val(), '------------------------通道tongdao----');
    window.sessionStorage.setItem("cameratongdaoid", $("#channels").val());
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
            console.log(oChannels, '--数字通道--');
            var selectarr = [];
            $.each(oChannels, function () {

                var id = parseInt($(this).find("id").eq(0).text(), 10),
                    ipAddress = $(this).find("ipAddress").eq(0).text(),
                    srcInputPort = $(this).find("srcInputPort").eq(0).text(),
                    managePortNo = $(this).find("managePortNo").eq(0).text(),
                    online = $(this).find("online").eq(0).text(),
                    proxyProtocol = $(this).find("proxyProtocol").eq(0).text();
                var tongdaoobj = {
                    "cameraip": ipAddress,
                    "tongdaoid": srcInputPort
                }
                console.log(ipAddress, '----ipAddress---------', srcInputPort, tongdaoobj);
                selectarr.push(tongdaoobj);
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
            console.log(selectarr, '------获取所有数字通道IP------');
            window.sessionStorage.setItem("nvrtongdao", JSON.stringify(selectarr));
            showOPInfo(szDeviceIdentify + " 获取数字通道成功！");
        },
        error: function (status, xmlDoc) {
            showOPInfo(szDeviceIdentify + " 没有数字通道！", status, xmlDoc);
        }
    });
}

// 开始预览
function clickStartRealPlay(iStreamType) {
    console.log(window.sessionStorage.getItem("cameraiptongdao"), "---nvr登陆之前摄像头的IP----");
    var szIP = window.sessionStorage.getItem("cameraiptongdao"),
        szPort = cameraport,
        szUsername = camerauser,
        szPassword = camerapassword;

    if ("" == szIP || "" == szPort) {
        return;
    }

    var szDeviceIdentify = szIP + "_" + szPort;

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
            console.log(szDeviceIdentify + " 登录失败！", status, xmlDoc);
        }
    });

    if (-1 == iRet) {
        console.log(szDeviceIdentify + " 已登录过！");
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
    setTimeout(function () {
        console.log("开始调用开始预览方法进入setTimeout2238");
        var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
            szDeviceIdentify = $("#ip").val(),
            iRtspPort = parseInt($("#rtspport").val(), 10),
            iChannelID = parseInt($("#channels").val(), 10),
            bZeroChannel = $("#channels option").eq($("#channels").get(0).selectedIndex).attr("bZero") == "true" ? true : false,
            szInfo = "";

        if ("undefined" === typeof iStreamType) {
            iStreamType = parseInt($("#streamtype").val(), 10);
        }
        console.log(szDeviceIdentify, '---ip----');
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
    }, 500);
}

// 停止预览
function clickStopRealPlay() {
    console.log("调用了停止预览方法")
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
    console.log(1, '--打开声音');
    $(".fa-volume-up").show();
    $(".fa-volume-off").hide();
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
    console.log(2, '--关闭声音');
    $(".fa-volume-up").hide();
    $(".fa-volume-off").show();
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

//---------------------回放中的对讲----------------
// 打开声音
function clickOpenSound1() {
    console.log(1, '--打开声音');
    $(".fa-volume-up").show();
    $(".fa-volume-off").hide();
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
        console.log(oWndInfo.szDeviceIdentify + " " + szInfo);
    }
}

// 关闭声音
function clickCloseSound1() {
    console.log(2, '--关闭声音');
    $(".fa-volume-up").hide();
    $(".fa-volume-off").show();
    var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
        szInfo = "";

    if (oWndInfo != null) {
        var iRet = WebVideoCtrl.I_CloseSound();
        if (0 == iRet) {
            szInfo = "关闭声音成功！";
        } else {
            szInfo = "关闭声音失败！";
        }
        console.log(oWndInfo.szDeviceIdentify + " " + szInfo);
    }
}

// 设置音量
function clickSetVolume() {
    var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
        iVolume = parseInt(volume, 10),
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

//-----------------------回放中的对讲-----------------------------------------
// 设置音量
function clickSetVolume1() {
    var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
        iVolume = parseInt(volume1, 10),
        szInfo = "";

    if (oWndInfo != null) {
        var iRet = WebVideoCtrl.I_SetVolume(iVolume);
        if (0 == iRet) {
            szInfo = "音量设置成功！";
        } else {
            szInfo = "音量设置失败！";
        }
        console.log(oWndInfo.szDeviceIdentify + " " + szInfo);
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

        szPicName += ("0" === szCaptureFileFormat) ? ".jpg" : ".bmp";

        var iRet = WebVideoCtrl.I_CapturePic(szPicName, {
            bDateDir: false  //是否生成日期文件
        });
        if (0 == iRet) {
            szInfo = "抓图成功！";
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
                console.log($("#previewPicPath").val(), '-------');
                var imgaddressprop = $("#previewPicPath").val() + '\\' + szPicName;
                var imgobj = {
                    imgaddress: imgaddressprop,
                    imgname: szPicName
                }
                window.parent.postMessage({ imgobj: imgobj }, '*');
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
    // var szDeviceIdentify = $("#ip").val();

    // if (null == szDeviceIdentify) {
    //     return; 
    // }

    // WebVideoCtrl.I_GetAudioInfo(szDeviceIdentify, {
    //     success: function (xmlDoc) {
    //         var oAudioChannels = $(xmlDoc).find("TwoWayAudioChannel"),
    //             oSel = $("#audiochannels").empty();
    //         $.each(oAudioChannels, function () {
    //             var id = $(this).find("id").eq(0).text();

    //             oSel.append("<option value='" + id + "'>" + id + "</option>");
    //         });
    //         showOPInfo(szDeviceIdentify + " 获取对讲通道成功！");
    //     },
    //     error: function (status, xmlDoc) {
    //         showOPInfo(szDeviceIdentify + " 获取对讲通道失败！", status, xmlDoc);
    //     }
    // });
}

// 开始对讲
function clickStartVoiceTalk() {
    $(".startvoice").hide();
    $(".stopvoice").show();
    $(".isstart").hide();
    $(".isstop").show();
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
            console.log(szDeviceIdentify + " 获取对讲通道成功！");
        },
        error: function (status, xmlDoc) {
            console.log(szDeviceIdentify + " 获取对讲通道失败！", status, xmlDoc);
        }
    });
    setTimeout(function () {
        var szDeviceIdentify = $("#ip").val(),
            iAudioChannel = parseInt($("#audiochannels").val(), 10),
            szInfo = "";

        if (null == szDeviceIdentify) {
            return;
        }

        if (isNaN(iAudioChannel)) {
            console.log("请选择对讲通道！");
            return;
        }

        var iRet = WebVideoCtrl.I_StartVoiceTalk(szDeviceIdentify, iAudioChannel);

        if (0 == iRet) {
            szInfo = "开始对讲成功！";
        } else {
            szInfo = "开始对讲失败！";
        }
        console.log(szDeviceIdentify + " " + szInfo);
    }, 500)

}

// 停止对讲
function clickStopVoiceTalk() {
    $(".startvoice").show();
    $(".stopvoice").hide();
    $(".isstart").show();
    $(".isstop").hide();
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

//-----------------------回放中的对讲-----------------------------------------
// 开始对讲
function clickStartVoiceTalk1() {
    $(".startvoice").hide();
    $(".stopvoice").show();
    $(".isstart").hide();
    $(".isstop").show();
    var szDeviceIdentify = $("#ip").val();

    if (null == szDeviceIdentify) {
        return;
    }
    console.log(szDeviceIdentify, '开始对讲');
    WebVideoCtrl.I_GetAudioInfo(szDeviceIdentify, {
        success: function (xmlDoc) {
            var oAudioChannels = $(xmlDoc).find("TwoWayAudioChannel"),
                oSel = $("#audiochannels").empty();
            $.each(oAudioChannels, function () {
                var id = $(this).find("id").eq(0).text();

                oSel.append("<option value='" + id + "'>" + id + "</option>");
            });
            console.log(szDeviceIdentify + " 获取对讲通道成功！");
        },
        error: function (status, xmlDoc) {
            console.log(szDeviceIdentify + " 获取对讲通道失败！", status, xmlDoc);
        }
    });
    setTimeout(function () {
        var szDeviceIdentify = $("#ip").val(),
            iAudioChannel = parseInt($("#audiochannels").val(), 10),
            szInfo = "";

        if (null == szDeviceIdentify) {
            return;
        }

        if (isNaN(iAudioChannel)) {
            console.log("请选择对讲通道！");
            return;
        }

        var iRet = WebVideoCtrl.I_StartVoiceTalk(szDeviceIdentify, iAudioChannel);

        if (0 == iRet) {
            szInfo = "开始对讲成功！";
        } else {
            szInfo = "开始对讲失败！";
        }
        console.log(szDeviceIdentify + " " + szInfo);
    }, 500)

}

// 停止对讲
function clickStopVoiceTalk1() {
    $(".startvoice").show();
    $(".stopvoice").hide();
    $(".isstart").show();
    $(".isstop").hide();
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
    console.log(szDeviceIdentify + " " + szInfo);
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
function unique(arr) {
    for (var i = 0; i < arr.length; i++) {
        for (var j = i + 1; j < arr.length; j++) {
            if (arr[i] == arr[count]) {
                arr.splice(j, 1);
                j--;
            }
        }
    }
    return arr;
}

var yuzhiweiVal = "", select_con = [];
// 设置预置点
function clickSetPreset() {
    var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
        iPresetID = parseInt($("#preset").val(), 10);
    var optionlist = [];
    if (oWndInfo != null) {
        WebVideoCtrl.I_SetPreset(iPresetID, {
            success: function (xmlDoc) {
                showOPInfo(oWndInfo.szDeviceIdentify + " 设置预置点成功！");
                $("#changeyuzhi").append("<option value='" + iPresetID + "'>" + iPresetID + "</option>");
                $("#changeyuzhi option").each(function () {
                    var option_con = $(this).val();
                    if ($("#changeyuzhi option:contains(" + option_con + ")").length > 1) {
                        $("#changeyuzhi option:contains(" + option_con + "):gt(0)").remove();
                    }
                    optionlist.push(option_con);
                });
                yuzhiweiVal = iPresetID;
                select_con = unique(optionlist);  //去重
                console.log(select_con, 'select_con-----select_con')
                //给父页面传数据
                window.parent.postMessage({ data: select_con }, '*')
            },
            error: function (status, xmlDoc) {
                showOPInfo(oWndInfo.szDeviceIdentify + " 设置预置点失败！", status, xmlDoc);
            }
        });
    }
}
function yuzhiChange(val) {
    console.log(val, "选中的预置位");
    yuzhiweiVal = val;
}
// 调用预置点
function clickGoPreset() {
    console.log(yuzhiweiVal, '903-903-903');
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
    if (cameraNvr == "1") {
        clickNVR();
    }
    setTimeout(function () {
        var szDeviceIdentify = $("#ip").val(),
            iChannelID = parseInt(playbackchannel, 10),
            bZeroChannel = $("#channels option").eq($("#channels").get(0).selectedIndex).attr("bZero") == "true" ? true : false,
            iStreamType = parseInt($("#record_streamtype").val(), 10),
            szStartTime = $("#starttime").val(),
            szEndTime = $("#endtime").val();
        console.log(szDeviceIdentify, '----搜索录像时的IP和端口-----');
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

                    for (var i = 0, nLen = $(xmlDoc).find("searchMatchItem").length; i < nLen; i++) {
                        var szPlaybackURI = $(xmlDoc).find("playbackURI").eq(i).text();
                        if (szPlaybackURI.indexOf("name=") < 0) {
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
                    for (var i = 0; i < iLength; i++) {
                        var szPlaybackURI = $(xmlDoc).find("playbackURI").eq(i).text();
                        if (szPlaybackURI.indexOf("name=") < 0) {
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
                } else if ("NO MATCHES" === $(xmlDoc).find("responseStatusStrg").eq(0).text()) {
                    setTimeout(function () {
                        showOPInfo(szDeviceIdentify + " 没有录像文件！");
                        alert("没有录像文件，请再次点击搜索");
                        // // var szDeviceIdentify = window.top.sessionStorage.getItem("nvrip")+'_80',
                        // var szIPs = window.top.sessionStorage.getItem("nvrip"),
                        //     szPorts = "80",
                        //     szUsername = $("#username").val(),
                        //     szPassword = $("#password").val();

                        // if ("" == szIPs || "" == szPorts) {
                        //     return;
                        // }

                        // var szDeviceIdentifys = szIPs + "_" + szPorts;

                        // var iRet = WebVideoCtrl.I_Login(szIPs, 1, szPorts, szUsername, szPassword, {
                        //     success: function (xmlDoc) {            
                        //         var szDeviceIdentify = szDeviceIdentifys
                        //         showOPInfo(szDeviceIdentify + " 登录成功！---------21");
                        //         console.log(szDeviceIdentify + " 登录成功！-----")
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

                        // var szDeviceIdentify = $("#ip").val(),
                        //     iChannelID = 2,
                        //     bZeroChannel = $("#channels option").eq($("#channels").get(0).selectedIndex).attr("bZero") == "true" ? true : false,
                        //     iStreamType = parseInt($("#record_streamtype").val(), 10),
                        //     szStartTime = $("#starttime").val(),
                        //     szEndTime = $("#endtime").val();

                        // console.log(szDeviceIdentify,iChannelID,bZeroChannel,iStreamType,'---------903');

                        // if (null == szDeviceIdentify) {
                        //     return;
                        // }

                        // if (bZeroChannel) {// 零通道不支持录像搜索
                        //     return;
                        // }

                        // if (0 == iType) {// 首次搜索
                        //     $("#searchlist").empty();
                        //     g_iSearchTimes = 0;
                        // }

                        // WebVideoCtrl.I_RecordSearch(szDeviceIdentify, iChannelID, szStartTime, szEndTime, {
                        //     iStreamType: iStreamType,
                        //     iSearchPos: g_iSearchTimes * 40,
                        //     success: function (xmlDoc) {
                        //         console.log(xmlDoc);
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
                        //             showOPInfo(szDeviceIdentify + " 有没有录像文件！");
                        //             g_iSearchTimes++;
                        //             clickRecordSearch(1);// 继续搜索
                        //         } else if ("OK" === $(xmlDoc).find("responseStatusStrg").eq(0).text()) {
                        //             var iLength = $(xmlDoc).find("searchMatchItem").length;
                        //             for(var i = 0; i < iLength; i++) {
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
                        //             showOPInfo(szDeviceIdentify + " 搜索录像文件成功！");
                        //         }
                        //     },
                        // })
                    }, 50);
                }
            },
            error: function (status, xmlDoc) {
                showOPInfo(szDeviceIdentify + " 搜索录像文件失败！", status, xmlDoc);
            }
        });
    }, 500);
}

// 开始回放 
function clickStartPlayback() {
    if (cameraNvr == "1") {
        clickNVR();
    }
    setTimeout(function () {
        var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
            szDeviceIdentify = $("#ip").val(),
            iRtspPort = parseInt($("#rtspport").val(), 10),
            iStreamType = parseInt($("#record_streamtype").val(), 10),
            bZeroChannel = $("#channels option").eq($("#channels").get(0).selectedIndex).attr("bZero") == "true" ? true : false,
            iChannelID = parseInt(playbackchannel, 10),
            szStartTime = $("#starttime").val(),
            szEndTime = $("#endtime").val(),
            szInfo = "",
            bChecked = $("#transstream").prop("checked"),
            iRet = -1;

        console.log(szDeviceIdentify, '--------回放时需要的IP---------');
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
                        alert(szDeviceIdentify + " " + szInfo);
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
                        alert(szDeviceIdentify + " " + szInfo);
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
    }, 500)
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
    console.log(playbackchannel, '----daofang----');
    var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
        szDeviceIdentify = $("#ip").val(),
        iRtspPort = parseInt($("#rtspport").val(), 10),
        iStreamType = parseInt($("#record_streamtype").val(), 10),
        bZeroChannel = $("#channels option").eq($("#channels").get(0).selectedIndex).attr("bZero") == "true" ? true : false,
        iChannelID = parseInt(playbackchannel, 10),
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
            alert(szDeviceIdentify + " 已下载！");
        } else if (33 == iErrorValue) {
            alert(szDeviceIdentify + " 空间不足！");
        } else {
            alert(szDeviceIdentify + " 下载失败！");
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

            clickGetLocalCfg();
            var downaddress = $("#downloadPath").val();
            alert("录像下载完成！该文件在" + downaddress + "文件夹下面");
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
                setTimeout(function () { reconnect(szDeviceIdentify); }, 5000);
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
    if (null == szXml || "" == szXml) {
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

    WebVideoCtrl.I_SendHTTPRequest(szIP, "/ISAPI/System/Video/inputs/channels/1/overlays/text/1", {
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

    WebVideoCtrl.I_SendHTTPRequest(szIP, "/ISAPI/System/Video/inputs/channels/1/overlays/text/1", {
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