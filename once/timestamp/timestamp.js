// 观察没有timestamp的数据中的headers.time
// a. 是否存在
// b. 格式是否相同
db.tracks.distinct("headers.time",{"timestamp":{$exists: false}})

db.tracks.find({timestamp:{$exists: false}}).forEach(function(doc){
    //print(doc.headers.time*1000)
    //print(ISODate("2014-07-12T03:44:23.472Z").getTime())
    var date = new Date(doc.headers.time * 1000);
    //print(date);
    db.tracks.update({_id:doc._id}, {$set:{"timestamp":date, "headers.time": date}});
});