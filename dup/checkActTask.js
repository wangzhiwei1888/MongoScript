db.checkActTask.drop();
db.taskstatuses.copyTo("checkActTask");
db.activitystatuses.aggregate(
        [
            {
                $group: {
                    _id: {user:"$user",task:"$task"},
                    activities: {$addToSet: "$activity"}
                }
            },
            {
                $project: {
                    activities: 1,
                    count: { $size: "$activities"}
                    //isPassed : false
                }
            },
            {
                $out: "checkActTask"
            }
        ]
    );
db.checkActTask.update({}, {$set: {isPassed: false}}, {multi: true});
db.tasks.find({}).forEach(function(task){
    db.checkActTask.update(
        {'_id.task':task._id, activities:{$all:task.activities}},
        {$set:{isPassed:true}}, 
        {multi:true});
});

db.checkActTask.aggregate(
    [
        {
            $group: {
                _id: {user:"$_id.user",task:"$_id.task"},
                isPassed: {$addToSet: "$isPassed"},
                num: {$sum: 1}
                //activities: "$activities"
            }
        },
        {
            $match: {
                num: {$gt: 1}
            }
        }
    ]
); 
