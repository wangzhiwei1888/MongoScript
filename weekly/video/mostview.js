/**
 * Created by 3er on 11/24/14.
 */
var start = ISODate("2014-11-10T00:00:00.000Z")
var end = ISODate("2014-12-20T23:59:59.000Z")
db.tracks.aggregate(
    [
        { $match: {"localetime":{$gt:start,$lt:end}}},
        { $project : { day : { $dayOfYear : "$localetime" } } } ,
        { $group : { _id : { username:"$data.properties.username", day:"$day"} }}
    ]
)

