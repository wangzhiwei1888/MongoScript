db.checkActTask.drop();
db.taskstatuses.copyTo("checkActTask");
db.activitystatuses.aggregate(
        [
            { 
                $group: {
                    _id: {user:"$user",task:"$task"},
                    activities: {$addToSet: "$activity"},
                    user: {$first:"$user"},
                    task: {$first:"$task"}
                }
            },
            {
                $project: {
                    activities: 1,
                    user: 1,
                    task: 1,
                    isPassed : false
                }
            },
            {
                $out: "checkActTask"
            }
        ]
    );

db.tasks.find({}).forEach(function(task){
    db.checkActTask.update(
        {task:task._id, activities:{$all:task.activities}},
        {$set:{isPassed:true}}, 
        {multi:true});
});

db.checkActTask.aggregate(
    [
        {
            $group: {
                _id: {user:"$user",task:"$task"},
                isPassed: {$addToSet: "$isPassed"},
                activities: {$addToSet: "$activities"}
            }
        },
        {
            $match: {
                isPassed: {$size:2}
            }
        }
    ]
); 
