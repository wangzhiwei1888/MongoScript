db.retention.drop();
var start   = ISODate("2015-02-13T00:00:00+08:00")
var end     = ISODate("2015-02-14T00:00:00+08:00")
var next    = ISODate("2015-02-15T00:00:00+08:00")

var todayA = db.users.distinct("_id", {"usefulData.registDate":{$gte:start,$lt:end}});
var today = todayA.length;
var todayTask = db.taskstatuses.distinct("user", {"user":{$in:todayA}, isPassed:true,  "createdAt":{$gte:start,$lt:end}});
var tmr = db.points.distinct("user", {"user":{$in:todayA}, "createdBy":{$gte:end,$lt:next}}).length;

print(today)
print(todayTask.length)
print(todayTask.length/today)
print(tmr/today)
