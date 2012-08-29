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

	var set = function(key,value){

		if(Array.isArray(key)){
			key.forEach(function(k){
				set(k.key,key.value);
			});
		}

		localStorage.setItem(key,value);

	};

	var get = function(key){
		return localStorage.getItem(key);
	};

	var guidlike = function(){

		return Date.now()+Math.random();
	};

	// namespace
	// 数据格式
	// "MT.name":{}
	// 所有的数据都是 有独特的ID。只是一个引用便可。
	// 格式为： block : key,value
	// set("MT","") 存放 MT数据的联系。node

	var Block = function(key,value){
		this.type = "block";
		this.key  = key;
		this.value = value;
	};

	var Node  = function(key){
		this.type = "node";
		this.key = key;
		this.value = [];
	};

	var toLocalStorage = function(){
		set(this.key,JSON.stringify(this.value));
	};

	Block.prototype.toLocalStorage = toLocalStorage;
	Node.prototype.toLocalStorage  = toLocalStorage;


	var add = function(name,target){

		if(Array.isArray(target)){
			var node = new Node(name);
			target.forEach(function(t){
				var key = guidlike();
				var	block = new Block(key,t);
				block.toLocalStorage();
				node.value.push(key);
			});
			return node.toLocalStorage();
		}

		for(var key in target){
			var node = new Node(key),
				obj  = target[key];

			var guid = guidlike(),
				block = new Block(guid,obj);
			node.value.push(guid);

			block.toLocalStorage();
			node.toLocalStorage();

		}

	};



	var base = function(name){
		this.name = name;
		this.data = {};
		set(this.name,"[]");
	};

	base.prototype = {

		save: function(){
			var keys = JSON.parse(get(this.name));
			for(var key in this.data){
				keys.push(key);
				set(this.name+"."+key,JSON.stringify(this.data[key]));
			}
		},

		add: function(key,value){
			var me = this;
			if (Array.isArray(key)) {
				key.forEach(function(item){
					me.data[item.id] = item;
				});
			} else if (typeof key === "object") {
				for (var k in key) {
					this.data[k] = key[k];
				}
			} else {
				this[key] = value;
			}
		},

		get: function(key){
			var str = get(this.name+"."+key);
			return JSON.parse(str);
		}

	};

	window.Store = base;



		// tree: JSON.parse(get(base.root)|{}),

		// create: function(name){
		// 	tree[name] = {};
		// 	set(base.root,tree);
		// },
		
		// update: function(url,value){
		// 	set(url,value);
		// },

		// remove: function(){
			
		// };


}();









