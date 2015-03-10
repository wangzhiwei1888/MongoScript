db.checkTotalStar.drop();
db.taskstatuses.aggregate([
    {
        $group: {
            _id: '$user',
            totalStar: {$sum: '$star'}
        }
    },
    {
        $out: 'checkTotalStar'
    }
]);
var number = 0;
db.checkTotalStar.find().forEach(function(res){
    var user = db.wealths.findOne({userId: res._id});
    if(user.totalStar != res.totalStar) {
        number++;
        db.wealths.update({userId: res._id}, {$set: {totalStar: res.totalStar}});
    };
});
print(number);