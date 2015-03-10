db.checkActTask.drop();
db.checkResult.drop();
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
                _id: 0
            }
        },
        {
            $out: "checkActTask"
        }
    ]
);

db.taskstatuses.find({}).forEach(function(taskStatus){
    db.checkActTask.save({user:taskStatus.user,task:taskStatus.task,isPassed:taskStatus.isPassed});
})

db.tasks.find({}).forEach(function(task){
    db.checkActTask.update(
        {task:task._id, activities:{$all:task.activities}},
        {$set:{isPassed:true}},
        {multi:true});
});
db.checkActTask.update(
    {isPassed:{$exists:false}},
    {$set:{isPassed:false}},
    {multi:true});

db.checkActTask.aggregate(
    [
        {
            $project: {
                user: 1,
                task: 1,
                activities :1,
                isPassed: 1,
                mark: {$ifNull: ['$activities', 'fromTaskStatus']}
            }
        },
        {
            $group: {
                _id: {user:"$user",task:"$task"},
                isPassed: {$addToSet: "$isPassed"},
                //activities: {$addToSet: "$activities"},
                mark: {$addToSet: "$mark"}
            }
        },
        {
            $match: {
                isPassed: {$size:2}
            }
        },
        {
            $out: 'checkResult'
        }
    ]
);