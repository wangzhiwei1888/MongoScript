// 因为运营需要很多以天计算的的数据分析请求，而Mongo中确实用UTC来存储时间的，且比如$dayofweek等内置时间运算符都是基于utc时间，无法基于本地时间。
// 故存储时存储两个时间

db.tracks.find({localetime:{$exists: false}}).forEach(function (doc) {
//    print(doc.timestamp)
//    print(new Date(doc.timestamp.getTime() + 8 * 60 * 60 * 1000 ));

    var date = new Date(doc.timestamp.getTime() + 8 * 60 * 60 * 1000 );
    db.tracks.update({_id:doc._id}, {$set:{"localetime":date}});
});