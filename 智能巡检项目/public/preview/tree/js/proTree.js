(function($) {
	var Tree = function(element, options) {
		// console.log(element,options);
		this.element = element;
		//json数组
		this.JSONArr = options.arr;
		//单个文件图标
		this.simIcon = options.simIcon || "";
		//多个文件打开图标
		this.mouIconOpen = options.mouIconOpen || "fa fa-folder-open-o";
		//多个文件关闭图标
		this.mouIconClose = options.mouIconClose || "fa fa-folder-o";
		//回调函数
		this.callback = options.callback || function() {};
		//初始化
		this.init();

	}
	//初始化事件
	Tree.prototype.init = function() {
		//事件
		this.JSONTreeArr = this.proJSON(this.JSONArr, null);
		this.treeHTML = this.proHTML(this.JSONTreeArr);
		this.element.append(this.treeHTML);
		this.bindEvent();
	}
	//生成树形JSON数据
	Tree.prototype.proJSON = function(oldArr, parentId) {
		// console.log(oldArr,parentId);
		// var newArr = [];
		// var self = this;
		// oldArr.map(function(item) {
		// 	console.log(item);
		// 	if(item.parentId == parentId) {
		// 		var obj = {
		// 			areaId: item.areaId,
		// 			areaName: item.areaName
		// 		}
		// 		var children = self.proJSON(oldArr, item.areaId);
		// 		if(children.children > 0) {
		// 			obj.children = children
		// 		}
		// 		newArr.push(obj)
		// 	}

		// })
		return oldArr;

	};
	//生成树形HTML
	Tree.prototype.proHTML = function(arr) {
		var ulHtml = "<ul class='menuUl'>";
		var self = this;
		arr.map(function(item) {
			// console.log(item.cameraFlag,"+++++++++++++生成树形HTML")
			var lihtml = "<li>";
			if(item.children && item.children.length > 0) {
				lihtml += "<i ischek='true' class='" + self.mouIconOpen + "'></i>" +
					"<span id='" + item.id + "' value='"+ item.id +"' cameraFlag='"+item.cameraFlag+"'><i id='ziDiva' style='display:none'>"+ item.ip +"</i>" + item.name + "</span>";
				var _ul = self.proHTML(item.children);
				lihtml += _ul + "</li>";
			} else {
				lihtml += "<i class='" + self.simIcon + "'></i>" +
					"<span id='" + item.id + "'value='"+ item.id +"' cameraFlag='"+item.cameraFlag+"'>" + item.name + "</span>";
			}
			ulHtml += lihtml;
		})
		ulHtml += "</ul>";
		return ulHtml;
	}
	Tree.prototype.bindEvent = function() {
		var self = this;
		this.element.find(".menuUl li i").click(function() {
			var ischek = $(this).attr("ischek");
			if(ischek == 'true') {
				var menuUl = $(this).closest("li").children(".menuUl");
				$(this).removeClass(self.mouIconOpen).addClass(self.mouIconClose)
				menuUl.hide();
				$(this).attr("ischek", 'false');
			} else if(ischek == 'false') {
				var menuUl = $(this).closest("li").children(".menuUl");
				menuUl.show();
				$(this).removeClass(self.mouIconClose).addClass(self.mouIconOpen)
				$(this).attr("ischek", 'true')
			}
		});

		this.element.find(".menuUl li span").click(function() {                                 
			// var aaaa = document.getElementById('ziDiv').innerText
			console.log("点击点击点击",$(this).attr("cameraFlag"));
			var isAreaFlag = $(this).attr("cameraFlag");
			var id = $(this).attr("id"); 
			var name = $(this).text();
			var childip = $(this).context.parentNode.parentNode.parentNode.children[1].children[0].innerText;
			self.callback(id, name, childip,isAreaFlag)
		})
	}
	//给jquery对象拓展一个树形对象
	$.fn.extend({
		ProTree: function(options) {
			return new Tree($(this), options)
		}
	})
})(jQuery);