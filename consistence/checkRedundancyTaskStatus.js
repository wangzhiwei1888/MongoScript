db.taskstatuses.aggregate(
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
