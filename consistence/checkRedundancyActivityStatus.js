db.activitystatuses.aggregate(
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