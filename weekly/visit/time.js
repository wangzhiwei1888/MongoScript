/**
 * Created by 3er on 11/24/14.
 */
var start = ISODate("2014-10-24T00:00:00.000Z")
var end = ISODate("2014-11-23T23:59:59.000Z")
db.tracks.aggregate(
    [
        { $match: {"localetime":{$gt:start,$lt:end}}},
        { $project : { day : { $dayOfYear: "$localetime"}, username: "$data.properties.username"} },
        { $group : { _id : "$username" , date: {$addToSet: "$day"}}},
        { $sort : { "date" : -1 } }
    ]
)

//run in chrome console
var a = '';
for(var i = 0; i < abc.length; i++) {
    var obj = abc[i];
    a+=('{"username":"' + obj.username + '","times":' + obj.date.length + '},');
}

//mongo shell
var cursor = db.users.find({},{username:1,email:1,phone:1,grade:1,q:1});
while (cursor.hasNext()) {
    print(tojson(cursor.next())+',');
}



for(i in b){
    if(Object.keys(b[i]).length>1){
        console.log(b[i])
    }
}