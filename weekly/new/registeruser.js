var start = ISODate("2014-10-24T00:00:00.000Z")
var end = ISODate("2014-11-23T23:59:59.000Z")
db.tracks.distinct("data.properties.username", {"localetime":{$gte:start,$lt:end},"data.event":"Signup", "data.properties.Success":true})