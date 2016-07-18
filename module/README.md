#全局配置
	CONFIG  = require('../../config.js')    作为全局配置

#Node 模块结构
	handler.js      负责所有业务的处理
	controller.js   负责定义接口，访问路径，Web Socket 数据通信主题
	model.js        负责访问数据库
	tpl.js         负责定义页面模板
	admin.tpl.js   负责定义后台管理模块的页面模板
	error.js        负责定义该模块错误类型
	
#接口数据传递
	所有接口的数据传递都是以 Promise 对象的方式传递的

#数据通信
	module/data     系统内部数据接口
	module/sub/data 系统内部数据接口
                  
##JSON 数据格式
	{
		msg: ''     // Done || 错误信息
		, data: []  // 数据集合
		, info: {}  // 全局信息
	}

##Web Socket 通信数据格式
	{
		topic: ''   // 通信主题
		, msg: ''   // Done || 错误信息
		, data: []  // 数据集合
		, info: {}  // 全局信息
	}

##API 接口
	data/   外部接口，统一为 jsonp 格式调用，接受函数名变量 callback
	有 callback 参数时
	callback({
		msg: ''     // Done || 错误信息
		, data: []  // 数据集合
	})
	
	没有 callback 参数时
	console.log({
		msg: ''     // 错误信息
	})
	
#handler
##操作 model 进行数据库保存
	将穿进来的数据全部返回，而不仅仅是 id

#调用关系
##controller 可以调用 handler view
controller 层决定页面的输入输出，session 处理，socket 数据发送

##handler 可以调用 handler model
handler 层决定业务逻辑，对 model 处理，提供从 session 或数据库中获取数据的接口
todo 从缓存中获取数据

##view 可以调用 view
view 层决定页面展示
todo 前后端通用
	
##模块
Tag Image BaseData 作为工具模块供其它模块使用