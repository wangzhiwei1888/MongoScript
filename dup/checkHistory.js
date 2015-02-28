//删除taskstatuses冗余history数据:一个用户，一个task只保留一条taskstatuses记录
var historyArr = db.taskstatuses.aggregate([
    {
        $group: {
            _id: {user: '$user', task: '$task'},
            count: {$sum: 1},
            createAt: {$min: '$createAt'}
        }
    },
    {
        $match: {
            count: {$gt: 1}
        }
    }
]);

historyArr.result.forEach(function(res){
    db.taskstatuses.remove({
        user: res._id.user, task: res._id.task, createdAt: res.createdAt
    })
});