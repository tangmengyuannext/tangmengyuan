var WebVideoCtrl = (function(e)
{
	//�¼���Ӧ�����б�
	var eventHandler = {
		selectDir:function(path){
		}
	}
	
	//�������
	var pluginObject;
	//��ʼ���ɹ�����
	var initSuccess;
	//�¼��ź��б�
	var SignalMap = new Map();
	//���ش���ѡ���ź�
	SignalMap.put("SelectedView",new Array());
	//�豸��Ϣ��
	var deviceInfoMap = new Map();
	//������Ϣ��
	var playerInfoMap = new Map();
	//����Э��,����,���
	var sProtocol;
	
	//�¼����?��
	function handleEvent(message){
		var messageObject = $.parseJSON(message);
		if(("event" in  messageObject))
		{
			var eventType = messageObject["event"];
			//��ݲ�ͬ���¼�����������
			if("SelectedDirectory" == eventType){
				//�������ͺ�·��
				var pathType = messageObject["params"]["Type"];
				var pathName = messageObject["params"]["PathName"];
				//����·��
				pluginObject.SetStoragePath(pathType,pathName);
				eventHandler.selectDir(pathName);
			}else if("SelectedView" == eventType){
				var callBackList = SignalMap.get("SelectedView");
				//���ûص�����
				for(var i = 0; i < callBackList.length; i++){
					callBackList[i](messageObject["params"]["nodeIndex"],messageObject["params"]["viewIndex"],messageObject["params"]["winID"]);
				}
			}
		}
	}
	
	/**
	*@description �жϲ���Ƿ�װ
	*@return Boolean
	*/
	var checkPluginInstall = function()
	{
		var e = false;
		if(browser().msie)
		{
			try{
				new ActiveXObject("WebActiveX.Plugin.4.0.0.0");
				e = true;
			}
			catch(n)
			{
				e = false;
			}
		}
		else 
		{
			for(var r=0,s=navigator.mimeTypes.length;s>r;r++)
			{
				if("application/media-plugin-version-4.0.0.0"==navigator.mimeTypes[r].type.toLowerCase())
				{
					e = true;
					break;
				}
			}
		}
		return e;
	};
	
	//������������
	var browser = function(){
		var e=/(chrome)[ \/]([\w.]+)/,
		t=/(safari)[ \/]([\w.]+)/,
		n=/(opera)(?:.*version)?[ \/]([\w.]+)/,
		r=/(msie) ([\w.]+)/,
		s=/(trident.*rv:)([\w.]+)/,
		o=/(mozilla)(?:.*? rv:([\w.]+))?/,
		i=navigator.userAgent.toLowerCase(),
		a=e.exec(i)||t.exec(i)||n.exec(i)||r.exec(i)||s.exec(i)||i.indexOf("compatible")<0&&o.exec(i)||["unknow","0"];
		a.length>0&&a[1].indexOf("trident")>-1&&(a[1]="msie");
		var c={};
		return c[a[1]]=!0,c.version=a[2],c
	}
	
	/**
	*@description ������
	*@param{String} sContainerID ���������ID
	*@param{Num}    iWidth       ����Ŀ�
	*@param{Num}    iHeight      ����ĸ�
	*@return void
	*/
	function insertPluginObject(sContainerID,iWidth,iHeight){
		//�����IE������Ļ�
		if (browser().msie) {
				var sSize = " width=" + "\"" + iWidth.toString() + "\"" + " height=" + "\"" + iHeight.toString() + "\"";
				var sHtmlValue = "<object classid=\"CLSID:240999BE-CBAD-44F7-A19D-DA415C8A5B58\" codebase=\"webrec.cab\""  + sSize + "id=\"dhVideo\">" + "</object>"
				$("#" + sContainerID).html(sHtmlValue);
		} else {
			var sSize = " width=" + "\"" + iWidth.toString() + "\"" + " height=" + "\"" + iHeight.toString() + "\"";
			var sHtmlValue = "<object type=\"application/media-plugin-version-4.0.0.0\"" + sSize + "id=\"dhVideo\">" + "</object>";
			$("#" + sContainerID).html(sHtmlValue);
		}
		return true;
	}
	
	/**
	*@description �����¼��ź�
	*@param{String} event  �¼����
	*@param{Function} cb �¼��ص�����
	*/
	function registerEvent(event,cb){
		var callBackList = SignalMap.get(event);
		if(typeof callBackList != "undefined"){
			callBackList.push(cb)
		}
		return true;
	}

	/**
	*@description ��ʼ�����
	*@param{String} sp    Э������
	*@param{Function} fnCallback ��ʼ���ɹ���Ļص�����
	*/
	var initPlugin = function(sp,fnCallback){
		initSuccess = fnCallback;
		sProtocol = sp;
		checkReady();
		return true;
	}
	
	function checkReady(){
	     pluginObject = document.getElementById("dhVideo");
         try {
				//��ò��
				pluginObject = document.getElementById("dhVideo");
				//�����¼�
				pluginObject.AddEventListener("message",handleEvent);
				//�����IE������Ļ����������ַ�����
				if(browser().msie)
				{
					pluginObject = pluginObject.CreatePlugin();
				}
				//���ò�Ʒ��Ϣ
				pluginObject.SetProductType("Customer");
				//����ͨ��Э��
				pluginObject.SetNetProtocolType(sProtocol);
				//���������ʼ������ź�
				pluginObject.NoticeInitializedSignal();
				//�ص�
				initSuccess();
            } catch (e){
				setTimeout(checkReady,500);
         }
	}
	
	/**
	*@description ����������Ϣ
	*@param{String} ������Ϣ
	*@return String ����������Ϣ
	*/
	var parseError = function(errorInfo){
		var errorObject = $.parseJSON(errorInfo);
		if(("error" in  errorObject))
		{
			return errorObject["error"];
		}
	};

	/**
	*@description ������Ƶ����
	*@param{Num}  iNum Ҫ�����Ĵ�����Ŀ
	*@return Boolean
	*/
	var createMultiNodeDisplay = function(iNum){
		pluginObject.CreateMultiNodeDisplay(iNum);
	};
	
	/**
	*@description ���ô��ڵ���ʾ��Ŀ
	*@param{Num}  iNum Ҫ��ʾ����Ŀ
	*@return Boolean
	*/
	var setSplitNum = function(iNum){
		pluginObject.SetSplitNum(iNum * iNum);
	}
	
	/**���Ӧ�ô���
	*@description ���Ӧ�ô�����
	*@param{String} name �������
	*@return ������
	*/
	var getLastError = function(name){
		return pluginObject.GetLastError(name);
	}
	
	/**��¼�豸
	*@description ��ʼ�����
	*@param{String} sIp         �豸IP
	*@param{Num} iPort          ����˿�
	*@param{String} sUserName   �û���
	*@param{String} sPassword   ����
	*@param{Num} iRtspPort      Rtsp�˿�
	*@param{Num} iProtocol      ͨ��Э��  
	*@param{Function} fnSuccess ��¼�ɹ���Ļص�����
	*@param{Function} fnFail    ��¼ʧ�ܺ�Ļص�����
	*/
	var login = function(sIp,iPort,sUserName,sPassword,iRtspPort,iProtocol,fnSuccess,fnFail){;
		var ret = pluginObject.LoginDevice(sIp,iPort,sUserName,sPassword,iRtspPort,iProtocol);
		if(ret > 0){
			//�����豸��Ϣ
			var channelNum = pluginObject.GetChannelTotal(ret);
			insertDeviceInfo(sIp,iPort,sUserName,sPassword,iRtspPort,iProtocol,channelNum,ret);
			fnSuccess(sIp,ret);
		}
		else if(ret <= 0){
			//��ô�����Ϣ
			var errorInfo = pluginObject.GetLastError("LoginDevice");
			//������������
			fnFail(ret,parseError(errorInfo));
		}
		else if(typeof ret == "undefined")
		{
			fnFail(-19,"invalit interface");
		}
		return ret;
	}
	
	/**
	*@description ����һ���豸��Ϣ
	*@param{Num} deviceID     �豸ID
	*@param{String} ip        �豸IP
	*@param{Num} port         ����˿�
	*@param{String} userName  �û���
	*@param{String} password  ����
	*@param{Num} rtspPort     rtsp�˿�
	*@param{Num} channelNum   ͨ������
	*@param{Num} deviceID     �豸ID
	*/
	function insertDeviceInfo(ip,port,userName,password,rtspPort,protocol,channelNum,deviceID)
	{
		var info = {
			ip:ip,
			port:port,
			userName:userName,
			password:password,
			rtspPort:rtspPort,
			channelNum:channelNum,
			deviceID:deviceID,
			protocol:protocol
		}
		deviceInfoMap.put(ip,info);
	}
	
	/**
	*@description ����豸��Ϣ
	*/
	function getDeviceInfo(ip)
	{
		var info = deviceInfoMap.get(ip);
		return info;
	}
	
	/**
	*@description ����һ��������
	*@param{Num} iWinID       ����ID
	*@param{Num} iDeviceID    �豸ID
	*@param{Num} iPlayerID    ������ID
	*@param{string} sIP       �豸IP
	*@param{Num} iProtocol    Э������
	*@param{Num} iChannle     ͨ����
	*@param{Num} iStreamType  ��������
	*@param{Num} iPlayerType  ���������� 0:ʵʱ����  1:����ط�
	*/
	function insertPlayer(iWinID,iDeviceID,iPlayerID,sIP,iProtocol,iChannle,iStreamType,iPlayerType)
	{
		var info = {
			winID:iWinID,
			deviceID:iDeviceID,
			ip:sIP,
			channle:iChannle,
			streamType:iStreamType,
			protocol:iProtocol,
			playerID:iPlayerID,
			type:iPlayerType
		}
		playerInfoMap.put(iWinID,info);
	}
	
	
	/**
	*@description ���ָ���豸��ͨ������
	*@param{Num} deviceID  �豸ID
	*/
	var getChannelNumber = function(deviceID){
		return pluginObject.GetChannelTotal(deviceID);
	}
	
	/**
	*@description �ǳ��豸
	*@param{String} ip  
	*@return Boolean
	*/
	var logout = function(ip){
		var info = WebVideoCtrl.getDeviceInfo(ip);
		if(typeof info != "undefined")
		{
			if(pluginObject.LogoutDevice(info.deviceID)){
				//�Ƴ��豸
				deviceInfoMap.remove(ip);
				return true;
			}
		}
		return false;
	}
	
	/**
	*@description ѡ�е���Ƶ�����ϲ�����Ƶ
	*@param{String} sIP  
	*@param{Num} iChannel
	*@param{Num} iStream 
	*@param{Function} fnSuccess 
	*@param{Function} fnFail 
	*@return Num
	*/
	var connectRealVideo = function(sIP,iChannel,iStream,fnSuccess,fnFail){
		var iNodeIndex = pluginObject.GetSelectedNodeIndex();
		var iViewIndex = pluginObject.GetSelectedViewIndex();
		var iWinID = pluginObject.GetSelectedWinID();
		var iRet = -6;
		//����豸��Ϣ
		var ODeviceInfo = getDeviceInfo(sIP);
		if(typeof ODeviceInfo == "undefined"){
			fnFail(iRet,"device no login");
			return iRet;
		}
		iRet = pluginObject.ConnectRealVideo(ODeviceInfo.deviceID,iNodeIndex,iViewIndex,iChannel - 1,iStream,ODeviceInfo.protocol);
		if(iRet > 0){
			//���ųɹ�
			if(typeof fnSuccess != "undefined"){
				fnSuccess(iRet);
				insertPlayer(iWinID,ODeviceInfo.deviceID,iRet,ODeviceInfo.ip,ODeviceInfo.protocol,iChannel,iStream,0);
			};
		}
		else if(iRet <= 0){
			if(typeof fnSuccess != "undefined"){
				//��ô�����Ϣ
				var errorInfo = pluginObject.GetLastError("ConnectRealVideo");
				//������������
				fnFail(iRet,parseError(errorInfo));
			};
		}
		return iRet;
	}
	
	//���ѡ�е���ͼ���
	var getSelectedWinIndex = function(){
		return pluginObject.GetSelectedViewIndex();
	}
	
	/**
	*@description �رյ�ǰѡ�д��ڵĲ�����
	*/
	var closePlayer = function(){
		//��õ�ǰѡ�еĴ���ID
		var iWinID = getSelectedWinID();
		//��ȡ������ID
		var oInfo = playerInfoMap.get(iWinID);
		if(typeof oInfo != "undefined"){
			pluginObject.ClosePlayer(oInfo.playerID);
			return true;
		}else{
			return true;
		}
	}
	
	/**
	*@description ��ò�������Ϣ
	*@param{Num} iWinID ����ID
	*/
	function getPlayerInfo(iWinID)
	{
		return playerInfoMap.get(iWinID);
	}
	
	
	/**
	*@description ���ѡ�д����ϵĲ�����ID
	*/
	function getSelectedPlayerID()
	{
		var iWinID = WebVideoCtrl.getSelectedWinID();
		var info = playerInfoMap.get(iWinID);
		if(typeof info != "undefined")
		{
			return info.playerID;
		}else{
			return 0;
		}
	}
	
	//�����Խ�
	var startVoiceTalk = function(deviceID,cb){
		var ret = pluginObject.StartIntercom(deviceID);
		if(ret > 0){
			cb.cbSuccess(ret);
		}
		else{
			cb.cbFailed();
		}
	}
	
	//�رնԽ�
	var stopVoiceTalk = function(deviceID){
		pluginObject.StopIntercom(deviceID);
	}
	
	//ѡ��·��
	var selectDirectory = function(type,cb){
		//ע��·��ѡ���¼�
		eventHandler.selectDir = cb.cbSuccess;
		pluginObject.SelectDirectory(type);
	}
	
	/**
	*@description ץȡ��ǰѡ�д����ϲ�����Ƶ��ʵʱͼƬ
	*@param{Num} iFormat �浵ͼƬ�ĸ�ʽ
	*@param{Num} sPath   ͼƬ�Ĵ洢·��
	*@param{Boolean} bOpen   ͼƬ�Ĵ洢·��
	*/
	var crabOnePicture = function(iFormat,sPath,bOpen){
		return pluginObject.CrabOnePicture(iFormat,sPath,bOpen);
	}
	
	/**
	*@description ������ǰѡ�д����ϲ�����Ƶ��¼����
	*@param{Num} iFormat ¼���ʽ
	*@param{Num} sPath   ¼��Ĵ洢·��
	*/
	var startRecordingVideo = function(iFormat,sPath){
		return pluginObject.controlRecordingVideo(sPath,iFormat,true);
	}
	
	//ֹͣ¼��
	var stopRecordingVideo = function(){
		return pluginObject.controlRecordingVideo("",-1,false);
	}
	
	//��������
	var setVolume = function(volume,cb){
		pluginObject.SetVolume(volume)
	}
	
	//������
	var openSound = function(cb){
		pluginObject.ControlAudio(true);
	}
	
	//�ر�����
	var closeSound = function(cb){
		pluginObject.ControlAudio(false);
	}
	
	/**
	*@description �������ӷŴ�
	*/
	var enableEZoom = function(cb){
		return pluginObject.ActiveLocalEnlarge(true);
	}
	
	/**
	*@description �رյ��ӷŴ�
	*/
	var disableEZoom = function(cb){
		return pluginObject.ActiveLocalEnlarge(false);
	}
	
	/**
	*@description �л���ȫ��
	*@param{Boolean} 
	*/
	var setFullscreen = function(){
		pluginObject.SetFullscreen();
		return true;
	}
	
	//����û�·��
	var getUserDirectory = function(){
		return pluginObject.GetUserDirectory();
	}
	
	//���ѡ�еĴ���ID
	var getSelectedWinID = function(){
		return pluginObject.GetSelectedWinID();
	}
	
	/**
	*@description ���Ʋ�����������
	*@param{Num} playerID    ������ID
	*@param{Boolean} enable  �����رձ�־
	*/
	var controlAudio = function(playerID,enable){
		return pluginObject.ControlAudio(playerID,enable);
	}
	
	/**
	*@description �����ƶ�
	*@param{Num} iVerticalSpeed    ��ֱ�ٶ�
	*@param{Num} iLevelSpeed       ˮƽ�ٶ�
	*@param{Boolean} flag  ����ֹͣ��־
	*/
	var moveUpperLeft = function(iVerticalSpeed,iLevelSpeed,flag){
		return pluginObject.MoveUpperLeft(iVerticalSpeed,iLevelSpeed,flag);
	}
	
	/**
	*@description �����ƶ�
	*@param{Num} iVerticalSpeed    ��ֱ�ٶ�
	*@param{Num} iLevelSpeed       ˮƽ�ٶ�
	*@param{Boolean} flag  ����ֹͣ��־
	*/
	var moveUpperRight = function(iVerticalSpeed,iLevelSpeed,flag){
		return pluginObject.MoveUpperRight(iVerticalSpeed,iLevelSpeed,flag);
	}
	
	/**
	*@description �����ƶ�
	*@param{Num} iVerticalSpeed    ��ֱ�ٶ�
	*@param{Num} iLevelSpeed       ˮƽ�ٶ�
	*@param{Boolean} flag  ����ֹͣ��־
	*/
	var moveLowerLeft = function(iVerticalSpeed,iLevelSpeed,flag){
		return pluginObject.MoveLowerLeft(iVerticalSpeed,iLevelSpeed,flag);
	}
	
	/**
	*@description �����ƶ�
	*@param{Num} iVerticalSpeed    ��ֱ�ٶ�
	*@param{Num} iLevelSpeed       ˮƽ�ٶ�
	*@param{Boolean} flag  ����ֹͣ��־
	*/
	var moveLowerRight = function(iVerticalSpeed,iLevelSpeed,flag){
		return pluginObject.MoveLowerRight(iVerticalSpeed,iLevelSpeed,flag);
	}
	
	/**
	*@description ���ƶ�
	*@param{Num} iVerticalSpeed   ��ֱ�ٶ�
	*@param{Boolean} flag         ����ֹͣ��־
	*/
	var moveUpwards = function(iVerticalSpeed,flag){
		return pluginObject.MoveUpwards(iVerticalSpeed,flag);
	}
	
	/**
	*@description ���ƶ�
	*@param{Num} iVerticalSpeed   ��ֱ�ٶ�
	*@param{Boolean} flag         ����ֹͣ��־
	*/
	var moveLower = function(iVerticalSpeed,flag){
		return pluginObject.MoveLower(iVerticalSpeed,flag);
	}
	
	/**
	*@description ���ƶ�
	*@param{Num} iLevelSpeed   ˮƽ�ٶ�
	*@param{Boolean} flag      ����ֹͣ��־
	*/
	var moveLeft = function(iLevelSpeed,flag){
		return pluginObject.MoveLeft(iLevelSpeed,flag);
	}
	
	/**
	*@description ���ƶ�
	*@param{Num} iLevelSpeed   ˮƽ�ٶ�
	*@param{Boolean} flag      ����ֹͣ��־
	*/
	var moveRight = function(iLevelSpeed,flag){
		return pluginObject.MoveRight(iLevelSpeed,flag);
	}
	
	/**
	*@description ʹ��PTZ��λ
	*/
	var enablePTZLocate = function(){
		return pluginObject.ActivePTZLocate(true);
	}
	
	/**
	*@description ��ʹ��PTZ��λ
	*/
	var disablePTZLocate = function(){
		return pluginObject.ActivePTZLocate(true);
	}
	
	/**
	*@description ���Ʊ䱶
	*@param{Num} iSpeed     ����
	*@param{Num} flag      ���ӻ���ٱ�־
	*       - 0:����
	*       - 1:����
	*@param{Boolean} flag1      ����ֹͣ��־
	*/
	var controlZoom = function(iSpeed,flag,flag1){
		return pluginObject.ControlZoom(iSpeed,flag,flag1);
	}
	
	/**
	*@description ���Ʊ佹
	*@param{Num} speed     ����
	*@param{Num} flag      ���ӻ���ٱ�־
	*       - 0:����
	*       - 1:����
	*@param{Boolean} flag1      ����ֹͣ��־
	*/
	var controlFocus = function(speed,flag,flag1){
		return pluginObject.ControlFocus(speed,flag,flag1);
	}
	
	/**
	*@description ���ƹ�Ȧ
	*@param{Num} speed     ����
	*@param{Num} flag      ���ӻ���ٱ�־
	*       - 0:����
	*       - 1:����
	*@param{Boolean} flag1      ����ֹͣ��־
	*/
	var controlAperture = function(speed,flag,flag1){
		return pluginObject.ControlAperture(speed,flag,flag1);
	}
	
	/**
	*@description ��ȡԤ�õ���Ϣ
	*@param{Num} deviceID  �豸ID
	*@param{Num} channel   ͨ����
	*/
	var getPresets = function(deviceID,channel,cb){
		var objID = pluginObject.GetObjectID(deviceID,channel);
		var info = pluginObject.GetPresetInfo(deviceID,objID);
		if(info != ""){
			DemoUI.clearPresets();
			var dataObject = $.parseJSON(info);
			$.each(dataObject,function(i,item){
				cb(item.Index,item.Name);
			});
		}
	}
	
	/**
	*@description ��λ��Ԥ�õ�
	*@param{Num} deviceID  �豸ID
	*@param{Num} channel   ͨ����
	*@param{Num} index     Ԥ�õ����
	*@param{Num} speed     Ԥ�õ����
	*/
	var gotoPreset = function(deviceID,channel,index,speed){
		var objID = pluginObject.GetObjectID(deviceID,channel);
		return pluginObject.GotoPreset(deviceID,objID,index,speed);
	}
	
	/**
	*@description ɾ��Ԥ�õ�
	*@param{Num} deviceID  �豸ID
	*@param{Num} channel   ͨ����
	*@param{Num} index     Ԥ�õ����
	*/
	var removePreset = function(deviceID,channel,index){
		var objID = pluginObject.GetObjectID(deviceID,channel);
		return pluginObject.RemovePreset(deviceID,objID,index);
	}
	
	/**
	*@description ����Ԥ�õ�
	*@param{Num} deviceID  �豸ID
	*@param{Num} channel   ͨ����
	*@param{Num} index     Ԥ�õ����
	*@param{Num} name      Ԥ�õ����
	*/
	var setPreset = function(deviceID,channel,index,name){
		var objID = pluginObject.GetObjectID(deviceID,channel);
		return pluginObject.SetPreset(deviceID,objID,index,name);
	}
	
	/**
	*@description ����������ͳ�Ʋ�ѯ
	*@param{String} sIP  
	*@param{Num} iChannel
	*@param{String} sStartTime 
	*@param{String} sEndTime 
	*@param{Num} iRuleType 
	*@param{Num} iSpan 
	*@param{Num} iMinStayTime 
	*@return Num
	*/
	var startTrafficDataQuery = function(sIP,iChannel,sStartTime,sEndTime,iRuleType,iSpan,iMinStayTime){
		//����豸��Ϣ
		var ODeviceInfo = getDeviceInfo(sIP);
		if(typeof ODeviceInfo == "undefined"){
			return 0;
		}
		return pluginObject.startTrafficDataQuery(ODeviceInfo.deviceID,iChannel,sStartTime,sEndTime,iRuleType,iSpan,iMinStayTime);
	}
	
	/**
	*@description �����Ϣ����
	*@param{Num} iHandle
	*@return Num
	*/
	var getTrafficDataTotalCount = function(iHandle){
		return pluginObject.getTrafficDataTotalCount(iHandle);
	}
	
	/**
	*@description �����Ϣ
	*@param{Num} iHandle
	*@return Num
	*/
	var queryTrafficData = function(iHandle,iBeginIndex,iCount){
		return pluginObject.queryTrafficData(iHandle,iBeginIndex,iCount);
	}
	
	var stopTrafficDataQuery = function(iHandle){
		return pluginObject.stopTrafficDataQuery(iHandle);
	}
	
	return {
		checkPluginInstall:checkPluginInstall,
		browser:browser,
		insertPluginObject:insertPluginObject,
		createMultiNodeDisplay:createMultiNodeDisplay,
		initPlugin:initPlugin,
		setSplitNum:setSplitNum,
		login:login,
		getDeviceInfo:getDeviceInfo,
		logout:logout,
		connectRealVideo:connectRealVideo,
		getChannelNumber:getChannelNumber,
		closePlayer:closePlayer,
		getSelectedPlayerID:getSelectedPlayerID,
		getPlayerInfo:getPlayerInfo,
		getSelectedWinIndex:getSelectedWinIndex,
		startVoiceTalk:startVoiceTalk,
		stopVoiceTalk:stopVoiceTalk,
		selectDirectory:selectDirectory,
		crabOnePicture:crabOnePicture,
		startRecordingVideo:startRecordingVideo,
		stopRecordingVideo:stopRecordingVideo,
		setVolume:setVolume,
		openSound:openSound,
		closeSound:closeSound,
		enableEZoom:enableEZoom,
		disableEZoom:disableEZoom,
		setFullscreen:setFullscreen,
		getUserDirectory:getUserDirectory,
		getSelectedWinID:getSelectedWinID,
		registerEvent:registerEvent,
		controlAudio:controlAudio,
		moveUpperLeft:moveUpperLeft,
		moveUpperRight:moveUpperRight,
		moveLowerLeft:moveLowerLeft,
		moveLowerRight:moveLowerRight,
		moveLeft:moveLeft,
		moveRight:moveRight,
		moveUpwards:moveUpwards,
		moveLower:moveLower,
		enablePTZLocate:enablePTZLocate,
		disablePTZLocate:disablePTZLocate,
		controlZoom:controlZoom,
		controlFocus:controlFocus,
		controlAperture:controlAperture,
		getPresets:getPresets,
		gotoPreset:gotoPreset,
		removePreset:removePreset,
		setPreset:setPreset,
		startTrafficDataQuery:startTrafficDataQuery,
		getTrafficDataTotalCount:getTrafficDataTotalCount,
		queryTrafficData:queryTrafficData,
		stopTrafficDataQuery:stopTrafficDataQuery
	};
	
})(this);

$(function () {
    // ������Ƿ��Ѿ���װ��
    var iRet = WebVideoCtrl.checkPluginInstall();
    if (-1 == iRet) {
        alert("��δ��װ������˫��������Ŀ¼���µ�Package���webplugin.exe���а�װ��");
        return;
    }
});





