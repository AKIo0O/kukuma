/*
 * @author tangxiaoming@meituan.com.
 *
*/

void function(){

	var DB = openDatabase("meituan", "0.1", "HybridApp@meituan Web SQL Database", 5*1024*1024);
	
	DB.getTable = function(name){
		return localStorage.getItem("table-"+name+"-fileds") ? 
			new Table(name,f.split(",")) : alert("没有此表");
	};

	/**
	 * 表示一张表
	 * @param {String} name 表名
	 * @param {Array}  fileds 表的字段
	 */
	var Table = function(name,fields){
		
		this.db = DB;
		this.name = name;
		this.fields = fields;

		if(localStorage.getItem("table-"+name+"-fileds")==null) {
			localStorage.setItem("table-"+name+"-fileds",fields.join(","));
		}
		// 生成values(?,....?,?)。为插入数据做准备。
		this.values = "?" + new Array(fields.length).join(",?");
		// 创建 表。
		this.executeSQL("create table "+name+" ("+fields.join(",")+")",[]);
	};



	Table.prototype = {

		// 插入一条数据
		insert:function(parameters){
			var sql = "insert into "+this.name+" ("+this.fields.join(",")+") values("+this.values+")";
			this.executeSQL(sql,parameters);
		},

		// 查询数据 by SQL 或者默认 查询整个表
		findAll: function(sql,callback){
			if(typeof sql === "function"){
				callback = sql;
				sql = "select * from " + this.name;
			}
			this.executeSQL(sql,[],function(t,r){
				var l  = r.rows.length,ts = r.rows,arr = [];
				for(var i = 0 ; i < l; i ++) arr.push(ts.item(i));
				callback(arr);
			});
		},

		findById: function(id,callback){
			this.findBy("id",id,callback);
		},

		findBy: function(key,value,callback){
			var sql = "select * from " + this.name + " where "+key+"='"+value+"'";
			this.findAll(sql,callback);
		},

		// 执行SQL语句
		executeSQL:function(sql,parameters,success,error){

			this.db.transaction(function(tx){
				tx.executeSql(sql, parameters, success, function(tx, error){});
			});
		},

		// 保存一个实例 进入数据库
		save: function(instance){
			var parameters = [];
			this.fields.forEach(function(name){
				parameters.push(instance[name] === undefined ? "" : instance[name]);
			});
			this.insert(parameters);
		},

		// 从数据删除一个实例
		remove: function(instance){
			this.executeSQL("delete from "+this.name+" where id = "+ instance.id)
		},

		removeAll: function(){
			this.executeSQL("delete from "+ this.name);
		},

		// 更新数据库数据
		update: function(instance){
			var str = "";
			for(var o in instance){
				str += o == "id" ? "" : o + "='" + instance[o]+"',";
			}
			str = str.slice(-1) === "," ? str.slice(0,-1) : str;
			this.executeSQL("update "+this.name+" set "+ str +" where id="+instance.id);
		},

		// 通过数组获得一个具体实例 var user = User.getInstance([1,"aki",19]);
		// user --> {id:1, name: "aki", age:19} 
		getInstance: function(values){
			var instance = {};
			this.fields.forEach(function(name,i){
				instance[name] = values[i];
			});
			return instance;
		}

	};


	window.Table = Table;
	window.DB = DB;
}();