/**
 * Created by HYFY on 15/3/9.
 */
var wrongChallengeActivitiesLength = 0, wrongOtherTaskActivitiesLength = 0;
db.chapters.find({state: 'published'}).forEach(function(chapter){
    chapter.topics.forEach(function(topicId){
        var topic = db.topics.findOne({_id: topicId});
        if(topic){
            topic.tasks.forEach(function(taskId){
                var task = db.tasks.findOne({_id: taskId});
                if(task.type === 'challenge'){
                    if(task.activities.length !== 3){
                        ++wrongChallengeActivitiesLength;
                        print(task._id + '的activities长度为' + task.activities.length);
                    }
                } else {
                    if(task.activities.length === 0){
                        ++wrongOtherTaskActivitiesLength;
                        print(task,_id + '的activities长度为0');
                    }
                }
            });
        }
    });
});
print('有问题的challengeTask的个数:' + wrongChallengeActivitiesLength);
print('有问题的otherTask的个数:' + wrongOtherTaskActivitiesLength);

//以下逻辑基于所有的chapter
//查找activities不足3个的challenge_task
//db.tasks.aggregate([
//    {
//        $group: {
//            _id: {
//                id: "$_id",
//                type: "$type"
//            },
//            activities: {
//                $first: '$activities'
//            }
//        }
//    },
//    {
//        $project: {
//            _id: 1,
//            activities: 1
//        }
//    },
//    {
//        $match: {
//            '_id.type': 'challenge',
//            'activities.2': {$exists: false}
//        }
//    }
//]);

//查找activities超过3个的challenge task
//db.tasks.aggregate([
//    {
//        $group: {
//            _id: {
//                id: "$_id",
//                type: "$type"
//            },
//            activities: {
//                $first: '$activities'
//            }
//        }
//    },
//    {
//        $project: {
//            _id: 1,
//            activities: 1
//        }
//    },
//    {
//        $match: {
//            '_id.type': 'challenge',
//            'activities.3': {$exists: true}
//        }
//    }
//]);