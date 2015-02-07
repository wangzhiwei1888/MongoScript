// var conn = new Mongo();
// var db = conn.getDB('target');
// var startTime = new Date().valueOf();

db.scores.ensureIndex({userId: 1});
db.taskstatuses.ensureIndex({user: 1});

var totalStar = 0;
db.users.find().forEach(function(user){
	if(!user.profile){
		user.profile = {};
		user.profile.gender = 'male';
	} 
	db.taskstatuses.find({user: user._id}).forEach(function(taskstatus){
		if(taskstatus && taskstatus.star && typeof taskstatus.star === 'number'){
			totalStar += taskstatus.star;
		}
	});
	var score = db.scores.findOne({username: user.privacy.username});
	if(score){
		db.wealths.insert({
			userId: user._id,
			achievement: [],
			topics: [],
			avatars: score.achieve,
			coin: score.coin,
			sortableStar: 0,
			totalStar: totalStar,
			totalScore: score.totalScore,
			sortableScore: score.sortScore,
			avatar: score.avatar ? score.avatar.replace('/webapp/common/resources/img/', '/assets/') : ''
		});
	} else{
		var newUserWealth = {
			userId: user._id,
			achievement: [],
			topics: [],
			avatars: [],
			coin: 0,
			sortableStar: 0,
			totalStar: totalStar,
			totalScore: 0,
			sortableScore: 0,
			avatar: user.profile.gender === 'female' ? '/assets/studentf.png' : '/assets/studentm.png'
		};
		db.wealths.insert(newUserWealth);
	}
	totalStar = 0;
});
db.goods.find().forEach(function(good){
	db.goods.update({_id: good._id}, {
		$set: {
		    "link": good.link.replace('/webapp/common/resources/img/', '/assets/'),
			"details": 'avatar',
			"goodType": 'decoration',
			"unlockedCoin": 0,
			"tag": good.link.indexOf('thanks') !== -1 ? '感恩节头像' : good.link.indexOf('qimo') !== -1 ? '期末活动头像' : '普通头像',
			"index": good.link.indexOf('thanks') !== -1 ? 1 : good.link.indexOf('qimo') !== -1 ? 2 : 0
		},
		$unset: {
			"label":1,
			"property":1
		}
	});
});
// var endTime = new Date().valueOf();
// print((endTime - startTime)/1000/60 + '分');
db.scores.drop();