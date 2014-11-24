/**
 * Created by 3er on 11/24/14.
 */

var start = ISODate("2014-10-24T00:00:00.000Z")
var end = ISODate("2014-11-23T23:59:59.000Z")
db.tracks.aggregate(
    [
        { $match: {"data.event":{$in: ["RateVideo"]}, "localetime":{$gt:start,$lt:end}}},
        { $group : { _id : { LessonId:"$data.properties.LessonId"} , title: {$last: "$data.properties.LessonTitle"},
            rate : { $avg: "$data.properties.Rate"},
            sum: { $sum: 1 } } },
        { $sort : { "rate" : 1 } }
    ]
)
