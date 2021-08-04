//插件加载完毕后，会执行初始化化操作
$(function () {
	WebVideoCtrl.insertPluginObject("divPlugin",500,300);
	//初始化插件
	WebVideoCtrl.initPlugin("Dahua2",function () {
			//创建视频窗口
			WebVideoCtrl.createMultiNodeDisplay(16);
			//设置视频窗口的显示
			var num = parseInt($("#wndNum").find("option:selected").val());
			//设置窗口分割数
			WebVideoCtrl.setSplitNum(num);
			//注册事件
			WebVideoCtrl.registerEvent("SelectedView",responseSelectedViewSignal);
			//初始化路径
			var szDir = WebVideoCtrl.getUserDirectory();
			var szPath = szDir + "\\" + "LiveRecord";
			$("#LiveRecord").val(szPath);
	
			szPath = szDir + "\\" + "Download";
			$("#Download").val(szPath);
	
			szPath = szDir + "\\" + "LiveSnapshot";
			$("#LiveSnapshot").val(szPath);
	
			szPath = szDir + "\\" + "PlaybackPicPath";
			$("#PlaybackPicPath").val(szPath);
	
			szPath = szDir + "\\" + "PlaybackFilePath";
			$("#PlaybackFilePath").val(szPath);
			$( "#tabs" ).tabs();
			}
	);
	
	$("#closePtzLocate").hide();
	$("#openPtzLocate").show();
});

//视频窗口
/**
*@description 处理窗口切换事件
*@param{Num} iNodeIndex  节点序号
*@param{Num} iViewIndex  视图序号
*@param{Num} iWinID      窗口ID
*/
function responseSelectedViewSignal(iNodeIndex,iViewIndex,iWinID){
	//更新对应播放器的信息
	var playrInfo = WebVideoCtrl.getPlayerInfo(iWinID);
	//更新UI信息
	if(typeof playrInfo != "undefined"){
	//设备信息
		var deviceInfo = WebVideoCtrl.getDeviceInfo(playrInfo.ip);
		if(typeof deviceInfo != "undefined"){
			DemoUI.updateDeviceInfo(playrInfo.ip);
			DemoUI.setCurChannel(playrInfo.channle);
			DemoUI.setCurStreamType(playrInfo.streamType);
		}
	}
}

//显示操作信息
function showOPInfo(szInfo, status, error) {
    var szTip = "<div>" + Foundation.dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss") + " " + szInfo;
	if (typeof status != "undefined") 
	{
		szTip += "(" + status.toString() + ", " + error.toString() + ")";
    }
    szTip += "</div>";
    $("#opinfo").html(szTip + $("#opinfo").html());
}

//窗口切换事件
function changeWndNum(num)
{
	//设置视频窗口的显示
	var num = parseInt($("#wndNum").find("option:selected").val());
	WebVideoCtrl.setSplitNum(num);
}

//设备登录
function clickLogin()
{
	var szIP = $("#loginip").val();
    szPort = $("#port").val() - 0;
    szUsername = $("#username").val();
    szPassword = $("#password").val();
	rtspPort = $("#rtspport").val() - 0;
	protocol = $("#protocolType").val() - 0;
	if ("" == szIP || "" == szPort) {
        return;
    }
	var port = parseInt($("#port").val());
	//判断当前设备是否已经登录
	var deviceInfo = WebVideoCtrl.getDeviceInfo(szIP);
	if(typeof deviceInfo != "undefined"){
		if(WebVideoCtrl.logout(szIP))
		{
			//添加提示
			showOPInfo(szIP + " 登出设备！");
			//删除设备信息
			DemoUI.removeDeviceInfo(szIP);
		}
	}
	WebVideoCtrl.login(szIP,port,szUsername,szPassword,rtspPort,protocol,
			function(sIp,iDeviceID){
				showOPInfo(sIp + " 登录成功！");
				//插入设备
				DemoUI.addDeviceIP(sIp);
				//获得通道号
				var channelNum = WebVideoCtrl.getChannelNumber(iDeviceID);
				//更新通道数据
				DemoUI.modifyChannelList(channelNum);
			},
			function(iErrorCode,sError){
				showOPInfo(szIP + " 登录失败！", iErrorCode, sError);
		}
	);
}

function switchDeviceInfo(ip)
{
	DemoUI.updateDeviceInfo(ip);
}

function clickLogout()
{
	//获取当前选中的
	var ip = DemoUI.getCurDeviceIP();
	if(WebVideoCtrl.logout(ip))
	{
		//添加提示
		showOPInfo(ip + " 登出设备！");
		//删除设备信息
		DemoUI.removeDeviceInfo(ip);
	}
}

function changeProtocol(protocol){
	//获得当前的协议类型
	var protocol = parseInt($("#protocolType").find("option:selected").val());
	/**
	//获得当前的设备信息
	var ip = DemoUI.getCurDeviceIP();
	//获得设备信息
	var deviceInfo = WebVideoCtrl.getDeviceInfo(ip);
	if(typeof deviceInfo != "undefined")
	{
		//如果协议切换
		if(protocol != deviceInfo.protocol){
			//登出设备
			if(WebVideoCtrl.logout(ip))
			{
				//添加提示
				showOPInfo(ip + " 登出设备！");
				//删除设备信息
				DemoUI.removeDeviceInfo(ip);
			}
			clickLogin();
		}
	}
	**/
}

function clickStartRealPlay(){
	//获得当前选中的设备IP
	var sIP = DemoUI.getCurDeviceIP();
	//获得通道号
	var iChannel = $("#channels").val() - 0;
	//获得码流类型
	var iStreamType = parseInt($("#streamtype").val(), 10); 
	WebVideoCtrl.connectRealVideo(sIP,iChannel,iStreamType,function(iPlayerID){
					showOPInfo(sIP + " 通道:"+ iChannel.toString() + " 实时监视打开成功");
				},
				function(status,error){
					showOPInfo(sIP + " 通道:"+ iChannel.toString() + " 实时监视打开失败", status, error);
				}
	);

}

function changeStreamType(streamtype){
	//获得播放器信息
	if(0 != WebVideoCtrl.getSelectedPlayerID()){
		clickStartRealPlay();
	}
}

//关闭选中窗口的实时监视
function clickStopRealPlay(){
	WebVideoCtrl.closePlayer();
}

//开启对讲
function clickStartVoiceTalk(){
	//获得设备信息
	var szIP = $("#loginip").val();
	var info = g_deviceInfo.get(szIP);
	if(typeof info != "undefined"){
		WebVideoCtrl.startVoiceTalk(info.deviceID,{
				cbSuccess:function(){
					showOPInfo(szIP + " 语音对讲打开成功");
				},
				cbFailed:function(){
					showOPInfo(szIP + " 语音对讲打开失败");
				}
			}
		)
	}
	
}

//关闭对讲
function clickStopVoiceTalk(){
	//获得设备信息
	var szIP = $("#loginip").val();
	var info = g_deviceInfo.get(szIP);
	if(typeof info != "undefined"){
		WebVideoCtrl.stopVoiceTalk(info.deviceID);
	}
}

// 打开选择框
function clickOpenFileDlg(id) {
    WebVideoCtrl.selectDirectory(id,{
			cbSuccess:function(path){
					    if (path != -1 && path != "" && path != null) {
							$("#" + id).val(path);
						}
				}
		}
	);
}

function clickSetVolume(){
	//设置选中窗口的音量
	WebVideoCtrl.setVolume(parseInt($("#volume").val(), 10),{
			cbSuccess:function(winIndex){
			},
			cbFailed:function(winIndex){
			}
		}
	);
}

function clickOpenSound(){
	WebVideoCtrl.openSound({
			cbSuccess:function(winIndex){
			},
			cbFailed:function(winIndex){
			}
		}
	);
}

function clickCloseSound(){
	WebVideoCtrl.closeSound({
			cbSuccess:function(winIndex){
			},
			cbFailed:function(winIndex){
			}
		}
	);
}

function clickEnableEZoom(){
	if(WebVideoCtrl.enableEZoom()){
		showOPInfo("电子放大开启成功！！！");
	}else{
		showOPInfo("电子放大开启失败！！！");
	}
}

function clickDisableEZoom(){
	if(WebVideoCtrl.disableEZoom()){
		showOPInfo("电子放大关闭成功！！！");
	}else{
		showOPInfo("电子放大关闭失败！！！");
	}
}

function clickFullScreen(){
	WebVideoCtrl.setFullscreen();
}

function clickStartVoiceTalk(){
}

function clickOpenSound(){
	var winID = WebVideoCtrl.getSelectedWinID();
	var playerID = PlayerMgr.getPlayerID(winID);
	if((playerID > 0) && WebVideoCtrl.controlAudio(playerID,true)){
		showOPInfo("播放器: [" + winID.toString() + ","+ playerID.toString() + "]" + "打开声音成功！");
	}else{
		showOPInfo("播放器: [" + winID.toString() + ","+ playerID.toString() + "]" + "打开声音失败！");
	}
}

function clickCloseSound(){
	var winID = WebVideoCtrl.getSelectedWinID();
	var playerID = PlayerMgr.getPlayerID(winID);
	if((playerID > 0) && WebVideoCtrl.controlAudio(playerID,false)){
		showOPInfo("播放器: [" + winID.toString() + ","+ playerID.toString() + "]" + "关闭声音成功！");
	}else{
		showOPInfo("播放器: [" + winID.toString() + ","+ playerID.toString() + "]" + "关闭声音失败！");
	}	
}

function clickCapturePic(){
	var path = $("#LiveSnapshot").val();
	var format = $("#captureFileFormat").val() - 0;                 
	if(WebVideoCtrl.crabOnePicture(format,path,false)){
		showOPInfo("抓图成功,存储路径为:"+ path);
	}else{
		showOPInfo("抓图失败！！！");
	}
}

function clickStartRecord(){
	var path = $("#LiveRecord").val();                
	if(WebVideoCtrl.startRecordingVideo(0,path)){
		showOPInfo("开启录像成功,存储路径为:"+ path);
	}else{
		showOPInfo("开启录像失败！！！");
	}
}

function clickStopRecord(){                
	if(WebVideoCtrl.stopRecordingVideo()){
		showOPInfo("关闭录像成功。");
	}else{
		showOPInfo("关闭录像失败！！！");
	}
}

function mouseUPLeftPTZControl(flag){
	//获得移动速度
	var speed = parseInt($("#ptzspeed").val(), 10)
	WebVideoCtrl.moveUpperLeft(speed,speed,flag);
}

function mouseUpPTZControl(flag){
	var speed = parseInt($("#ptzspeed").val(), 10)
	WebVideoCtrl.moveUpwards(speed,flag);
}

function mouseUPRightPTZControl(flag){
	//获得移动速度
	var speed = parseInt($("#ptzspeed").val(), 10)
	WebVideoCtrl.moveUpperRight(speed,speed,flag);
}

function mouseLefPTZControl(flag){
	var speed = parseInt($("#ptzspeed").val(), 10)
	WebVideoCtrl.moveLeft(speed,flag);
}

function mouseRightPTZControl(flag){
	//获得移动速度
	var speed = parseInt($("#ptzspeed").val(), 10)
	WebVideoCtrl.moveRight(speed,flag);
}

function mouseDownLeftPTZControl(flag){
	//获得移动速度
	var speed = parseInt($("#ptzspeed").val(), 10)
	WebVideoCtrl.moveLowerLeft(speed,speed,flag);
}

function mouseDownRightPTZControl(flag){
	//获得移动速度
	var speed = parseInt($("#ptzspeed").val(), 10)
	WebVideoCtrl.moveLowerRight(speed,speed,flag);
}

function mouseDownPTZControl(flag){
	var speed = parseInt($("#ptzspeed").val(), 10)
	WebVideoCtrl.moveLower(speed,flag);
}

function openPtzLocate(){
	if(WebVideoCtrl.enablePTZLocate()){
		//隐藏开启按钮
		$("#openPtzLocate").hide();
		//显示关闭按钮
		$("#closePtzLocate").show();
	}
}

function closePtzLocate(){
	WebVideoCtrl.disablePTZLocate(false);
	$("#closePtzLocate").hide();
	$("#openPtzLocate").show();
}

function PTZZoomout(flag){
	var speed = parseInt($("#ptzspeed").val(), 10)
	WebVideoCtrl.controlZoom(speed,1,flag);
}

function PTZZoomIn(flag){
	var speed = parseInt($("#ptzspeed").val(), 10)
	WebVideoCtrl.controlZoom(speed,0,flag);
}

function PTZFocusIn(flag){
	var speed = parseInt($("#ptzspeed").val(), 10)
	WebVideoCtrl.controlFocus(speed,0,flag);
}

function PTZFoucusOut(flag){
	var speed = parseInt($("#ptzspeed").val(), 10)
	WebVideoCtrl.controlFocus(speed,1,flag);
}

function PTZIrisIn(flag){
	//获得移动速度
	var speed = parseInt($("#ptzspeed").val(), 10)
	WebVideoCtrl.controlAperture(speed,0,flag);
}

function PTZIrisOut(flag){
	var speed = parseInt($("#ptzspeed").val(), 10)
	WebVideoCtrl.controlAperture(speed,1,flag);
}

function GetPresets(){
	//获得选中的窗口ID
	var winID = WebVideoCtrl.getSelectedWinID();
	//获得播放器信息
	var player = PlayerMgr.getPlayerInfo(winID);
	if(typeof player == "undefined")
	{
		showOPInfo("播放器信息有误！！！");
	}else{
		//设备ID
		var deviceID = player.deviceID;
		//通道号
		var channel = player.channle;
		WebVideoCtrl.getPresets(deviceID,channel,
		function(index,name){
			showOPInfo("获取预置点成功！！！");
			var subNode = "<option value=" + index.toString() + ">" + name + "</option>"
			$("#presetList").append(subNode);
		}
		);
		$('#presetList option:last').attr('selected','selected');
		
	}
}

function GotoPreset(){
	//获得选中的窗口ID
	var winID = WebVideoCtrl.getSelectedWinID();
	//获得播放器信息
	var player = PlayerMgr.getPlayerInfo(winID);
	if(typeof player == "undefined")
	{
		showOPInfo("播放器信息有误！！！");
	}else{
		//设备ID
		var deviceID = player.deviceID;
		//通道号
		var channel = player.channle;
		//获得预置点序号
		var index = parseInt($("#presetList").val(), 10);
		WebVideoCtrl.gotoPreset(deviceID,channel,index,0);
		
	}
}

function RemovePreset(){
	//获得选中的窗口ID
	var winID = WebVideoCtrl.getSelectedWinID();
	//获得播放器信息
	var player = PlayerMgr.getPlayerInfo(winID);
	if(typeof player == "undefined")
	{
		showOPInfo("播放器信息有误！！！");
	}else{
		//设备ID
		var deviceID = player.deviceID;
		//通道号
		var channel = player.channle;
		//获得预置点序号
		var index = parseInt($("#presetList").val(), 10);
		if(WebVideoCtrl.removePreset(deviceID,channel,index)){
			$("#presetList" + " option[value='" + index.toString() + "']").remove();
			$("#presetList option:last").attr("selected","selected");
		}
		
	}
}

function SetPreset(){
	//获得选中的窗口ID
	var winID = WebVideoCtrl.getSelectedWinID();
	//获得播放器信息
	var player = PlayerMgr.getPlayerInfo(winID);
	if(typeof player == "undefined")
	{
		showOPInfo("播放器信息有误！！！");
	}else{
		//设备ID
		var deviceID = player.deviceID;
		//通道号
		var channel = player.channle;
		//获得预置点长度
		var length = $("#presetList option").length;
		var name = "预置点" + (length + 1).toString();
		WebVideoCtrl.setPreset(deviceID,channel,length + 1,name);
	}
}

function clickStartTrafficDataQuery(){
	//获得当前选中的设备IP
	var sIP = DemoUI.getCurDeviceIP();
	//获得通道号
	var iChannel = $("#channels").val() - 0;
	var startTime = $("#humanFlowStarttime").val();
	var endTime = $("#humanFlowEndtime").val();
	var ruleType = parseInt($("#humanFlowRule").val(), 10);
	var span = parseInt($("#humanFlowGranularity").val(), 10);
	var minStayTime = parseInt($("#humanFlowMinStayTime").val(), 10); 
	var handle = WebVideoCtrl.startTrafficDataQuery(sIP,0,startTime,endTime,ruleType,span,minStayTime);
	if(handle > 0){
		$("#humanFlowQueryHandle").val(handle.toString());
	}
}

function clickGetTrafficDataTotalCount(){
	var handle = parseInt($("#humanFlowQueryHandle").val(), 10);
	var ret = WebVideoCtrl.getTrafficDataTotalCount(handle);
	if(ret >= 0){
		$("#humanFlowInfoCount").val(ret.toString());
	}
}

function clickQueryTrafficData(){
	var handle = parseInt($("#humanFlowQueryHandle").val(), 10);
	var beginIndex = 0;
	var total = parseInt($("#humanFlowInfoCount").val(), 10);
	var ret = WebVideoCtrl.queryTrafficData(handle,beginIndex,total);
	alert(ret);
}

function clickStopTrafficDataQuery(){
	var handle = parseInt($("#humanFlowQueryHandle").val(), 10);
	WebVideoCtrl.stopTrafficDataQuery(handle);
	$("#humanFlowQueryHandle").val("");
	$("#humanFlowInfoCount").val("");
}














