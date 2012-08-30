// Helper for LocalStorage
/*
	API设计   2012 8 30 0:22

	var storage = new Storage("MT");

	// 以下的数据如果已存在，则进行复制。并不override。
	storage.add("models",[{},{}]); //存放对象数组
	storage.add("model",{});// 存放对象
	storage.add("model.name","aki"); // 给对象的key存放值
	
	storage.get("MT"); // return {models:[],model:{}}
	storage.get("MT.models"); // return [{model1:"wwww"},{}]
	storage.get("MT.model"); // return {name:"aki"};
	storage.get("MT.model.name"); // return "aki";
	
	storage.remove("MT"); 				// remove All
	storage.remove("MT.models"); 		// remove models (Array => [])
	storage.remove("MT.models",index);  // Array.remove(index);
	storage.remove("MT.model"); 		// remove model ({name:"aki"} => {})
	storage.remove("MT.model.name");	// remove model.name
	
	// update的方式会进行重载
	storage.update("MT.models",0,{}); 			// models[0] => {}
	storage.update("MT.model","name","AKI"); 	// model.name => "AKI"
	storage.update("MT.model",{age:19}); 		// model.age = 19

	storage.on("update",function(namespace,value){});
	storage.on("add",function(){});
	storage.on("remove",function(){});
	storage.on("get",function(){});	// 该事件可以影响到目标拿到的数据。用作filter。过滤时间日期格式之类的
	
	end.  0:41
	JL，I Love u.
*/

void function(){

	var localStorage = window.localStorage;

	var mix = function(des, defaults, config){
		if(config) mix(des,config);
		for(var s in defaults){
			des[s] = defaults[s];
		}
		return des;
	};


	var event = (function(){
		
		var eventHandlers = {};

		return {
			on: function(type,handler){
				eventHandlers[type] ? "": eventHandlers[type] = [];
				eventHandlers[type].push(handler);
			},
			fire: function(type){
				if(!eventHandlers[type]) throw new Error("没有这样的事件"+type);
				var me = this,args = arguments;
				eventHandlers[type].forEach(function(handler){
					handler.apply(this,args);
				})
			},
			un: function(type){
				if(!eventHandlers[type]) throw new Error("事件"+type+"尚未注册过");
				delete eventHandlers[type];
			}

		};
	})();

	localStorage.clear();

	var helper = {

		set: function(key,value){
			localStorage.setItem(key,value);
		},

		update: function(key,value){
			localStorage.setItem(key,value);
		},

		remove: function(key){
			localStorage.removeItem(key);
		},

		key: function(){
			return (Date.now()+"").slice(-4) + (Math.random()+"").slice(-5);
		}

	};

	var Storage = function(name){
		this.root = name;
		mix(this,event);
		this.json = {};
	};

	proto = {
		
		add: function(url, key, value){

			var value = value || key,
				names = url.split(".");
			
			names = names.slice(1);
			
			var name = names.splice(-1),
				json = this.json;
			
			names.forEach(function(name,i){
				json[name] = {};
				json = json[name];
			});
			if(typeof key === "string") return json[name][key] = value; 
			Array.isArray(json[name]) ? json[name].push(value) : json[name] = value;
		},

		get: function(url){

			var names = url.split("."),
				obj   = this.json;
			
			names.slice(1).forEach(function(name){
				obj = obj[name];
			});

			return obj;
		},

		remove: function(url){
			var names = url.split("."),
				last  = names.slice(-1)[0],
				obj   = this.json;

			if(names.length === 1 && names[0] === this.root){
				this.json = {};
			}

			names.slice(1).forEach(function(name){
				var tmp = obj[name];
				if(name === last){
					if(typeof tmp === "string"){
						delete obj[name];
					}else{
						obj[name] = Array.isArray(tmp) ? [] : {}; 
					}
				}
				obj = tmp;
			});
		},

		// 保存到Localstorage
		save: function(){
			var obj = this.json,
				keys = "";

			for(var o in obj){
				var target = obj[o];
				if(typeof target === "object" && !Array.isArray(target)){
					keys += o + ",";
					this.save.call(mix({},{root:o,json:target}));
					continue;
				}
				var key = helper.key();
				helper.set(key,JSON.stringify(target));
				keys += key + ",";
			}
			helper.set(this.root,keys);
		},

		get: function(){
			
		}
	};

	Storage.prototype = proto;
	window.Storage = Storage;

}();







