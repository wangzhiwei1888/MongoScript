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
    if(user.totalStar != res.totalStar) ++number;
});
print(number);