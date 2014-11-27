/**
 * Created by 3er on 11/27/14.
 */
timestack = [
    { start: ISODate("2014-11-25T16:00:00.000Z"),
        end: ISODate("2014-11-25T22:00:00.000Z") },
    { start: ISODate("2014-11-26T16:00:00.000Z"),
        end: ISODate("2014-11-26T21:00:00.000Z") },
];

period = {$or:[]};
timestack.map(function(item) {
    period.$or.push({"localetime": {$gt:item.start,$lt:item.end}});
});

//print(period);
//, "data.properties.q":{$in: ["gdt11","11q"]}
db.tracks.find({$and: [{$or:period.$or}, {"data.event":"EnterHome", "data.properties.q":{$in: ["gdt11","11q"]}}]}).sort({localetime:1})
