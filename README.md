# kukuma

  为了Hybrid App做的Web SQL Database Helper。
  
  
  不足之处还请多多提提。[AKI](http://weibo.com/natsuayiaki)


# Examples
一些简单用法：

1.创建一张表
```javascript
// 这就是user表，包含三个字段：id username password
var user = new Table("user",["id","username","password"]);
```
2.插入一条数据
```javascript
// 数据库插入
user.insert([Date.now(),"AKI","haha"]);
// 实例保存
user.save(user.getInstance([Date.now(),"AKI","haha"]));
var instance = {id:Date.now(),name:"AKI",password:"haha"};
user.save(instance);

```
3.更新一条数据
```javascript
// 实例更新
var instance = {id:213123123123,name:"AKI",password:"haha-->Updated"};
user.update(instance);
```
4.remove数据
```javascript
// 删除实例
var instance = {id:213123123123,name:"AKI",password:"haha-->Updated"};
user.remove(instance);
```