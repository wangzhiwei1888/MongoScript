function activity(){
    var dup = db.activitystatuses.aggregate(
        [
            {
                $group: {
                    _id: {user:"$user",activity:"$activity"},
                    count: { $sum : 1 },
// 发现所有数据完全相同
//            isPassed: {$addToSet: "$isPassed" },
//            videos: {$addToSet: "$videos"},
//            problems: {$addToSet: "$problmems"},
// 删除开始的那个
                    createdAt: {$min: "$createdAt"}
                }
            },
            {
                $match: {
                    count: {$gt:1}
// 发现所有数据完全相同
//            $or: [
//                {isPassed: {$size:2}},
//                {videos: {$size:2}},
//                {problems: {$size:2}}
//            ]
                }
            }
        ]
    );

    print(dup.result.length);

    dup.result.forEach(function(res){
//    print(res._id.user + ' ' + res._id.activity + ' ' + res.createdAt);

        // 一定只删除一个，所以一定要带上createAt
        db.activitystatuses.remove({user:res._id.user, activity:res._id.activity, createdAt:res.createdAt});
    })
    if(dup.result && dup.result.length != 0){
        activity();
    }
}
activity();
function task(){
    var dup = db.taskstatuses.aggregate(
        [
            {
                $group: {
                    _id: {user:"$user",task:"$task"},
                    count: { $sum : 1 },
                    isPassed: {$max: "$isPassed" },
                    star: {$max: "$star"},
// 删除前面那个
                    createdAt: {$min: "$createdAt"}
                }
            },
            {
                $match: {
                    count: {$gt:1}
                }
            }
        ]
    );

    print(dup.result.length);

    dup.result.forEach(function(res){
//    print(res._id.user + ' ' + res._id.task + ' ' + res.createdAt + ' ' + res.isPassed + ' ' + res.star);

        // 发现有些任务星星数大于3
        if(res.star > 3) res.star = 3;
        if(res.star < 0) res.star = 0;
//
//    // 一定只删除一个，所以一定要带上createAt
        db.taskstatuses.remove({user:res._id.user, task:res._id.task, createdAt:res.createdAt});
        db.taskstatuses.update({user:res._id.user, task:res._id.task},
            {$set: {isPassed:res.isPassed, star:NumberInt(res.star)}}, {multi:true});
    });
    if(dup.result && dup.result.length != 0){
        task();
    }
}
task();



//var dup = db.activitystatuses.aggregate(
//[
//    {
//        $group: {
//            _id: {user:"$user",activity:"$activity"},
//            count: { $sum : 1 },
//// 发现所有数据完全相同
////            isPassed: {$addToSet: "$isPassed" },
////            videos: {$addToSet: "$videos"},
////            problems: {$addToSet: "$problmems"},
//// 删除开始的那个
//            createdAt: {$min: "$createdAt"}
//        }
//    },
//    {
//        $match: {
//            count: {$gt:1}
//// 发现所有数据完全相同
////            $or: [
////                {isPassed: {$size:2}},
////                {videos: {$size:2}},
////                {problems: {$size:2}}
////            ]
//        }
//    }
//]
//);
//
////print(dup);
//
//dup.result.forEach(function(res){
////    print(res._id.user + ' ' + res._id.activity + ' ' + res.createdAt);
//
//    // 一定只删除一个，所以一定要带上createAt
//    db.activitystatuses.remove({user:res._id.user, activity:res._id.activity, createdAt:res.createdAt});
//})
//
//dup = db.taskstatuses.aggregate(
//[
//    {
//        $group: {
//            _id: {user:"$user",task:"$task"},
//            count: { $sum : 1 },
//            isPassed: {$max: "$isPassed" },
//            star: {$max: "$star"},
//// 删除前面那个
//            createdAt: {$min: "$createdAt"}
//        }
//    },
//    {
//        $match: {
//            count: {$gt:1}
//        }
//    }
//]
//);
//
////print(dup);
//
//dup.result.forEach(function(res){
////    print(res._id.user + ' ' + res._id.task + ' ' + res.createdAt + ' ' + res.isPassed + ' ' + res.star);
//
//    // 发现有些任务星星数大于3
//    if(res.star > 3) res.star = 3;
//    if(res.star < 0) res.star = 0;
////
////    // 一定只删除一个，所以一定要带上createAt
//    db.taskstatuses.remove({user:res._id.user, task:res._id.task, createdAt:res.createdAt});
//    db.taskstatuses.update({user:res._id.user, task:res._id.task},
//    {$set: {isPassed:res.isPassed, star:NumberInt(res.star)}}, {multi:true});
//});
//
