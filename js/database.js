/*
 * @author tangxiaoming@meituan.com.
 *
*/

void function(){

	var DB = openDatabase("meituan", "0.1", "HybridApp@meituan Web SQL Database", 5*1024*1024);
	/**
	 * 表示一张表
	 * @param {String} name 表名
	 * @param {Array}  fileds 表的字段
	 */
	var Table = function(name,fields){
		this.db = DB;
		this.name = name;
		this.fields = fields;

		// 生成values(?,....?,?)。为插入数据做准备。
		this.values = "?" + new Array(fields.length).join(",?");

		// 创建 表。
		this.executeSQL("create table "+name+" ("+fields.join(",")+")",[]);
	};

	Table.prototype = {

		insert:function(parameters){
			var sql = "insert into "+this.name+" ("+this.fields.join(",")+") values("+this.values+")";
			this.executeSQL(sql,parameters);
		},

		query: function(sql,callback){
			if(typeof sql === "function"){
				callback = sql;
				sql = "select * from" + this.name;
			}
			this.executeSQL(sql,[],function(t,r){
				var l  = r.rows.length,ts = r.rows,arr = [];
				for(var i = 0 ; i < l; i ++) arr.push(ts.item(i));
				callback(arr);
			});
		},

		executeSQL:function(sql,parameters,success,error){

			this.db.transaction(function(tx){
				tx.executeSql(sql, parameters, success, function(tx, error){});
			});
		},

		save: function(instance){
			var parameters = [];
			this.fields.forEach(function(name){
				parameters.push(instance[name] === undefined ? "" : instance[name]);
			});
			this.insert(parameters);
		},

		remove: function(instance){
			this.executeSQL("delete from "+this.name+" where id = "+ instance.id)
		}
	};

	var b = new Table("test",["id","name","age"]);
	var instance = {id:1,name:'i',age:29};
	b.query("select * from test",function(tests){
		var obj = tests[tests.length-1];
	});



}();