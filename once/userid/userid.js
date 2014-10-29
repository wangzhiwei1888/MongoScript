//查看 没有|有 id的个数，确保不会出现数据总数不变
db.tracks.find({"data.properties._id":{$exists: true}}).count()
db.tracks.find({"data.properties._id":{$exists: false}}).count()

//查找没有_id的track数据中username的合集
db.tracks.distinct("data.properties.username",{"data.properties._id":{$exists: false}})

// _id补全
db.users.find({
    "username":{$in:[]}
}).forEach(function (doc) {
        db.tracks.update(
            {
                "data.properties.username": doc.username,
                "data.properties._id": {$exists: false}
            }, {
                $set: {
                    "data.properties._id": doc._id.str
                }
            }, {
                multi: true
            });
    });

// 确认用户是否存在
db.users.distinct("username", {"username": {$in:[
]}});
