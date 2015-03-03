db.retention.drop();
var start   = ISODate("2015-02-26T08:00:00.000Z")
var end     = ISODate("2015-02-27T08:00:00.000Z")
var next    = ISODate("2015-02-28T08:00:00.000Z")

var todayA = db.points.distinct("user", {"createdBy":{$gte:start,$lt:end}});
var today = todayA.length;
var todayTask = db.taskstatuses.distinct("user", {"user":{$in:todayA}, isPassed:true,  "createdAt":{$gte:start,$lt:end}});
var tmr = db.points.distinct("user", {"user":{$in:todayA}, "createdBy":{$gte:end,$lt:next}}).length;

print(todayTask.length/today)
print(tmr/today)